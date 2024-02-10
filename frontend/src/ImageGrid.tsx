interface ImageGridProps {
  activationImages: Record<string, string[]>;
}

// NOTE: what is the other way of destrucutinf the props?
function ImageGrid({ activationImages }: ImageGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr) 2fr",
        gap: "16px",
      }}
    >
      {Object.keys(activationImages).map((layer) => (
        <div key={layer}>
          <h3>{layer}</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${
                activationImages[layer].length / 8
              },1)`,
              gap: "4px",
            }}
          >
            {activationImages[layer].map((img: string, index: number) => (
              <img
                key={index}
                src={`data:image/png;base64${img}`}
                alt={`activation-${index}`}
                style={{ width: "100px", height: "100px" }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ImageGrid;
