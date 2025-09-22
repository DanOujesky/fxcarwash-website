import AnimatedDiv from "./AnimatedDiv";

type NewsPageContent = {
  rightSite: boolean;
  title: string;
  text: string;
  image: string;
};

function NewsPageContent({ rightSite, title, text, image }: NewsPageContent) {
  if (rightSite) {
    return (
      <>
        <div className="h-140">
          <img className="h-full w-full object-cover" src={image} alt="image" />
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
          <img className="h-full w-full object-cover" src={image} alt="image" />
        </div>
      </>
    );
  }
}

export default NewsPageContent;
