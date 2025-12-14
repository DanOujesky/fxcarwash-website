import Footer from "../components/Footer";
import Header from "../components/Header";

function PartnersPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header homePage={false} />
      <div className="header-color w-full page-title-height header-margin flex justify-center items-center text-center flex-col gap-5">
        <h2 className="text-white page-title-size mb-7t mx-10">FIRMY</h2>
        <p className="text-[16px]">
          Našim partnerům nabízíme možnost využití zvýhodněných předplacených
          karet.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full py-10 lg:py-20 flex justify-center items-center px-10 lg:px-30 body-bg-color">
          <div className="flex flex-col gap-10 items-center justify-center">
            <h3 className="lg:text-4xl text-3xl text-center">
              Program pro&nbsp;partnery
            </h3>
            <div>
              <div className="mt-2">
                <p className="text-[16px] mb-2 titleText">Hlavní výhody:</p>
                <ul className="list-disc pl-10">
                  <li className="text-[16px]">
                    Uplatnění slevy při každém mytí.
                  </li>
                  <li className="text-[16px]">
                    Možnost využití jako firemního benefitu pro Vaše
                    zaměstnance.
                  </li>
                  <li className="text-[16px]">
                    Zajímavý a netradiční dárek pro Vaše partnery.
                  </li>
                  <li className="text-[16px]">
                    Potisk karet umíme zajistit přímo na míru Vaší společnosti.
                  </li>
                </ul>
              </div>
              <p className="text-[16px] text-justify mt-2">
                Pro individuální podmínky nás neváhejte kontaktovat.
              </p>
            </div>
          </div>
        </div>
        <div className="h-70 lg:h-120">
          <img
            className="h-full w-full object-cover"
            src="/images/partners-image.jpg"
            alt="image"
          />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default PartnersPage;
