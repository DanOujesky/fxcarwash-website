import Footer from "../components/Footer";
import Header from "../components/Header";

function AboutPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-5">
        <h2 className="text-white page-title-size mb-7t mx-10">
          MODERNÍ MYCÍ CENTRUM
        </h2>
        <p className="mx-10 text-ml">
          Zakládáme si na kvalitě a využití inovativních technologií. Spojujeme
          vášeň pro krásná auta s technologiemi, které Vaše auto ošetří
          efektivně a zároveň šetrně.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full py-10  lg:py-20 flex justify-center items-center px-10 lg:px-30 body-bg-color">
          <div className="flex flex-col gap-10 items-center justify-center">
            <h3 className="text-4xl">O nás</h3>
            <div>
              <p className="text-[14px] text-justify">
                Partnerem našeho projektu je společnost MyWash, která má v
                oblasti realizace bezkontaktních mycích center dlouholeté
                zkušenosti. Kvalitní komponenty zajišťují vysokou účinnost
                umytí, s důrazem na ekologické řešení, úsporu vody a maximální
                komfort pro zákazníky. Vše doplňuje příjemný a nadčasový design
                myčky.
              </p>
              <p className="text-[14px] mt-5 text-justify">
                Máme zájem Vám nabídnout kvalitní službu a přispět tak k lepší
                nabídce služeb ve Vašem regionu. Doufáme, že návštěva našeho
                mycího centra bude pro Vás příjemným zážitkem.
              </p>
              <p className="mt-5 text-justify text-[14px]">
                Přijeďte se k nám podívat. Máme otevřeno 24/7.
              </p>
            </div>
          </div>
        </div>
        <div className="h-70 lg:h-full 2xl:h-120">
          <img
            className="h-full w-full object-cover"
            src="/images/car-about-image-1.jpg"
            alt="image"
          />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default AboutPage;
