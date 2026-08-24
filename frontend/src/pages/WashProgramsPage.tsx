import Footer from "../components/Footer";
import Header from "../components/Header";

const YELLOW = "#FACC15";
const RED = "#E11D2E";
const BLUE = "#2E7BEF";

const steps = [
  {
    number: "1",
    title: "MYTÍ DISKŮ",
    program: "ŽLUTÝ PROGRAM",
    color: YELLOW,
    text: "Začněte důkladným očištěním kol. Speciální přípravek pomáhá odstranit brzdový prach a další odolné nečistoty z disků.",
    tool: "Použijte pistoli na disky – žlutá hadice.",
  },
  {
    number: "2",
    title: "AKTIVNÍ PĚNA",
    program: "ČERVENÝ PROGRAM",
    color: RED,
    text: (
      <>
        Naneste aktivní pěnu rovnoměrně na celé vozidlo{" "}
        <strong className="font-bold">zdola nahoru</strong> a nechte ji
        přibližně 30 sekund působit. Aktivní pěna změkčí a uvolní nečistoty před
        hlavním mytím.
      </>
    ),
    tool: "Použijte pistoli na pěnu – červená hadice.",
  },
  {
    number: "3",
    title: "HLAVNÍ MYTÍ",
    program: "MODRÝ PROGRAM",
    color: BLUE,
    text: "Pomocí vysokého tlaku a horké vody s čisticím prostředkem důkladně umyjte celé vozidlo a odstraňte nečistoty uvolněné aktivní pěnou.",
    tool: "Použijte hlavní mycí pistoli – modrá hadice.",
  },
  {
    number: "4",
    title: "OPLACH VODOU",
    program: "MODRÝ PROGRAM",
    color: BLUE,
    text: "Čistou vodou důkladně opláchněte z vozidla zbytky čisticích prostředků a nečistot.",
    tool: "Použijte hlavní mycí pistoli – modrá hadice.",
  },
  {
    number: "5",
    title: "VOSKOVÁNÍ",
    program: "MODRÝ PROGRAM",
    color: BLUE,
    text: "Nanesením horkého vosku vytvoříte na povrchu ochrannou vrstvu, která pomáhá chránit lak před vnějšími vlivy a zároveň podporuje jeho lesk.",
    tool: "Použijte hlavní mycí pistoli – modrá hadice.",
  },
  {
    number: "6",
    title: "ZÁVĚREČNÝ OPLACH / LEŠTĚNÍ",
    program: "MODRÝ PROGRAM",
    color: BLUE,
    text: "Posledním krokem je oplach demineralizovanou vodou s přísadou pro lepší výsledek sušení. Díky tomu může vůz přirozeně uschnout bez nežádoucích skvrn a map po kapkách vody.",
    tool: "Použijte hlavní mycí pistoli – modrá hadice.",
  },
];

const legend = [
  { color: YELLOW, label: "DISKY" },
  { color: RED, label: "PĚNA" },
  { color: BLUE, label: "HLAVNÍ MYTÍ" },
];

function WashProgramsPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-4 lg:gap-5">
        <h2 className="text-white page-title-size mb-7t mx-6 lg:mx-10">
          PROGRAMY NA MYTÍ
        </h2>
        <p className="mx-6 lg:mx-10 text-ml max-w-4xl ">
          Jak správně umýt Vaše vozidlo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full py-10 lg:py-20 flex justify-center items-center px-6 sm:px-10 lg:px-30 body-bg-color">
          <div className="flex flex-col gap-6 lg:gap-10 items-center justify-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl text-center">
              Postupujte&nbsp;krok za&nbsp;krokem
            </h3>
            <p className="text-[14px] text-left sm:text-justify">
              Pro dosažení nejlepšího výsledku doporučujeme postupovat podle
              jednotlivých mycích programů v uvedeném pořadí. Pro snadnou
              orientaci jsou programy na ovládacím panelu{" "}
              <strong className="font-bold">barevně rozlišeny</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3">
              {legend.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="block w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-[11px] sm:text-[12px] titleText">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-48 sm:h-70 lg:h-120 2xl:h-140">
          <img
            className="h-full w-full object-cover"
            src="/images/IMG_6395 U benzinky MOL.jpg"
            alt="image"
          />
        </div>
      </div>

      <div className="w-full header-color px-4 sm:px-10 lg:px-30 py-12 lg:py-20">
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="body-bg-color border-[1px] border-gray-500 border-l-[6px] p-5 sm:p-6 lg:p-8 flex gap-4 sm:gap-5 lg:gap-8"
              style={{ borderLeftColor: step.color }}
            >
              <div
                className="titleText text-3xl sm:text-5xl lg:text-6xl leading-none shrink-0 w-8 sm:w-14 lg:w-16"
                style={{ color: step.color }}
              >
                {step.number}
              </div>
              <div className="flex flex-col gap-2 lg:gap-3 min-w-0">
                <p className="text-[15px] sm:text-[16px] lg:text-[19px] titleText leading-snug">
                  {step.title}
                </p>
                <span
                  className="text-[10px] sm:text-[11px] titleText px-3 py-1 rounded-full text-black self-start"
                  style={{ backgroundColor: step.color }}
                >
                  {step.program}
                </span>
                <p className="text-[14px] text-left sm:text-justify mt-1">
                  {step.text}
                </p>
                <p className="text-[14px] font-bold flex items-start gap-2">
                  <span
                    className="block w-3 h-3 rounded-full mt-[5px] shrink-0"
                    style={{ backgroundColor: step.color }}
                  ></span>
                  <span>{step.tool}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-10 lg:mt-14 border-[1px] border-white p-6 sm:p-8 lg:p-10 text-center flex flex-col gap-4">
          <p className="titleText text-[16px] sm:text-[18px] lg:text-2xl">
            TIP F.X. CARWASH
          </p>
          <p className="text-[14px] lg:text-[16px]">
            Pro dosažení nejlepšího výsledku doporučujeme absolvovat{" "}
            <strong className="font-bold">
              všech 6 kroků v uvedeném pořadí
            </strong>{" "}
            a nevynechávat závěrečný oplach. Správná kombinace jednotlivých
            programů zajistí důkladné umytí, ochranu a výsledný lesk Vašeho
            vozu.
          </p>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default WashProgramsPage;
