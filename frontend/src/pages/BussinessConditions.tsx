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
          společnosti F.X. CarWash s.r.o.
        </p>
      </div>

      <div className="body-bg-color py-16 px-10 lg:px-40 flex flex-col gap-14">

        {/* I. Vymezení základních pojmů */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">I. Vymezení základních pojmů</h3>

          <p className="text-[14px] text-justify">
            <strong>1.1</strong>&nbsp; <strong>VOP</strong> se rozumí tyto všeobecné obchodní podmínky.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.2</strong>&nbsp; <strong>Provozovatelem</strong> se rozumí společnost: F.X. CarWash s.r.o., se sídlem Žižkova 1125,
            252 62 Horoměřice, IČO: 235 79 102, zapsaná v obchodním rejstříku vedeném u Městského soudu
            v Praze, oddíl C, vložka 429539, jako provozovatel mycího centra a poskytovatel Služeb.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.3</strong>&nbsp; <strong>Zákazníkem</strong> se rozumí fyzická nebo právnická osoba, která uzavírá s Provozovatelem
            smluvní vztah v souvislosti s poskytnutím Služby či v souvislosti se Zákaznickou kartou, a to
            buď jako spotřebitel, nebo jako podnikatel.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.4</strong>&nbsp; <strong>Mycím centrem</strong> se rozumí samoobslužné zařízení provozované Provozovatelem na adrese
            K Černému mostu, 330 12 Horní Bříza, určené k mytí motorových vozidel Zákazníky, včetně
            veškerého technologického, technického a provozního vybavení umístěného v jeho areálu.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.5</strong>&nbsp; <strong>Službou</strong> se rozumí zejména samoobslužné mytí a čištění motorových vozidel
            poskytované v Mycím centru prostřednictvím jeho technických zařízení, včetně vysavačů, a to
            v rozsahu a režimu zvoleném Zákazníkem.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.6</strong>&nbsp; <strong>Zákaznickou kartou</strong> se rozumí karta vydaná Provozovatelem, umožňující úhradu
            Služeb prostřednictvím předplaceného kreditu.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.7</strong>&nbsp; <strong>Kreditem</strong> se rozumí peněžní hodnota evidovaná v elektronickém systému
            Provozovatele k příslušné Zákaznické kartě, určená výhradně k úhradě Služeb.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.8</strong>&nbsp; <strong>E-shopem</strong> se rozumí webové rozhraní Provozovatele, jehož prostřednictvím je mimo
            jiné možné uzavírat smlouvy mezi Provozovatelem a Zákazníky, objednávat Zákaznické karty,
            dobíjet Kredit a spravovat Uživatelský účet Zákazníků.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.9</strong>&nbsp; <strong>Uživatelským účtem</strong> se rozumí neveřejná část E-shopu Provozovatele, zřízená na
            základě registrace Zákazníka, která slouží zejména k identifikaci Zákazníka, ke správě jeho
            objednávek, k nákupu a dobíjení Zákaznických karet, ke sledování aktuálních zůstatků Kreditu
            na jednotlivých Zákaznických kartách a k využívání dalších funkcí zpřístupněných Provozovatelem.
          </p>
          <p className="text-[14px] text-justify">
            <strong>1.10</strong>&nbsp; <strong>Občanským zákoníkem</strong> se rozumí zákon č. 89/2012 Sb., občanský zákoník, ve
            znění pozdějších předpisů.
          </p>
        </div>

        {/* II. Úvodní ustanovení */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">II. Úvodní ustanovení</h3>

          <p className="text-[14px] text-justify">
            <strong>2.1</strong>&nbsp; Tyto VOP upravují ve smyslu § 1751 Občanského zákoníku vzájemná práva a povinnosti
            smluvních stran vznikající v souvislosti s poskytováním Služeb Mycího centra, jakož i
            v souvislosti s vydáváním, prodejem a dobíjením Zákaznických karet prostřednictvím webového
            rozhraní E-shopu Provozovatele.
          </p>
          <p className="text-[14px] text-justify">
            <strong>2.2</strong>&nbsp; Ustanovení těchto VOP se použijí na veškeré smluvní vztahy vznikající mezi
            Provozovatelem a Zákazníky, nestanoví-li obecně závazné právní předpisy výslovně jinak.
            Ustanovení, která se svou povahou vztahují výlučně na spotřebitele, se pro účely smluvních
            vztahů vznikajících mezi Provozovatelem a Zákazníky, kteří jsou podnikateli, nepoužijí.
          </p>
        </div>

        {/* III. Uživatelský účet */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">III. Uživatelský účet</h3>

          <p className="text-[14px] text-justify">
            <strong>3.1</strong>&nbsp; Za účelem využívání vybraných funkcí E-shopu, zejména objednávání Zákaznických karet,
            dobíjení Kreditu a sledování aktuálních zůstatků, je Zákazník oprávněn zřídit si Uživatelský
            účet.
          </p>
          <p className="text-[14px] text-justify">
            <strong>3.2</strong>&nbsp; Uživatelský účet vzniká na základě registrace provedené Zákazníkem prostřednictvím
            E-shopu. Při registraci je Zákazník povinen uvést pravdivé, úplné a aktuální údaje, zejména
            své identifikační a kontaktní údaje.
          </p>
          <p className="text-[14px] text-justify">
            <strong>3.3</strong>&nbsp; Zákazník bere na vědomí, že údaje uvedené v Uživatelském účtu mohou být Provozovatelem
            považovány za správné a úplné, a že Provozovatel není povinen jejich pravdivost ověřovat.
          </p>
          <p className="text-[14px] text-justify">
            <strong>3.4</strong>&nbsp; Přístup k Uživatelskému účtu je zabezpečen přihlašovacími údaji, které je Zákazník
            povinen uchovávat v tajnosti a chránit před zneužitím. Zákazník odpovídá za veškeré jednání
            uskutečněné prostřednictvím jeho Uživatelského účtu, a to i v případě, že k tomuto jednání
            došlo bez jeho vědomí, pokud k němu došlo v důsledku porušení povinností Zákazníka.
          </p>
          <p className="text-[14px] text-justify">
            <strong>3.5</strong>&nbsp; Provozovatel nenese odpovědnost za zneužití Uživatelského účtu třetí osobou, ledaže
            by ke zneužití došlo výlučně v důsledku porušení povinností Provozovatele.
          </p>
          <p className="text-[14px] text-justify">
            <strong>3.6</strong>&nbsp; Provozovatel je oprávněn Uživatelský účet dočasně omezit, pozastavit nebo zrušit,
            a to zejména v případě, že:
          </p>
          <ul className="text-[14px] flex flex-col gap-2 pl-8">
            <li><strong>a.</strong>&nbsp; Zákazník poruší své povinnosti vyplývající z těchto VOP nebo z právních předpisů,</li>
            <li><strong>b.</strong>&nbsp; Zákazník uvede nepravdivé nebo neúplné údaje,</li>
            <li><strong>c.</strong>&nbsp; existuje důvodné podezření na zneužití Uživatelského účtu,</li>
            <li><strong>d.</strong>&nbsp; dojde k ukončení smluvního vztahu mezi Zákazníkem a Provozovatelem.</li>
          </ul>
          <p className="text-[14px] text-justify">
            <strong>3.7</strong>&nbsp; Zákazník je oprávněn kdykoli požádat o zrušení Uživatelského účtu; tím nejsou dotčena
            práva a povinnosti vzniklá před jeho zrušením.
          </p>
          <p className="text-[14px] text-justify">
            <strong>3.8</strong>&nbsp; Zákazník bere na vědomí, že zrušením Uživatelského účtu nedochází k automatickému
            zrušení nebo znehodnocení Zákaznických karet ani k zániku Kreditu evidovaného na těchto
            kartách.
          </p>
          <p className="text-[14px] text-justify">
            <strong>3.9</strong>&nbsp; Provozovatel si vyhrazuje právo Uživatelský účet zrušit i bez předchozího upozornění
            v případech závažného porušení povinností Zákazníka, zejména v případech jednání směřujícího
            k obcházení systému E-shopu, zneužití platební brány nebo neoprávněného zásahu do technického
            provozu.
          </p>
        </div>

        {/* IV. Zákaznické karty a jejich užívání */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">IV. Zákaznické karty a jejich užívání</h3>

          <p className="text-[14px] text-justify">
            <strong>4.1</strong>&nbsp; Zákaznické karty slouží k úhradě ceny Služeb poskytovaných v Mycím centru, a to vyjma
            vysavačů umístěných v areálu Mycího centra, které jsou provozovány výhradně na mince.
          </p>
          <p className="text-[14px] text-justify">
            <strong>4.2</strong>&nbsp; Provozovatel vydává Zákaznické karty Zákazníkům zdarma.
          </p>
          <p className="text-[14px] text-justify">
            <strong>4.3</strong>&nbsp; Zákaznické karty jsou vydávány jako anonymní, nejsou vázány na konkrétní osobu a
            nejsou opatřeny žádnými identifikačními údaji Zákazníka ani jiného uživatele Zákaznické karty.
          </p>
          <p className="text-[14px] text-justify">
            <strong>4.4</strong>&nbsp; Oprávněným uživatelem Zákaznické karty je každá osoba, která Zákaznickou kartou
            fakticky disponuje a použije ji k čerpání Služeb. Provozovatel není povinen ani oprávněn
            ověřovat totožnost uživatele karty.
          </p>
          <p className="text-[14px] text-justify">
            <strong>4.5</strong>&nbsp; Zákazníci mají možnost pořizovat Zákaznické karty nejen pro sebe, ale i pro třetí
            osoby, zejména své zaměstnance nebo spolupracovníky, a tyto karty jim předávat k užívání.
            Provozovatel nenese odpovědnost za jakékoliv vztahy vznikající mezi Zákazníkem a takovými
            třetími osobami.
          </p>
        </div>

        {/* V. Uzavření smlouvy k Zákaznické kartě a platební podmínky */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">V. Uzavření smlouvy k Zákaznické kartě a platební podmínky</h3>

          <p className="text-[14px] text-justify">
            <strong>5.1</strong>&nbsp; Zákaznické karty jsou Zákazníkům poskytovány na základě jejich objednávky, kterou
            Provozovatel potvrdí prostřednictvím webového rozhraní E-shopu.
          </p>
          <p className="text-[14px] text-justify">
            <strong>5.2</strong>&nbsp; Úhradu ceny Zákaznické karty je možné provést výhradně bezhotovostně prostřednictvím
            platební brány.
          </p>
          <p className="text-[14px] text-justify">
            <strong>5.3</strong>&nbsp; Daňový doklad je Zákazníkovi automaticky zasílán v elektronické podobě na e-mailovou
            adresu, kterou Zákazník uvede pro účely provozu Uživatelského účtu.
          </p>
          <p className="text-[14px] text-justify">
            <strong>5.4</strong>&nbsp; Zákaznická karta bude Zákazníkovi doručena na adresu uvedenou pro účely provozu
            Uživatelského účtu prostřednictvím poskytovatele poštovních služeb nebo po předchozí domluvě
            předána osobně na adrese Mycího centra.
          </p>
        </div>

        {/* VI. Kredit na Zákaznické kartě */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">VI. Kredit na Zákaznické kartě</h3>

          <p className="text-[14px] text-justify">
            <strong>6.1</strong>&nbsp; Aktuální stav Kreditu na Zákaznické kartě je evidován výhradně v elektronickém systému
            Provozovatele a vázán na konkrétní Zákaznickou kartu.
          </p>
          <p className="text-[14px] text-justify">
            <strong>6.2</strong>&nbsp; Platnost Kreditu nabitého na Zákaznickou kartu je časově omezená na 24 měsíců.
          </p>
          <p className="text-[14px] text-justify">
            <strong>6.3</strong>&nbsp; Minimální výše Kreditu na jednorázové dobití Zákaznické karty je stanovena na 500 Kč,
            maximální výše na jedno dobití kreditu je 10 000 Kč.
          </p>
          <p className="text-[14px] text-justify">
            <strong>6.4</strong>&nbsp; Kredit lze dobíjet výhradně prostřednictvím E-shopu Provozovatele. Úhradu za dobití
            kreditu je možné provádět pouze bezhotovostně prostřednictvím platební brány.
          </p>
          <p className="text-[14px] text-justify">
            <strong>6.5</strong>&nbsp; Kredit je připsán na Zákaznickou kartu bez zbytečného odkladu po úspěšném provedení
            platby.
          </p>
          <p className="text-[14px] text-justify">
            <strong>6.6</strong>&nbsp; Daňový doklad je Zákazníkovi automaticky zasílán v elektronické podobě na e-mailovou
            adresu, kterou Zákazník uvede pro účely provozu Uživatelského účtu.
          </p>
          <p className="text-[14px] text-justify">
            <strong>6.7</strong>&nbsp; Kredit nabitý na Zákaznickou kartu je nevratný, nelze jej směnit za peněžní prostředky
            ani převést na jinou Zákaznickou kartu, a to ani v případě ukončení smluvního vztahu a zrušení
            Uživatelského účtu.
          </p>
          <p className="text-[14px] text-justify">
            <strong>6.8</strong>&nbsp; V případě ztráty, odcizení, zničení nebo poškození Zákaznické karty nevzniká nárok na
            náhradu nevyčerpaného Kreditu.
          </p>
        </div>

        {/* VII. Provoz Mycího centra a odpovědnost */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">VII. Provoz Mycího centra a odpovědnost</h3>

          <p className="text-[14px] text-justify">
            <strong>7.1</strong>&nbsp; Mycí centrum je provozováno nepřetržitě, tj. 24 hodin denně, 7 dní v týdnu, není-li
            jeho provoz dočasně omezen z technických, bezpečnostních, provozních nebo jiných důvodů.
          </p>
          <p className="text-[14px] text-justify">
            <strong>7.2</strong>&nbsp; Provozovatel si vyhrazuje právo Mycí centrum nebo jeho jednotlivé části kdykoli
            dočasně uzavřít, omezit nebo přerušit jeho provoz, a to zejména z důvodů technické údržby,
            oprav, revizí, modernizace zařízení, havárie, výpadku dodávek energií, nepříznivých
            povětrnostních podmínek, zásahu vyšší moci nebo z jiných provozních či bezpečnostních důvodů.
          </p>
          <p className="text-[14px] text-justify">
            <strong>7.3</strong>&nbsp; Zákazník bere na vědomí, že v důsledku dočasného omezení nebo přerušení provozu
            Mycího centra může dojít k nemožnosti čerpání Služeb, a to i bez předchozího upozornění,
            zejména v případech neplánovaných odstávek.
          </p>
          <p className="text-[14px] text-justify">
            <strong>7.4</strong>&nbsp; Provozovatel neodpovídá za jakoukoli škodu, újmu ani jinou ztrátu vzniklou Zákazníkovi
            nebo třetím osobám v souvislosti s dočasným uzavřením, omezením nebo přerušením provozu
            Mycího centra, a to včetně ušlého zisku, nákladů vynaložených v souvislosti s cestou do
            Mycího centra nebo nemožnosti využít Kredit.
          </p>
          <p className="text-[14px] text-justify">
            <strong>7.5</strong>&nbsp; Zákazníkovi v takových případech nevzniká právo na vrácení, náhradu, ani jinou
            kompenzaci, ani právo na slevu z ceny Služeb, ledaže obecně závazné právní předpisy stanoví
            jinak.
          </p>
          <p className="text-[14px] text-justify">
            <strong>7.6</strong>&nbsp; Zákazník i každý uživatel Zákaznické karty je povinen dodržovat veškeré provozní
            a bezpečnostní pokyny Provozovatele.
          </p>
          <p className="text-[14px] text-justify">
            <strong>7.7</strong>&nbsp; Provozovatel neodpovídá za škodu vzniklou v důsledku nesprávného použití zařízení
            Mycího centra, nedodržení pokynů nebo v důsledku technického stavu vozidla.
          </p>
        </div>

        {/* VIII. Reklamační řád */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">VIII. Reklamační řád</h3>

          <p className="text-[14px] text-justify">
            <strong>8.1</strong>&nbsp; Zákazník je oprávněn uplatnit práva z vadného plnění v souladu s příslušnými
            ustanoveními občanského zákoníku a, v případě spotřebitele, též zákona č. 634/1992 Sb.,
            o ochraně spotřebitele.
          </p>
          <p className="text-[14px] text-justify">
            <strong>8.2</strong>&nbsp; Práva z vadného plnění je Zákazník povinen uplatnit bez zbytečného odkladu poté,
            co se o vadě dozvěděl, a to s přihlédnutím k povaze poskytovaných Služeb, které jsou
            poskytovány bezprostředně a jednorázově.
          </p>
          <p className="text-[14px] text-justify">
            <strong>8.3</strong>&nbsp; Práva z vadného plnění Služeb mohou být uplatněna výhradně elektronickou formou,
            zejména prostřednictvím e-mailové adresy Provozovatele, přičemž uplatnění práv z vadného
            plnění musí obsahovat alespoň:
          </p>
          <ul className="text-[14px] flex flex-col gap-2 pl-8">
            <li><strong>a.</strong>&nbsp; identifikaci Zákazníka,</li>
            <li><strong>b.</strong>&nbsp; popis reklamované vady,</li>
            <li><strong>c.</strong>&nbsp; datum a přibližný čas čerpání Služby,</li>
            <li><strong>d.</strong>&nbsp; identifikaci Zákaznické karty nebo jiné relevantní transakce.</li>
          </ul>
          <p className="text-[14px] text-justify">
            <strong>8.4</strong>&nbsp; Zákazník bere na vědomí, že poskytnutí práv z vadného plnění uplatněná s výrazným
            časovým odstupem od poskytnutí Služby může být ztíženo nebo znemožněno z hlediska jejich
            objektivního posouzení, zejména s ohledem na technickou povahu zařízení Mycího centra.
          </p>
          <p className="text-[14px] text-justify">
            <strong>8.5</strong>&nbsp; Provozovatel je povinen vyřídit uplatněná práva z vadného plnění ve lhůtách
            stanovených obecně závaznými právními předpisy.
          </p>
          <p className="text-[14px] text-justify">
            <strong>8.6</strong>&nbsp; V případě, že je uplatnění práv z vadného plnění shledáno za oprávněné, poskytne
            Provozovatel Zákazníkovi přiměřenou náhradu, zejména formou:
          </p>
          <ul className="text-[14px] flex flex-col gap-2 pl-8">
            <li><strong>a.</strong>&nbsp; opětovného umožnění čerpání Služby,</li>
            <li><strong>b.</strong>&nbsp; připsání odpovídající části Kreditu na Zákaznickou kartu,</li>
          </ul>
          <p className="text-[14px] text-justify">
            a to dle povahy vady a možností Provozovatele.
          </p>
          <p className="text-[14px] text-justify">
            <strong>8.7</strong>&nbsp; Zákazník bere na vědomí, že s ohledem na povahu Služeb nepřichází v úvahu
            odstranění vady opravou ani výměnou Služby; nárok na vrácení peněžních prostředků je vyloučen,
            nestanoví-li obecně závazné právní předpisy výslovně jinak.
          </p>
          <p className="text-[14px] text-justify">
            <strong>8.8</strong>&nbsp; O výsledku reklamačního řízení informuje Provozovatel Zákazníka elektronicky.
          </p>
        </div>

        {/* IX. Zvláštní ustanovení týkající se spotřebitelů */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">IX. Zvláštní ustanovení týkající se spotřebitelů</h3>

          <p className="text-[14px] text-justify">
            <strong>9.1</strong>&nbsp; Tato ustanovení se vztahují výlučně na Zákazníky, kteří jsou spotřebiteli.
          </p>
          <p className="text-[14px] text-justify">
            <strong>9.2</strong>&nbsp; Spotřebitel bere na vědomí, že u služeb poskytovaných bezprostředně nelze uplatnit
            právo na odstoupení od smlouvy dle § 1837 občanského zákoníku.
          </p>
          <p className="text-[14px] text-justify">
            <strong>9.3</strong>&nbsp; K mimosoudnímu řešení spotřebitelských sporů je příslušná Česká obchodní inspekce.
          </p>
        </div>

        {/* X. Ochrana osobních údajů */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">X. Ochrana osobních údajů</h3>

          <p className="text-[14px] text-justify">
            <strong>10.1</strong>&nbsp; Provozovatel vystupuje ve vztahu k osobním údajům Zákazníků jako správce osobních
            údajů ve smyslu Nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR).
          </p>
          <p className="text-[14px] text-justify">
            <strong>10.2</strong>&nbsp; Provozovatel zpracovává osobní údaje Zákazníků zejména v rozsahu identifikačních
            a kontaktních údajů, údajů souvisejících s Uživatelským účtem, objednávkami, platbami
            a technickým provozem E-shopu.
          </p>
          <p className="text-[14px] text-justify">
            <strong>10.3</strong>&nbsp; Osobní údaje Zákazníků jsou zpracovávány zejména za účelem:
          </p>
          <ul className="text-[14px] flex flex-col gap-2 pl-8">
            <li><strong>a.</strong>&nbsp; uzavření a plnění smlouvy,</li>
            <li><strong>b.</strong>&nbsp; vedení Uživatelského účtu,</li>
            <li><strong>c.</strong>&nbsp; plnění právních povinností Provozovatele,</li>
            <li><strong>d.</strong>&nbsp; zasílání obchodních sdělení na základě souhlasu Zákazníka.</li>
          </ul>
          <p className="text-[14px] text-justify">
            <strong>10.4</strong>&nbsp; Právním základem zpracování osobních údajů Zákazníků je zejména plnění smlouvy,
            splnění právní povinnosti a souhlas subjektu údajů.
          </p>
          <p className="text-[14px] text-justify">
            <strong>10.5</strong>&nbsp; Osobní údaje Zákazníků jsou zpracovávány po dobu trvání smluvního vztahu a dále
            po dobu nezbytnou k ochraně práv Provozovatele a plnění jeho zákonných povinností.
          </p>
          <p className="text-[14px] text-justify">
            <strong>10.6</strong>&nbsp; Osobní údaje Zákazníků mohou být zpřístupněny zejména poskytovatelům IT služeb,
            platebních služeb a orgánům veřejné moci v případech stanovených právními předpisy.
          </p>
          <p className="text-[14px] text-justify">
            <strong>10.7</strong>&nbsp; Zákazník má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz,
            omezení zpracování, vznést námitku proti zpracování a podat stížnost u Úřadu pro ochranu
            osobních údajů.
          </p>
          <p className="text-[14px] text-justify">
            <strong>10.8</strong>&nbsp; Souhlas se zasíláním obchodních sdělení může Zákazník kdykoli odvolat.
          </p>
        </div>

        {/* XI. Závěrečná ustanovení */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl sm:text-3xl">XI. Závěrečná ustanovení</h3>

          <p className="text-[14px] text-justify">
            <strong>11.1</strong>&nbsp; Tyto VOP se řídí právním řádem České republiky.
          </p>
          <p className="text-[14px] text-justify">
            <strong>11.2</strong>&nbsp; Provozovatel si vyhrazuje právo tyto VOP jednostranně měnit.
          </p>
          <p className="text-[14px] text-justify">
            <strong>11.3</strong>&nbsp; Tyto VOP nabývají účinnosti dne 1. 4. 2026.
          </p>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default BussinessConditions;
