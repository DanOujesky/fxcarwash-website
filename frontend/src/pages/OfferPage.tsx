import Footer from "../components/Footer";
import Header from "../components/Header";

const services = [
  {
    title: "Bezkontaktní mytí 24/7",
    text: (
      <>
        Moderní mycí technologie a kvalitní autokosmetika pro důkladné a zároveň
        šetrné mytí Vašeho vozu. K dispozici jsme Vám{" "}
        <strong className="font-bold">24 hodin denně, 7 dní v týdnu</strong>.
      </>
    ),
  },
  {
    title: "6 mycích programů",
    text: "Od čištění disků a aktivní pěny přes hlavní mytí až po voskování a finální oplach. Jednotlivé programy na sebe navazují tak, abyste dosáhli co nejlepšího výsledku.",
  },
  {
    title: "Pohodlné možnosti platby",
    text: (
      <>
        Za mytí můžete pohodlně zaplatit{" "}
        <strong className="font-bold">platební kartou nebo hotově</strong>. Pro
        pravidelné zákazníky nabízíme také předplacené karty.
      </>
    ),
  },
  {
    title: "Předplacené karty",
    text: "Praktické řešení pro pravidelné mytí nebo jako originální dárek. Karty nabízíme v několika hodnotách a můžete je opakovaně využívat při návštěvách našeho mycího centra.",
  },
  {
    title: "Program pro firmy",
    text: (
      <>
        Pro firmy a jejich vozové parky nabízíme{" "}
        <strong className="font-bold">
          mytí na fakturu, individuální karty, možnost nastavení limitů a
          pravidelné reporty čerpání
        </strong>
        .
      </>
    ),
  },
  {
    title: "Péče o interiér",
    text: "Po umytí karoserie můžete využít také naše vybavení pro úklid interiéru vozidla. Vše potřebné tak máte pohodlně na jednom místě.",
  },
  {
    title: "Zákaznické zázemí",
    text: "Myslíme také na Váš komfort. Součástí areálu je venkovní posezení, kde si můžete odpočinout nebo počkat s výhledem přímo na mycí centrum.",
  },
  {
    title: "Čistota a kvalita každý den",
    text: (
      <>
        Pravidelně kontrolujeme kvalitu mycích programů, používanou chemii,
        technologie i čistotu celého areálu. Chceme, abyste při každé návštěvě
        dostali{" "}
        <strong className="font-bold">
          stejně kvalitní výsledek a službu, na kterou se můžete spolehnout
        </strong>
        .
      </>
    ),
  },
];

function OfferPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-5">
        <h2 className="text-white page-title-size mb-7t mx-6 lg:mx-10">
          NABÍDKA
        </h2>
        <p className="mx-6 lg:mx-10 text-[16px] max-w-4xl ">
          Vše pro perfektně čistý vůz na jednom místě
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full py-10 lg:py-20 flex justify-center items-center px-6 sm:px-10 lg:px-30 body-bg-color">
          <div className="flex flex-col gap-6 lg:gap-10 items-center justify-center">
            <h3 className="text-4xl text-center">Naše služby</h3>
            <p className="text-[14px] text-justify hyphens-none">
              V F.X. CarWash Vám chceme nabídnout nejen kvalitní bezkontaktní
              mytí, ale také moderní a příjemné prostředí s vybavením, které Vám
              usnadní kompletní péči o Váš vůz.
            </p>
            <div className="flex flex-col items-center gap-4 lg:gap-6 w-full">
              <div className="h-px w-16 bg-gray-500" />
              <p className="titleText text-[15px] sm:text-[17px] lg:text-xl text-center leading-relaxed">
                F.X. CarWash – více než jen čisté auto.
              </p>
            </div>
          </div>
        </div>
        <div className="h-48 sm:h-70 lg:h-full">
          <img
            className="h-full w-full object-cover"
            src="/images/DJI_0753.JPG"
            alt="image"
          />
        </div>
      </div>
      <div className="w-full header-color px-4 sm:px-10 lg:px-30 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="body-bg-color border-[1px] border-gray-500 p-5 sm:p-6 lg:p-8 flex flex-col gap-3"
            >
              <p className="text-[16px] titleText">{service.title}</p>
              <p className="text-[14px] text-justify hyphens-none">
                {service.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default OfferPage;
