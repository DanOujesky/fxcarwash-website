import { useState } from "react";
type ImageSelectorProps = {
  image: string[];
};

function ImageSelector({ image }: ImageSelectorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  function nextImage() {
    if (imageIndex < image.length - 1) setImageIndex(imageIndex + 1);
    else setImageIndex(0);
  }
  function backImage() {
    if (imageIndex > 0) setImageIndex(imageIndex - 1);
    else setImageIndex(image.length - 1);
  }

  return (
    <div
      className="h-full w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="h-full w-full object-cover"
        src={`/images/${image[imageIndex]}`}
        alt="image"
      />
      {isHovered && (
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 -translate-y-1/2"
        >
          <img src="/icons/arrow_right.png" className="size-30 invert-100" />
        </button>
      )}
      {isHovered && (
        <button
          onClick={backImage}
          className="absolute top-1/2 left-4 -translate-y-1/2"
        >
          <img src="/icons/arrow_left.png" className="size-30 invert-100" />
        </button>
      )}
    </div>
  );
}

export default ImageSelector;
