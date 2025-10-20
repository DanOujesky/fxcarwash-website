import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsPageContent from "../components/NewsPageContent";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

interface News {
  id: string;
  title: string;
  text: string;
  image: string;
}

function NewsPage() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    fetch(`news.json`)
      .then((res) => res.json())
      .then((data) => setNews(data));
    console.log(API_URL);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center">
        <h2 className="text-white page-title-size">Novinky</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {news.map((item, index) => (
          <NewsPageContent
            key={item.id}
            title={item.title}
            text={item.text}
            image={`/images${item.image}`}
            rightSite={index % 2 == 1 ? true : false}
          />
        ))}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default NewsPage;
