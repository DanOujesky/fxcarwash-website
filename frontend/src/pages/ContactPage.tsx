import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MyMap from "../components/MyMap";

function ContactPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center  flex-col gap-1">
        <h2 className="text-white page-title-size mb-7">KONTAKT</h2>
        <p className="text-center text-ml">
          NAJDETE NÁS U ČERPACÍ STANICE MOL HORNÍ BŘÍZA
        </p>
        <p className="text-ml ">TŘÍDA 1. MÁJE, 330 12 HORNÍ BŘÍZA</p>
      </div>
      <div className="w-full h-60 lg:h-180 relative">
        <img
          className="w-full h-full object-cover"
          src="/images/car-contact-image-1.webp"
          alt="image-1"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col">
          <p className="text-3xl md:text-5xl lg:text-6xl ">+420 723 372 912</p>
          <p className="text-3xl md:text-5xl lg:text-6xl">SALES@FXCARWASH.CZ</p>
        </div>
      </div>
      <div className="w-full h-60 lg:h-79 body-bg-color flex flex-col justify-center items-center gap-1">
        <h3 className="text-4xl lg:text-6xl mb-3 text-center">
          NAVŠTIVTE NÁS NA ADRESE
        </h3>
        <p className="text-ml lg:text-xl">TŘÍDA 1. MÁJE, 330 12 HORNÍ BŘÍZA</p>
        <p className="text-ml lg:text-xl font-medium">OTEVŘENO 24/7</p>
      </div>
      <div className="w-full h-60 lg:h-180">
        <MyMap></MyMap>
      </div>
      <div className="w-full h-180 body-bg-color flex flex-col justify-center items-center gap-10">
        <h3 className="text-4xl">KONTAKTUJTE NÁS</h3>
        <ContactForm />
      </div>
      <Footer></Footer>
    </div>
  );
}

export default ContactPage;
