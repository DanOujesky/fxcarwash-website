import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";

const images = [
  "/images/car-home-image-1.webp",
  "/images/car-home-image-2.webp",
];

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
            src={src}
            alt={`image-${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute top-[30%] left-[10%] flex flex-col gap-2">
          <p className="lg:text-3xl text-2xl lg:text-white text-black">
            AUTOMYČKA
          </p>
          <h2 className="lg:text-6xl lg:text-white text-5xl text-black font-medium">
            F.X. CARWASH
          </h2>
          <p className="lg:text-white lg:text-3xl text-xl text-black  lg:font-normal">
            PROFESIONÁLNÍ PÉČE O VÁŠ VŮZ
          </p>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default HomePage;
