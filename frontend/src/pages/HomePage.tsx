import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const slides = [
  { src: "/images/hero-exterior.webp", kb: "kb-1" },
  { src: "/images/hero-action.webp",   kb: "kb-2" },
  { src: "/images/hero-aerial.webp",   kb: "kb-3" },
];

function HomePage() {
  const [current, setCurrent] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setTick((t) => t + 1);
    }, 7500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col w-full">
      <Header homePage={true} logo={true} />

      <div className="relative w-full h-screen overflow-hidden bg-black">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              key={i === current ? tick : i}
              src={slide.src}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover origin-center ${
                i === current ? slide.kb : ""
              }`}
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

        {/* Text */}
        <div className="absolute bottom-12 left-6 sm:bottom-16 sm:left-16 flex flex-col gap-3 sm:gap-4 max-w-[85vw] sm:max-w-2xl">
          <p
            className="hero-fade-in text-[10px] sm:text-[11px] text-white/50 uppercase tracking-[0.4em] sm:tracking-[0.6em]"
            style={{ animationDelay: "0.5s" }}
          >
            Profesionální péče o váš vůz
          </p>
          <h1
            className="hero-fade-in text-[42px] sm:text-6xl lg:text-[90px] text-white font-bold leading-none tracking-wider"
            style={{ animationDelay: "0.9s" }}
          >
            F.X.<br />CARWASH
          </h1>
          <div
            className="hero-fade-in flex items-center gap-3 mt-1"
            style={{ animationDelay: "1.3s" }}
          >
            <div className="h-px w-8 sm:w-12 bg-green-400/70" />
            <p className="text-xs sm:text-sm text-white/60 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-[Inter]">
              Automyčka
            </p>
          </div>
        </div>

        {/* Indikátor */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-16 flex gap-2 items-center">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => { setCurrent(i); setTick((t) => t + 1); }}
              className={`rounded-full cursor-pointer transition-all duration-500 ${
                i === current ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
