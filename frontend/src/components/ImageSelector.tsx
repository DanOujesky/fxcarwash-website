import { useState, useRef } from "react";

type ImageSelectorProps = {
  image: string[];
};

const API_URL = import.meta.env.VITE_API_URL;

function resolveImageUrl(name: string): string {
  if (name.startsWith("/") || name.startsWith("http://") || name.startsWith("https://")) {
    return name;
  }
  return `${API_URL}/uploads/${name}`;
}

function ImageSelector({ image }: ImageSelectorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  if (!image || image.length === 0) {
    return (
      <div className="h-full w-full bg-[#1b1b1b] flex items-center justify-center text-white/30 text-sm">
        Bez obrázku
      </div>
    );
  }

  const safeIndex = Math.min(imageIndex, image.length - 1);
  const currentSrc = resolveImageUrl(image[safeIndex]);

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

  const showArrows = (isHovered || image.length > 1) && image.length > 1;

  return (
    <div
      className="h-full w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {failed[safeIndex] ? (
        <div className="h-full w-full bg-[#1b1b1b] flex items-center justify-center text-white/30 text-sm">
          Obrázek nelze načíst
        </div>
      ) : (
        <img
          className="h-full w-full object-cover select-none"
          src={currentSrc}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          onError={() => setFailed((prev) => ({ ...prev, [safeIndex]: true }))}
        />
      )}
      {showArrows && (
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition"
          aria-label="Další obrázek"
        >
          <img src="/icons/arrow_right.png" className="size-6 sm:size-10 invert-100" alt="" />
        </button>
      )}
      {showArrows && (
        <button
          onClick={backImage}
          className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition"
          aria-label="Předchozí obrázek"
        >
          <img src="/icons/arrow_left.png" className="size-6 sm:size-10 invert-100" alt="" />
        </button>
      )}
      {image.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {image.map((_, i) => (
            <button
              key={i}
              onClick={() => setImageIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition ${i === safeIndex ? "bg-white" : "bg-white/40"}`}
              aria-label={`Obrázek ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageSelector;
