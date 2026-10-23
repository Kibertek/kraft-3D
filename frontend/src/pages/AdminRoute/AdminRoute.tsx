import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentAdmin } from "@services/api";

function AdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<"checking" | "authorized" | "unauthorized">("checking");

  useEffect(() => {
    let active = true;

    getCurrentAdmin()
      .then(() => {
        if (active) setState("authorized");
      })
      .catch(() => {
        if (active) setState("unauthorized");
      });

    return () => {
      active = false;
    };
  }, []);

  if (state === "checking") {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#101010", color: "#888" }}>
        Проверка доступа…
      </main>
    );
  }

  if (state === "unauthorized") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default AdminRoute;
