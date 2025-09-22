import ExternalLink from "./ExternalLink";

function Footer() {
  return (
    <footer className="w-full h-90 body-bg-color border-t-[1px] border-gray-500">
      <div className="grid grid-cols-3 justify-items-center items-baseline pt-15">
        <div className="flex flex-col ">
          <h2 className="text-2xl mb-3">SÍDLO</h2>
          <div>
            <p>F.X. CARWASH S.R.O.</p>
            <p>ŽIŽKOVA 1125, 252 62 HOROMĚŘICE</p>
            <p>IČO: 23579102</p>
            <p>DIČ: CZ23579102</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl mb-3">MYCÍ CENTRUM</h2>
          <div className="flex flex-col justify-center items-center">
            <p>TŘÍDA 1. MÁJE, 330 12 HORNÍ BŘÍZA</p>
            <p className="font-medium">OTEVÍRACÍ DOBA: NONSTOP</p>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl mb-3">KONTAKT</h2>
          <div className="flex flex-col ">
            <a>+420 723 372 912</a>
            <a>SALES@FXCARWASH.CZ</a>
            <a>GOOGLE MAPA</a>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-20 gap-4">
        <ExternalLink href="https://www.instagram.com/f.x.carwash/">
          <img
            className="w-6 h-6 invert"
            src="/instagram-icon.svg"
            alt="instagram-icon"
          />
        </ExternalLink>
        <ExternalLink href="https://facebook.com">
          <img
            className="w-6 h-6 invert"
            src="/facebook-icon.svg"
            alt="facebook-icon"
          />
        </ExternalLink>
        <ExternalLink href="https://youtube.com">
          <img
            className="w-6 h-6 invert"
            src="/youtube-icon.svg"
            alt="youtube-icon"
          />
        </ExternalLink>
      </div>
    </footer>
  );
}

export default Footer;
