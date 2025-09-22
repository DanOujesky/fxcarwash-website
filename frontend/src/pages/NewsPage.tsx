import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsPageContent from "../components/NewsPageContent";

function NewsPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center">
        <h2 className="text-white page-title-size">Novinky</h2>
      </div>
      <div className="grid grid-cols-2">
        <NewsPageContent
          rightSite={true}
          title="Základy mycího centra už jsou hotové"
          text="Vše pokračuje dle plánu a základy máme připravené. Můžete se těšit na tři plně vybavené moderní mycí boxy. Současně plánujeme zahájit úpravy nejbližšího okolí myčky, abyste se u nás cítili příjemně."
          image="/car-news-image-2.jpg"
        />
        <NewsPageContent
          rightSite={false}
          title="Připravujeme pro Vás nový projekt v Horní Bříze u Plzně"
          text="Už to pro Vás chystáme. Rádi bychom Vám v brzké době nabídli služby bezkontaktní samoobslužné automyčky. Práce zahájeny. Do budoucna nás najdete v blízkosti čerpací stanice MOL. Plánujeme otevření na přelomu říjen/listopad 2025."
          image="/car-news-image-1.jpg"
        />
      </div>
      <Footer></Footer>
    </div>
  );
}

export default NewsPage;
