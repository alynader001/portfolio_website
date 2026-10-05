export default function VideoEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div>
      <iframe
        src={src}
        width={426}
        height={240}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        title={title}
      />
    </div>
  );
}
