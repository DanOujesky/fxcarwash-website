import { useState, useRef } from "react";
type ImageSelectorProps = {
  image: string[];
};

function ImageSelector({ image }: ImageSelectorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function nextImage() {
    setImageIndex((prev) => (prev < image.length - 1 ? prev + 1 : 0));
  }
  function backImage() {
    setImageIndex((prev) => (prev > 0 ? prev - 1 : image.length - 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextImage() : backImage();
    }
    touchStartX.current = null;
  }

  const showArrows = isHovered || image.length > 1;

  return (
    <div
      className="h-full w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        className="h-full w-full object-cover select-none"
        src={
          image[imageIndex].startsWith("/") || image[imageIndex].startsWith("http")
            ? image[imageIndex]
            : `${import.meta.env.VITE_API_URL}/uploads/${image[imageIndex]}`
        }
        alt="image"
        draggable={false}
      />
      {showArrows && (
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition"
          aria-label="Další obrázek"
        >
          <img src="/icons/arrow_right.png" className="size-6 sm:size-10 invert-100" />
        </button>
      )}
      {showArrows && (
        <button
          onClick={backImage}
          className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition"
          aria-label="Předchozí obrázek"
        >
          <img src="/icons/arrow_left.png" className="size-6 sm:size-10 invert-100" />
        </button>
      )}
      {image.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {image.map((_, i) => (
            <button
              key={i}
              onClick={() => setImageIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition ${i === imageIndex ? "bg-white" : "bg-white/40"}`}
              aria-label={`Obrázek ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageSelector;
