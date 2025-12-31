import ExternalLink from "./ExternalLink";
import FooterDiv from "./FooterDiv";
import { useEffect, useState } from "react";

function Footer() {
  const [width, setWidth] = useState(window.innerWidth);

  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <footer className="w-full pb-10 lg:pb-20 body-bg-color border-t-[1px] border-gray-500">
      <div className="grid lg:grid-cols-3 grid-cols-1 justify-items-center items-baseline pt-8 lg:pt-15 lg:gap-10 gap-6">
        {width < 1025 && <FooterDiv />}
        <div className="flex flex-col items-center lg:items-baseline">
          <h2 className="sm:text-2xl text-xl mb-2 lg:mb-3">SÍDLO</h2>
          <div className="flex flex-col items-center lg:items-baseline">
            <p className="lg:text-[18px] text-[13px]">F.X. CARWASH S.R.O.</p>
            <p className="lg:text-[18px] text-[13px]">
              ŽIŽKOVA 1125, 252 62 HOROMĚŘICE
            </p>
            <p className="lg:text-[18px] text-[13px]">IČO: 23579102</p>
            <p className="lg:text-[18px] text-[13px]">DIČ: CZ23579102</p>
          </div>
        </div>
        {width >= 1025 && <FooterDiv />}
        <div className="flex flex-col items-center lg:items-baseline">
          <h2 className="sm:text-2xl text-xl mb-2 lg:mb-3">KONTAKT</h2>
          <div className="flex flex-col items-center lg:items-baseline">
            <p className="lg:text-[18px] text-[13px]">+420 603 159 572</p>
            <p className="lg:text-[18px] text-[13px]">SALES@FXCARWASH.CZ</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10 lg:mt-20 gap-4">
        <ExternalLink href="https://www.instagram.com/f.x.carwash/">
          <img
            className="w-6 h-6 invert"
            src="/icons/instagram-icon.svg"
            alt="instagram-icon"
          />
        </ExternalLink>
        <ExternalLink href="https://facebook.com/61585347136984/">
          <img
            className="w-6 h-6 invert"
            src="/icons/facebook-icon.svg"
            alt="facebook-icon"
          />
        </ExternalLink>
        <ExternalLink href="https://www.youtube.com/@F.X.Carwash">
          <img
            className="w-6 h-6 invert"
            src="/icons/youtube-icon.svg"
            alt="youtube-icon"
          />
        </ExternalLink>
      </div>
    </footer>
  );
}

export default Footer;
