import { useNavigate } from "react-router-dom";

function BussinessConditions() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pt-[121px] bg-[#252525] text-gray-200 font-sans">
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-wider">
            Obchodní podmínky
          </h1>
          <p className="text-gray-400 text-lg">
            pro zákaznické účty, RFID karty a online dobíjení kreditu na
            automyčku
          </p>
        </div>

        <div className="space-y-10 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              1. Úvodní ustanovení
            </h2>
            <p className="mb-3">
              1.1 Tyto obchodní podmínky (dále jen „Podmínky") upravují práva a
              povinnosti mezi provozovatelem automyčky:
            </p>
            <div className="bg-[#333] p-4 rounded-md mb-4 border-l-4 border-green-500">
              <p>
                <strong>Název firmy:</strong> [DOPLNIT NÁZEV FIRMY]
              </p>
              <p>
                <strong>IČO:</strong> [DOPLNIT IČO]
              </p>
              <p>
                <strong>Sídlo:</strong> [DOPLNIT SÍDLO]
              </p>
              <p>
                <strong>Zapsán v:</strong> [DOPLNIT OR/ŽR]
              </p>
              <p>
                <strong>E-mail:</strong> [DOPLNIT EMAIL]
              </p>
              <p>
                <strong>Telefon:</strong> [DOPLNIT TELEFON]
              </p>
              <p className="mt-2 text-gray-400">(dále jen „Provozovatel“)</p>
            </div>
            <p className="mb-2">
              a fyzickými nebo právnickými osobami (dále jen „Zákazník“), které:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-300">
              <li>si zřídí zákaznický účet,</li>
              <li>používají RFID kartu,</li>
              <li>dobíjejí kredit a čerpají služby automyčky.</li>
            </ul>
            <p>
              1.2 Tyto Podmínky jsou nedílnou součástí každé smlouvy uzavřené
              mezi Provozovatelem a Zákazníkem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              2. Vymezení pojmů
            </h2>
            <ul className="space-y-3">
              <li>
                <strong>2.1 Zákaznický účet</strong> – neveřejná část webu
                přístupná po přihlášení, sloužící výhradně k přehledu RFID
                karet, kreditu a historie čerpání služeb.
              </li>
              <li>
                <strong>2.2 RFID karta</strong> – fyzická karta s unikátním
                identifikátorem vydaná Provozovatelem, sloužící výhradně k
                úhradě služeb automyčky.
              </li>
              <li>
                <strong>2.3 Automyčka</strong> – samoobslužná automyčka
                provozovaná Provozovatelem na adrese [DOPLNIT PŘESNOU ADRESU].
              </li>
              <li>
                <strong>2.4 Kredit</strong> – předplacená hodnota představující
                právo čerpat služby automyčky v odpovídajícím rozsahu.
              </li>
              <li>
                <strong>2.5 Služba</strong> – mytí vozidel poskytované
                Provozovatelem prostřednictvím automyčky.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              3. Povaha zákaznického účtu, RFID karty a kreditu
            </h2>
            <p className="mb-3">
              3.1 Zákaznický účet slouží výhradně jako uživatelské rozhraní pro
              správu RFID karet a přehled kreditu.
            </p>
            <p className="mb-2">3.2 Kredit:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-300">
              <li>nepředstavuje peněžní prostředky,</li>
              <li>není elektronickými penězi,</li>
              <li>není platebním ani depozitním prostředkem.</li>
            </ul>
            <p className="mb-3">
              3.3 Kredit je vždy vázán ke konkrétní RFID kartě a slouží výhradně
              k úhradě služeb automyčky Provozovatele.
            </p>
            <p className="mb-2">3.4 Kredit:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-300">
              <li>nelze vybrat v hotovosti ani bezhotovostně,</li>
              <li>nelze převádět mezi kartami nebo zákaznickými účty,</li>
              <li>nelze použít mimo automyčku Provozovatele.</li>
            </ul>
            <p>
              3.5 RFID karta i kredit jsou použitelné výhradně v omezené síti na
              jediné automyčce Provozovatele.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              4. Zákaznický účet
            </h2>
            <p className="mb-2">
              4.1 Zákazník si může zřídit zákaznický účet prostřednictvím
              webového rozhraní Provozovatele.
            </p>
            <p className="mb-2">
              4.2 Při registraci je Zákazník povinen uvést pravdivé a aktuální
              údaje.
            </p>
            <p className="mb-2">
              4.3 Zákazník je povinen chránit své přihlašovací údaje a odpovídá
              za veškeré jednání provedené prostřednictvím svého účtu.
            </p>
            <p>
              4.4 Provozovatel je oprávněn zákaznický účet zrušit nebo omezit,
              pokud Zákazník poruší tyto Podmínky.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              5. Vznik smluvního vztahu
            </h2>
            <p className="mb-2">
              5.1 Smluvní vztah mezi Provozovatelem a Zákazníkem vzniká:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-300">
              <li>
                registrací zákaznického účtu a souhlasem s těmito Podmínkami,
                nebo
              </li>
              <li>prvním dobitím kreditu, nebo</li>
              <li>
                převzetím RFID karty, pokud Zákazník s Podmínkami souhlasil.
              </li>
            </ul>
            <p>
              5.2 Souhlas s Podmínkami je vyžadován elektronicky (checkbox).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              6. RFID karta
            </h2>
            <p className="mb-2">6.1 RFID karta může být Zákazníkovi:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-300">
              <li>poskytnuta zdarma,</li>
              <li>nebo prodána za cenu uvedenou na webu.</li>
            </ul>
            <p className="mb-2">
              6.2 RFID karta je majetkem Provozovatele; Zákazník je oprávněn ji
              používat v souladu s těmito Podmínkami.
            </p>
            <p className="mb-2">6.3 RFID karta může být doručena:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>poštou nebo přepravcem,</li>
              <li>osobně předána na provozovně.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              7. Dobíjení kreditu
            </h2>
            <p className="mb-2">
              7.1 Dobíjení kreditu probíhá výhradně online prostřednictvím
              zákaznického účtu.
            </p>
            <p className="mb-2">
              7.2 Zákazník je povinen vybrat RFID kartu, ke které má být kredit
              připsán.
            </p>
            <p className="mb-2">
              7.3 Kredit je připsán automaticky po úhradě ceny.
            </p>
            <p className="mb-2">7.4 Provozovatel je oprávněn stanovit:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>minimální a maximální výši jednoho dobití,</li>
              <li>maximální výši kreditu na jedné RFID kartě.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              8. Používání RFID karty a čerpání služeb
            </h2>
            <p className="mb-2">
              8.1 RFID karta se používá přiložením ke čtečce na automyčce.
            </p>
            <p className="mb-2">
              8.2 Kredit je odečítán podle zvoleného mycího programu.
            </p>
            <p className="mb-2">
              8.3 Při nedostatečném kreditu nelze službu čerpat.
            </p>
            <p>
              8.4 Zákazník odpovídá za veškeré použití RFID karty, včetně
              použití třetími osobami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              9. Platnost RFID karty a kreditu
            </h2>
            <p className="mb-2">
              9.1 Platnost RFID karty činí [DOPLNIT ROKY, např. 36 měsíců] od
              data vydání.
            </p>
            <p className="mb-2">
              9.2 Platnost kreditu činí [DOPLNIT MĚSÍCE, např. 24 měsíců] od
              data posledního dobití.
            </p>
            <p>
              9.3 Nevyužitý kredit po uplynutí doby platnosti zaniká bez
              náhrady.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              10. Ztráta, odcizení nebo poškození RFID karty
            </h2>
            <p className="mb-2">
              10.1 Zákazník je povinen neprodleně oznámit ztrátu nebo odcizení
              RFID karty.
            </p>
            <p className="mb-2">
              10.2 Provozovatel může RFID kartu zablokovat.
            </p>
            <p className="mb-2">
              10.3 Vydání náhradní RFID karty může být zpoplatněno.
            </p>
            <p>
              10.4 Zůstatek kreditu může být převeden na náhradní kartu pouze v
              případě včasného nahlášení.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              11. Odstoupení od smlouvy
            </h2>
            <div className="mb-4">
              <h3 className="font-bold text-white mb-2">11.1 RFID karta</h3>
              <p className="mb-2">
                Zákazník má právo odstoupit od smlouvy do 14 dnů od převzetí
                RFID karty, pokud:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                <li>karta nebyla použita,</li>
                <li>karta není poškozena.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">11.2 Dobití kreditu</h3>
              <p className="mb-2">
                11.2.1 Dobití kreditu představuje okamžité poskytnutí služby.
              </p>
              <p className="mb-2">
                11.2.2 Zákazník bere na vědomí, že okamžikem připsání kreditu
                zaniká právo na odstoupení od smlouvy.
              </p>
              <p>
                11.2.3 Souhlas s okamžitým poskytnutím služby je vyžadován před
                dokončením objednávky.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              12. Reklamace
            </h2>
            <p className="mb-2">12.1 Zákazník je oprávněn reklamovat:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-300">
              <li>nefunkční RFID kartu,</li>
              <li>chybně připsaný kredit.</li>
            </ul>
            <p className="mb-2">
              12.2 Reklamace se uplatňuje elektronicky nebo písemně.
            </p>
            <p>12.3 Reklamace bude vyřízena nejpozději do 30 dnů.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              13. Odpovědnost Provozovatele
            </h2>
            <p className="mb-2">13.1 Provozovatel neodpovídá za:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-300">
              <li>dočasnou nedostupnost automyčky,</li>
              <li>technické výpadky systému,</li>
              <li>škody způsobené nesprávným použitím RFID karty.</li>
            </ul>
            <p>
              13.2 Provozovatel neodpovídá za škody vzniklé v důsledku vyšší
              moci.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              14. Ochrana osobních údajů
            </h2>
            <p className="mb-2">
              14.1 Provozovatel zpracovává osobní údaje v souladu s platnými
              právními předpisy.
            </p>
            <p className="mb-2">
              14.2 Identifikátor RFID karty není sám o sobě osobním údajem.
            </p>
            <p>
              14.3 Podrobnosti o zpracování osobních údajů jsou uvedeny v
              samostatném dokumentu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-green-500 mb-4">
              15. Závěrečná ustanovení
            </h2>
            <p className="mb-2">
              15.1 Tyto Podmínky se řídí právním řádem České republiky.
            </p>
            <p className="mb-2">
              15.2 Mimosoudní řešení spotřebitelských sporů zajišťuje Česká
              obchodní inspekce.
            </p>
            <p className="mb-2">
              15.3 Provozovatel si vyhrazuje právo tyto Podmínky jednostranně
              změnit.
            </p>
            <p className="mt-4 font-semibold text-white">
              15.4 Tyto Podmínky nabývají účinnosti dne [DOPLNIT DATUM].
            </p>
          </section>

          <div className="pt-10 flex justify-center">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="border border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-sm transition-colors uppercase tracking-widest font-bold"
            >
              Zpět
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BussinessConditions;
