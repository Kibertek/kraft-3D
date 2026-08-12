import Hero from "@components/Hero/Hero";
import Services from "@components/Services/Services";
import About from "@components/About/About";
import Contacts from "@components/Contacts/Contacts";
import Footer from "@components/Footer/Footer";
import Gallery from "@components/Gallery/Gallery";

function Main() {
  return (
    <>
      <Hero />

      <Gallery />

      <Services />

      <About />

      <Contacts />

      <Footer />
    </>
  );
}

export default Main;