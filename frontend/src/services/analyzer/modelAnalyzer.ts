import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import printing from "@config/printing";

export interface ModelAnalysis {
  fileName: string;
  fileSize: number;
  fileType: string;

  volume: number | null;
  weight: number | null;
  printTime: number | null;
  price: number | null;
}

export function getFileType(fileName: string): string {
  const extension = fileName
    .split(".")
    .pop()
    ?.toLowerCase();

  switch (extension) {
    case "stl":
      return "STL";

    case "3mf":
      return "3MF";

    case "obj":
      return "OBJ";

    default:
      return "Неизвестный";
  }
}

export function createInitialAnalysis(
  file: File
): ModelAnalysis {
  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: getFileType(file.name),

    volume: null,
    weight: null,
    printTime: null,
    price: null,
  };
}

export async function analyzeSTL(
  file: File
): Promise<number> {
  const loader = new STLLoader();

  const buffer = await file.arrayBuffer();

  const geometry = loader.parse(buffer);

  geometry.computeBoundingBox();

  const position = geometry.getAttribute("position");

  let volume = 0;

  const triangle = new THREE.Triangle();

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();

  for (let i = 0; i < position.count; i += 3) {
    a.fromBufferAttribute(position, i);
    b.fromBufferAttribute(position, i + 1);
    c.fromBufferAttribute(position, i + 2);

    triangle.set(a, b, c);

    volume += signedVolumeOfTriangle(
      triangle.a,
      triangle.b,
      triangle.c
    );
  }

  geometry.dispose();

  return Math.abs(volume);
}

function signedVolumeOfTriangle(
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3
): number {
  return a.dot(b.clone().cross(c)) / 6;
}


export function calculateMaterial(
  volume: number
) {
  const volumeCm3 = volume / 1000;

  const weight =
    volumeCm3 *
    printing.filament.density;

  const price =
    (weight / 1000) *
    printing.filament.pricePerKg;

  return {
    weight,
    price,
  };
}