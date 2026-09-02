import Footer from "../components/Footer";
import Header from "../components/Header";

const benefits = [
  {
    title: "Firemní mytí na fakturu",
    text: "veškerá čerpání jednoduše vyúčtujeme jednou souhrnnou fakturou.",
  },
  {
    title: "Pravidelný přehled využití",
    text: "získáte report s informací, která karta byla použita, kdy, a v jaké hodnotě.",
  },
  {
    title: "Individuální limity karet",
    text: "pro jednotlivé karty lze nastavit vlastní limit čerpání podle Vašich potřeb.",
  },
  {
    title: "Karty pro jednotlivá vozidla",
    text: "jednotlivé karty lze evidovat například podle SPZ nebo konkrétního uživatele pro snadnou kontrolu nákladů.",
  },
  {
    title: "Firemní benefit pro zaměstnance",
    text: "předplacené karty můžete využít také jako praktický zaměstnanecký benefit.",
  },
  {
    title: "Dárek pro zákazníky a obchodní partnery",
    text: "předplacená karta F.X. CarWash může být originálním a praktickým firemním dárkem.",
  },
  {
    title: "Karty s vlastním designem",
    text: "zajistíme potisk karet na míru Vaší společnosti, například s logem nebo firemní grafikou.",
  },
];

function PartnersPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-5">
        <h2 className="text-white page-title-size mb-7t mx-6 lg:mx-10">FIRMY</h2>
        <p className="mx-6 lg:mx-10 text-[16px] max-w-4xl ">
          Jednoduché a přehledné řešení mytí Vašich firemních vozidel.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full py-10 lg:py-20 flex justify-center items-center px-6 sm:px-10 lg:px-30 body-bg-color">
          <div className="flex flex-col gap-10 items-center justify-center">
            <h3 className="lg:text-4xl text-3xl text-center">
              Program pro&nbsp;Firmy
            </h3>
            <div>
              <p className="text-[14px] text-justify hyphens-none">
                Firemní program F.X. CarWash Vám umožní pohodlně využívat naše
                mycí centrum bez nutnosti hotovostních plateb a zároveň mít
                náklady na mytí vozidel plně pod kontrolou.
              </p>
              <div className="mt-6">
                <p className="text-[16px] mb-2 titleText">Hlavní výhody:</p>
                <ul className="list-disc pl-5 sm:pl-10">
                  {benefits.map((benefit) => (
                    <li
                      key={benefit.title}
                      className="text-[14px] mb-2 text-justify hyphens-none"
                    >
                      <strong className="font-bold">{benefit.title}</strong> –{" "}
                      {benefit.text}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[14px] text-justify hyphens-none mt-5">
                Ať provozujete několik služebních vozidel nebo větší firemní
                flotilu, rádi pro Vás připravíme řešení odpovídající Vašim
                potřebám.
              </p>
              <p className="text-[14px] text-justify hyphens-none mt-5 font-bold">
                Pro individuální nabídku a nastavení firemního programu nás
                neváhejte kontaktovat.
              </p>
            </div>
          </div>
        </div>
        <div className="h-48 sm:h-70 lg:h-full">
          <img
            className="h-full w-full object-cover"
            src="/images/partners-image.jpg"
            alt="image"
          />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default PartnersPage;
