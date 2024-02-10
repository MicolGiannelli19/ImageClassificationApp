import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import GridLoader from "react-spinners/GridLoader";

import { Predictions } from "./Predictions";
import { ImageGrid } from "./ImageGrid";

function ImageUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictedClass, setPredictedClass] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, number> | null>(
    null
  );
  const [activationImages, setActivationImages] = useState<any>({});
  const [showActivationImages, setShowActivationImages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // Reset state
    setImagePreview(null);
    q;
    setPredictedClass("");
    setPredictions({});
    setActivationImages({});
    setShowActivationImages(false);
    setIsLoading(false);

    // Get image preview, then display it when it is ready
    const file = acceptedFiles[0];
    const reader = new FileReader();

    // When the image has loaded, set it as the image preview
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    // If the file exists, read it as a data URL
    if (file) {
      reader.readAsDataURL(file);
    }

    // Package the image in a FormData object to be sent to the backend
    const formData = new FormData();
    formData.append("file", file);

    // Send the image to the backend for classification
    setIsLoading(true);
    fetch("/api/classify", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setPredictedClass(data["predicted_class"]);
        setPredictions(data["predictions"]);
        setActivationImages(data["activation_images"]);
      })
      .catch((error) => {
        console.log("Upload failed:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const customGetInputProps = () => ({
    ...getInputProps(),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
  });

  const style = {
    padding: "20px",
    border: isDragActive ? "2px dashed cyan" : "2px dashed gray",
  };

  if (showActivationImages) {
    return (
      <div onClick={() => setShowActivationImages(false)}>
        <ImageGrid activationImages={activationImages} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#00000055",
        padding: "30px",
        borderRadius: "10px",
      }}
    >
      <div style={style} {...getRootProps()}>
        <input {...customGetInputProps()} />
        {imagePreview ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={imagePreview} width="400px" alt="Preview" />
                {predictedClass ? (
                  <h1>{predictedClass}</h1>
                ) : (
                  <div className="spinner"></div>
                )}
              </div>
              <Predictions predictions={predictions!} />
            </div>
            {Object.keys(activationImages).length > 0 ? (
              <button onClick={() => setShowActivationImages(true)}>
                View Activations
              </button>
            ) : null}
          </div>
        ) : (
          <p>Drop an image here, or click to select</p>
        )}
        <GridLoader
          color={"teal"}
          loading={isLoading}
          size={25}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}

export default ImageUpload;
