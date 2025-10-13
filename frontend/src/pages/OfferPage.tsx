import Footer from "../components/Footer";
import Header from "../components/Header";

function OfferPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-5">
        <h2 className="text-white page-title-size mb-7t mx-10">NABÍDKA</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full py-20 flex justify-center items-center px-10 lg:px-30 body-bg-color">
          <div className="flex flex-col gap-10 items-center justify-center">
            <h3 className="text-4xl">Naše služby</h3>
            <div>
              <div></div>
              <div className="mt-2">
                <p className="text-[16px]">Co nabízíme</p>
                <ul className="list-disc pl-10">
                  <li className="text-[14px]">3 samoobslužné mycí boxy</li>
                  <li className="text-[14px]">2 výkonné vysavače</li>
                  <li className="text-[14px]">Nonstop provoz</li>
                </ul>
              </div>
              <div className="mt-2">
                <p className="text-[16px]">Mycí programy</p>
                <ul className="list-disc pl-10">
                  <li className="text-[14px]">Hlavní mytí</li>
                  <li className="text-[14px]">Oplach</li>
                  <li className="text-[14px]">Vosk</li>
                  <li className="text-[14px]">Lesk</li>
                  <li className="text-[14px]">Aktivní pěna</li>
                  <li className="text-[14px]">Předmytí</li>
                  <li className="text-[14px]">Měkký kartáč</li>
                  <li className="text-[14px]">Hmyz</li>
                </ul>
              </div>
              <div className="mt-2">
                <p className="text-[16px]">Proč právě k nám</p>
                <ul className="list-disc pl-10">
                  <li className="text-[14px]">
                    <strong>Bezkontaktní mytí:</strong> Minimalizuje riziko
                    poškrábání laku a je šetrné k povrchu vozidla.
                  </li>
                  <li className="text-[14px]">
                    <strong>Programová flexibilita:</strong> Možnost výběru a
                    kombinace různých mycích programů podle stupně znečištění
                    vozu.
                  </li>
                  <li className="text-[14px]">
                    <strong>Rychlost a úspora času:</strong> Efektivní proces
                    mytí s použitím kvalitní chemie, který šetří čas ve srovnání
                    s tradičními mycími linkami.
                  </li>
                  <li className="text-[14px]">
                    <strong>Finanční úspora:</strong> Možnost umýt auto za nižší
                    náklady.
                  </li>
                  <li className="text-[14px]">
                    <strong>Moderní platební možnosti:</strong> Platební nebo
                    předplacené karty pro pohodlné platby.
                  </li>
                  <li className="text-[14px]">
                    <strong>Hotovostní platby:</strong> Mycí centrum je vybaveno
                    měničkou.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="h-70 lg:h-full">
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

export default OfferPage;
