import { Route, Routes } from "react-router-dom";
import Header from "@components/Header/Header";
import Main from "@components/Main/Main";
import SocialLinks from "@components/SocialLinks/SocialLinks";
import AdminGalleryPage from "@pages/AdminGalleryPage/AdminGalleryPage";
import AdminLoginPage from "@pages/AdminLoginPage/AdminLoginPage";
import AdminPage from "@pages/AdminPage/AdminPage";
import AdminRoute from "@pages/AdminRoute/AdminRoute";

function HomePage() {
  return (
    <>
      <Header />
      <Main />
      <SocialLinks />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/gallery"
        element={
          <AdminRoute>
            <AdminGalleryPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
