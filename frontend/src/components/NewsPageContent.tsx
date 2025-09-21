import AnimatedDiv from "./AnimatedDiv";

type NewsPageContent = {
  rightSite: boolean;
  title: string;
  text: string;
};

function NewsPageContent({ rightSite, title, text }: NewsPageContent) {
  if (rightSite) {
    return (
      <>
        <div className="h-140">
          <img
            className="h-full w-full object-cover"
            src="src/assets/car-news-image-1.webp"
            alt="image-1"
          />
        </div>
        <div className="h-140 flex justify-center items-center px-30 body-bg-color">
          <AnimatedDiv rightSite={rightSite} title={title} text={text} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="h-140 flex justify-center items-center px-30 body-bg-color">
          <AnimatedDiv rightSite={rightSite} title={title} text={text} />
        </div>
        <div className="h-140">
          <img
            className="h-full w-full object-cover"
            src="src/assets/car-news-image-1.webp"
            alt="image-1"
          />
        </div>
      </>
    );
  }
}

export default NewsPageContent;
