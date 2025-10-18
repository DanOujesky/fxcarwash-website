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
        <div className="h-full py-10 lg:py-20 flex justify-center items-center px-10 lg:px-30 body-bg-color">
          <div className="flex flex-col gap-6 lg:gap-10 items-center justify-center">
            <h3 className="text-4xl">Naše služby</h3>
            <div>
              <div></div>
              <div className="mt-2">
                <p className="text-[19px] mb-2">Co nabízíme</p>
                <ul className="list-disc pl-10">
                  <li className="text-[14px]">3 SAMOOBSLUŽNÉ MYCÍ BOXY</li>
                  <li className="text-[14px]">2 VÝKONNÉ VYSAVAČE</li>
                  <li className="text-[14px]">NONSTOP PROVOZ</li>
                </ul>
              </div>
              <div className="mt-6">
                <p className="text-[19px] mb-2">Proč právě k nám</p>
                <ul className="list-disc pl-10">
                  <li className="text-[14px] mb-2 lg:mb-0">
                    <strong>BEZKONTAKTNÍ MYTÍ:</strong> Minimalizuje riziko
                    poškrábání laku a je šetrné k&nbsp;povrchu vozidla.
                  </li>
                  <li className="text-[14px] mb-2 lg:mb-0">
                    <strong>PROGRAMOVÁ FLEXIBILITA:</strong> Kombinace různých
                    mycích programů podle stupně znečištění vozu.
                  </li>
                  <li className="text-[14px] mb-2 lg:mb-0">
                    <strong>RYCHLOST A ÚSPORA ČASU:</strong> Efektivní proces
                    mytí, který šetří čas ve srovnání s&nbsp;tradičními mycími
                    linkami.
                  </li>
                  <li className="text-[14px] mb-2 lg:mb-0">
                    <strong>FINANČNÍ ÚSPORA ČASU:</strong> Možnost umýt auto za
                    nižší náklady.
                  </li>
                  <li className="text-[14px] mb-2 lg:mb-0">
                    <strong>MODERNÍ PLATEBNÍ MOŽNOSTI:</strong> Platební nebo
                    předplacené karty pro pohodlné platby.
                  </li>
                  <li className="text-[14px]">
                    <strong>HOTOVOSTNÍ PLATBY:</strong> Mycí centrum
                    je&nbsp;vybaveno měničkou peněz.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="h-70 lg:h-135">
          <img
            className="h-full w-full object-cover"
            src="/images/image-offer-page-2.jpeg"
            alt="image"
          />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default OfferPage;
