import Header from "../components/Header";
import NewsPageContent from "../components/NewsPageContent";

function NewsPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full p-22 header-margin flex justify-center items-center">
        <h2 className="text-white text-7xl">Novinky</h2>
      </div>
      <div className="grid grid-cols-2">
        <NewsPageContent
          rightSite={true}
          title="Jaguar F-Type R P575 aneb alternativa k Aston Martinu Vantage"
          text="F-Type je unikátním modelem Jaguaru, který nás v roce 2024 opustil po
                dlouhých 11 letech výroby. Již během svého života se stal ikonou, která se
                zapíše do historie britského automobilismu. Jaguár americký je respekt
                budící šelmou s nejsilnějším skusem ze všech kočkovitých, podobný respekt
                budí i Jaguar F-Type. V některých verzích je to divoká zvěř, která se
                vyrovná mnohým strojům nejmocnějších značek ze světa supersportů. A pro
                automobilové fanoušky je ještě něčím větším, spirituálním nástupcem
                legendárního modelu E-Type. F-Type se ukázal i na filmových plátnech, kdy
                jej osedlal například Jason Statham alias Deckard Shaw ve filmech Furious
                7 a The Fate of the Furious."
        />
        <NewsPageContent
          rightSite={false}
          title="Jaguar F-Type R P575 aneb alternativa k Aston Martinu Vantage"
          text="F-Type je unikátním modelem Jaguaru, který nás v roce 2024 opustil po
                dlouhých 11 letech výroby. Již během svého života se stal ikonou, která se
                zapíše do historie britského automobilismu. Jaguár americký je respekt
                budící šelmou s nejsilnějším skusem ze všech kočkovitých, podobný respekt
                budí i Jaguar F-Type. V některých verzích je to divoká zvěř, která se
                vyrovná mnohým strojům nejmocnějších značek ze světa supersportů. A pro
                automobilové fanoušky je ještě něčím větším, spirituálním nástupcem
                legendárního modelu E-Type. F-Type se ukázal i na filmových plátnech, kdy
                jej osedlal například Jason Statham alias Deckard Shaw ve filmech Furious
                7 a The Fate of the Furious."
        />
      </div>
    </div>
  );
}

export default NewsPage;
