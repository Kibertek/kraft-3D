import Hero from "@components/Hero/Hero";
import Services from "@components/Services/Services";
import About from "@components/About/About";
import Contacts from "@components/Contacts/Contacts";
import Footer from "@components/Footer/Footer";
import UploadZone from "@components/UploadZone/UploadZone";
<UploadZone />

function Main() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Contacts />
      <Footer />
    </>
  );
}

export default Main;