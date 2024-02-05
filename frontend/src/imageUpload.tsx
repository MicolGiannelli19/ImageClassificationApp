import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

function ImageUpload() {
  // why is there an array here understand useClalback

  //   we will store the image as a bit 64 encoded string
  const [imagepreview, setImagePreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    }

    // what is this formData thing
    const formData = new FormData();
    formData.append("file", file);

    // probably need to set up a variable that returns the name of the classificaiton
    fetch("/dimensions", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const style = {
    // Note operator ? is a ternary operator (very useful in react for conditional rendering)
    border: isDragActive ? "2px dashed black" : "2px dashed grey",
    borderRadius: "5px",
    padding: "20px",
  };

  if (imagepreview) {
    return (
      <div>
        <img src={imagepreview} width="400px" alt="Preview" />
      </div>
    );
  }

  return (
    <div {...getRootProps()} style={style}>
      <input {...getInputProps()} />
      <div>Drop Image here</div>
    </div>
  );
}

export default ImageUpload;
