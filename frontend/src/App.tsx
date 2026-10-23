import { Route, Routes } from "react-router-dom";
import Header from "@components/Header/Header";
import Main from "@components/Main/Main";
import SocialLinks from "@components/SocialLinks/SocialLinks";
import AdminPage from "@pages/AdminPage/AdminPage";

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
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
