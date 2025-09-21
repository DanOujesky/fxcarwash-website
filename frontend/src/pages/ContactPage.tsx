import Footer from "../components/Footer";
import Header from "../components/Header";
import MyMap from "../components/MyMap";

function ContactPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center  flex-col gap-1">
        <h2 className="text-white page-title-size mb-7">KONTAKT</h2>
        <p className="">NAJDETE NÁS U ČERPACÍ STANICE MOL HORNÍ BŘÍZA</p>
        <p>TŘÍDA 1. MÁJE, 330 12 HORNÍ BŘÍZA</p>
      </div>
      <div className="w-full h-180 relative">
        <img
          className="w-full h-full object-cover"
          src="src/assets/car-contact-image-1.webp"
          alt="image-1"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col">
          <p className="text-7xl ">+420 723 372 912</p>
          <p className="text-7xl">SALES@FXCARWASH.CZ</p>
        </div>
      </div>
      <div className="w-full h-180 body-bg-color flex flex-col justify-center items-center gap-1">
        <h3 className="text-6xl mb-3">NAVŠTIVTE NÁS NA ADRESE</h3>
        <p className="text-xl">TŘÍDA 1. MÁJE, 330 12 HORNÍ BŘÍZA</p>
        <p className="text-xl font-medium">OTEVŘENO 24/7</p>
      </div>
      <div className="w-full h-180">
        <MyMap></MyMap>
      </div>
      <div className="w-full h-180 body-bg-color flex flex-col justify-center items-center gap-10">
        <h3 className="text-4xl">KONTAKTUJTE NÁS</h3>
        <form className="grid grid-cols-2 gap-x-10 gap-y-8 w-300 place-items-center">
          <input
            className="bg-white placeholder:font-light text-black placeholder:text-black p-6 w-full h-15 rounded-xs text-xl focus:outline-none"
            type="email"
            placeholder="EMAIL"
          />
          <input
            className="bg-white focus:outline-none placeholder:font-light text-black placeholder:text-black p-6 w-full h-15 rounded-xs text-xl"
            type="text"
            placeholder="TELEFON"
          />
          <textarea
            className="bg-white focus:outline-none placeholder:font-light text-black placeholder:text-black col-span-2 p-6 w-full h-30 rounded-xs text-xl"
            name="poznamka"
            id="poznamka"
            placeholder="POZNÁMKA"
          ></textarea>
          <input
            className="border-1 border-white  col-span-2 w-100 h-15 font-medium hover:text-black hover:bg-white"
            type="submit"
            value="ODESLAT"
          />
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default ContactPage;
