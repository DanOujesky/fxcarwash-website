import { useEffect, useState } from "react";
import AnimatedDiv from "./AnimatedDiv";

type NewsPageContent = {
  rightSite: boolean;
  title: string;
  text: string;
  image: string;
};

function NewsPageContent({ rightSite, title, text, image }: NewsPageContent) {
  const [clientWidth, setClientWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => setClientWidth(document.body.clientWidth);

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  if (rightSite && clientWidth > 1023) {
    return (
      <>
        <div className="h-70 lg:h-120">
          <img className="h-full w-full object-cover" src={image} alt="image" />
        </div>
        <div className="h-full py-8 lg:py-20 flex justify-center items-center px-10 lg:px-30 body-bg-color">
          <AnimatedDiv rightSite={rightSite} title={title} text={text} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="h-full py-8 lg:py-20 flex justify-center items-center px-10 lg:px-30 body-bg-color ">
          <AnimatedDiv rightSite={rightSite} title={title} text={text} />
        </div>
        <div className="h-70 lg:h-120">
          <img className="h-full w-full object-cover" src={image} alt="image" />
        </div>
      </>
    );
  }
}

export default NewsPageContent;
