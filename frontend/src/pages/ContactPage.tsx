import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MyMap from "../components/MyMap";

function ContactPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-1 px-6 lg:px-10">
        <h2 className="text-white page-title-size mb-7">KONTAKT</h2>
        <p className="textUnder max-w-4xl">
          NAJDETE NÁS U ČERPACÍ STANICE MOL HORNÍ BŘÍZA
        </p>
        <p className="textUnder max-w-4xl">
          K ČERNÉMU MOSTU, 330 12 HORNÍ BŘÍZA
        </p>
      </div>
      <div className="w-full h-60 lg:h-180 relative">
        <img
          className="w-full h-full object-cover"
          src="/images/Image-13.jpg"
          alt="image-1"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col w-full px-4">
          <a
            href="tel:+420603159572"
            className="contactText textContact font-medium text-center hover:text-gray-300 transition-colors"
          >
            +420 603 159 572
          </a>
          <a
            href="mailto:sales@fxcarwash.cz"
            className="contactText textContact font-medium text-center hover:text-gray-300 transition-colors"
          >
            SALES@FXCARWASH.CZ
          </a>
        </div>
      </div>
      <div className="w-full h-60 lg:h-79 body-bg-color flex flex-col justify-center items-center gap-1">
        <h3 className="text-4xl lg:text-6xl mb-3 text-center">
          NAVŠTIVTE NÁS NA ADRESE
        </h3>
        <p className="textUnder">K ČERNÉMU MOSTU, 330 12 HORNÍ BŘÍZA</p>
        <p className="textUnder font-medium">OTEVŘENO 24/7</p>
      </div>
      <div className="w-full h-60 lg:h-180">
        <MyMap></MyMap>
      </div>
      <div className="w-full header-color flex flex-col justify-center items-center gap-6 px-6 sm:px-10 py-14 lg:py-20 text-center">
        <h3 className="text-3xl lg:text-4xl">ZÁKAZNICKÁ PODPORA</h3>
        <p className="text-[14px] lg:text-[16px] max-w-3xl text-justify hyphens-auto">
          V případě technického problému, dotazu k platbě nebo připomínky
          k&nbsp;našim službám nás kontaktujte na tel.:{" "}
          <a
            href="tel:+420603159572"
            className="contactText font-bold underline underline-offset-4 hover:text-gray-300 transition-colors"
          >
            +420 603 159 572
          </a>{" "}
          nebo na{" "}
          <a
            href="mailto:sales@fxcarwash.cz"
            className="contactText font-bold underline underline-offset-4 hover:text-gray-300 transition-colors"
          >
            sales@fxcarwash.cz
          </a>
          . Vaše podněty nám pomáhají naše služby neustále zlepšovat.
        </p>
      </div>
      <div className="w-full min-h-[40rem] body-bg-color flex flex-col justify-center items-center gap-10 py-16">
        <h3 className="text-4xl text-center">KONTAKTUJTE NÁS</h3>
        <ContactForm />
      </div>
      <Footer></Footer>
    </div>
  );
}

export default ContactPage;
