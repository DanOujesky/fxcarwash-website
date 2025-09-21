import Header from "../components/Header";
import { useEffect, useState } from "react";

const images = ["/car-home-image-1.webp", "/car-home-image-2.webp"];

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative flex flex-col w-full h-full">
      <Header homePage={true} />
      <div className="relative w-full h-screen overflow-hidden">
        {images.map((src, index) => (
          <img
            key={index}
            src={`src/assets${src}`}
            alt={`image-${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
