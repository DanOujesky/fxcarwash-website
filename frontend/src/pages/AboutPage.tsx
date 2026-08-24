import Footer from "../components/Footer";
import Header from "../components/Header";

function AboutPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-5">
        <h2 className="text-white page-title-size mb-7t mx-6 lg:mx-10">
          MODERNÍ MYCÍ CENTRUM
        </h2>
        <p className="mx-6 lg:mx-10 text-[16px] max-w-4xl ">
          F.X. CarWash vznikl s jednoduchou myšlenkou – vybudovat moderní
          bezkontaktní mycí centrum, kam se zákazníci budou rádi vracet.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full py-10  lg:py-20 flex justify-center items-center px-6 sm:px-10 lg:px-30 body-bg-color">
          <div className="flex flex-col gap-10 items-center justify-center">
            <h3 className="text-4xl">O nás</h3>
            <div>
              <p className="text-[14px] text-justify hyphens-auto">
                Společnost{" "}
                <strong className="font-bold">F.X. CarWash s.r.o.</strong> byla
                založena v roce 2025, samotná cesta k prvnímu mycímu centru ale
                začala už v roce 2023. Od začátku jsme měli jasnou představu:
                nabídnout zákazníkům vysokou kvalitu mytí, moderní technologie,
                příjemné prostředí, a především spolehlivou službu, dostupnou
                kdykoli.
              </p>
              <p className="text-[14px] mt-5 text-justify hyphens-auto">
                Velkou pozornost jsme proto věnovali výběru technologického
                partnera. Hledali jsme společnost, která nám pomůže vybudovat
                nejen moderní mycí centrum, ale zároveň dokáže zajistit
                prvotřídní technologickou podporu a servis během jeho
                každodenního provozu.
              </p>
              <p className="text-[14px] mt-5 text-justify hyphens-auto">
                Po dlouhém výběru jsme navázali spolupráci se společností{" "}
                <strong className="font-bold">My Wash Technology s.r.o.</strong>
                , která má s realizací bezkontaktních mycích center dlouholeté
                zkušenosti. Použité technologie a kvalitní komponenty zajišťují
                vysokou účinnost jednotlivých mycích programů s důrazem na
                šetrnost k&nbsp;vozidlu, ekologický provoz, úsporu vody a
                maximální komfort zákazníků. To vše doplňuje moderní a nadčasový
                design celého mycího centra.
              </p>
              <p className="text-[14px] mt-5 text-justify hyphens-auto">
                Naše{" "}
                <strong className="font-bold">
                  první F.X. CarWash jsme otevřeli v Horní Bříze nedaleko Plzně
                </strong>
                . Od zahájení provozu se neustále věnujeme ladění jednotlivých
                mycích programů, kvality používané chemie i celkového zázemí
                tak, abychom zákazníkům nabídli co nejlepší výsledek při každé
                návštěvě.
              </p>
              <p className="text-[14px] mt-5 text-justify hyphens-auto">
                Naším cílem ale není zůstat pouze u jednoho mycího centra.{" "}
                <strong className="font-bold">
                  F.X. CarWash chceme postupně rozvíjet i v dalších lokalitách a
                  budovat značku, která bude synonymem pro kvalitní bezkontaktní
                  mytí, moderní prostředí a spolehlivý zákaznický servis.
                </strong>
              </p>
            </div>
          </div>
        </div>
        <div className="h-48 sm:h-70 lg:h-full">
          <img
            className="h-full w-full object-cover"
            src="/images/1000025959.jpg"
            alt="image"
          />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default AboutPage;
