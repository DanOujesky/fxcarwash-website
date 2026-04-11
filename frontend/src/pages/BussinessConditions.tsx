import Footer from "../components/Footer";
import Header from "../components/Header";

function BussinessConditions() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />

      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-5">
        <h2 className="text-white page-title-size mx-10">
          VŠEOBECNÉ OBCHODNÍ PODMÍNKY
        </h2>

        <p className="mx-10 text-ml">
          Tyto obchodní podmínky upravují práva a povinnosti mezi společností
          F.X. CarWash s.r.o. a zákazníky využívajícími služby mycího centra a
          zákaznické karty.
        </p>
      </div>

      <div className="body-bg-color py-16 px-10 lg:px-40 flex flex-col gap-14">
        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">I. Vymezení základních pojmů</h3>

          <p className="text-[14px] text-justify">
            VOP se rozumí tyto všeobecné obchodní podmínky. Provozovatelem je
            společnost F.X. CarWash s.r.o., se sídlem Žižkova 1125, 252 62
            Horoměřice, IČO: 235 79 102, zapsaná v obchodním rejstříku vedeném u
            Městského soudu v Praze.
          </p>

          <p className="text-[14px] text-justify">
            Zákazníkem se rozumí fyzická nebo právnická osoba, která využívá
            služby mycího centra nebo zákaznické karty. Mycí centrum je
            samoobslužné zařízení určené k mytí motorových vozidel zákazníky.
          </p>

          <p className="text-[14px] text-justify">
            Službou se rozumí zejména samoobslužné mytí vozidel, využití
            technologických zařízení mycího centra a dalších doplňkových služeb.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">II. Úvodní ustanovení</h3>

          <p className="text-[14px] text-justify">
            Tyto obchodní podmínky upravují práva a povinnosti mezi
            Provozovatelem a Zákazníkem při využívání služeb mycího centra a při
            používání zákaznických karet prostřednictvím e-shopu Provozovatele.
          </p>

          <p className="text-[14px] text-justify">
            Ustanovení těchto podmínek se použijí na všechny smluvní vztahy
            vznikající mezi Provozovatelem a Zákazníkem, pokud právní předpisy
            nestanoví jinak.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">III. Uživatelský účet</h3>

          <p className="text-[14px] text-justify">
            Zákazník si může vytvořit uživatelský účet v e-shopu provozovatele,
            který slouží k objednávání zákaznických karet, dobíjení kreditu a
            správě objednávek.
          </p>

          <p className="text-[14px] text-justify">
            Zákazník je povinen uvádět pravdivé a aktuální údaje. Přístup k účtu
            je chráněn přihlašovacími údaji, které je zákazník povinen chránit
            před zneužitím.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">IV. Zákaznické karty</h3>

          <p className="text-[14px] text-justify">
            Zákaznické karty slouží k úhradě služeb poskytovaných v mycím
            centru. Karta je anonymní a není vázána na konkrétní osobu.
          </p>

          <p className="text-[14px] text-justify">
            Každá karta je vydávána za jednorázový poplatek 100 Kč a může být
            používána jakýmkoliv držitelem karty.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">V. Platební podmínky</h3>

          <p className="text-[14px] text-justify">
            Zákaznické karty lze objednat prostřednictvím e-shopu Provozovatele.
            Platby jsou prováděny výhradně bezhotovostně pomocí platební brány.
          </p>

          <p className="text-[14px] text-justify">
            Daňový doklad je zákazníkovi automaticky zasílán na jeho e-mailovou
            adresu uvedenou při registraci.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">VI. Kredit na kartě</h3>

          <p className="text-[14px] text-justify">
            Kredit je evidován elektronicky v systému Provozovatele a je vázán
            na konkrétní kartu. Kredit je časově neomezený a lze jej dobíjet
            prostřednictvím e-shopu.
          </p>

          <p className="text-[14px] text-justify">
            Kredit není možné převádět na jinou kartu ani jej směnit za finanční
            prostředky.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">VII. Provoz mycího centra</h3>

          <p className="text-[14px] text-justify">
            Mycí centrum je provozováno nepřetržitě 24 hodin denně, 7 dní v
            týdnu, pokud nedojde k omezení provozu z technických nebo
            bezpečnostních důvodů.
          </p>

          <p className="text-[14px] text-justify">
            Provozovatel nenese odpovědnost za škody vzniklé nesprávným použitím
            zařízení nebo nedodržením pokynů.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">VIII. Reklamace</h3>

          <p className="text-[14px] text-justify">
            Reklamace je možné uplatnit elektronicky prostřednictvím e-mailu
            Provozovatele. Zákazník musí uvést popis vady, datum a čas čerpání
            služby a identifikaci karty nebo transakce.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">IX. Ochrana osobních údajů</h3>

          <p className="text-[14px] text-justify">
            Provozovatel zpracovává osobní údaje zákazníků v souladu s GDPR
            zejména za účelem plnění smlouvy, vedení uživatelského účtu a plnění
            zákonných povinností.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl sm:text-3xl">X. Závěrečná ustanovení</h3>

          <p className="text-[14px] text-justify">
            Tyto obchodní podmínky se řídí právním řádem České republiky.
            Provozovatel si vyhrazuje právo tyto podmínky kdykoli změnit.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BussinessConditions;
