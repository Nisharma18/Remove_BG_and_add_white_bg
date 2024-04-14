import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { api_key } from "./utils/index";

const Remover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [finalUrl, setFinalUrl] = useState(null);
  const [isUpload, setIsUpload] = useState(false);

  const handleFileInputChange = (e) => {
    let image = e.target.files?.[0];
    setSelectedFile(image || null);
  };

  const addWhiteBackground = (imageBlob) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(imageBlob);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        setFinalUrl(URL.createObjectURL(blob));
      });
    };
  };

  const handleFileUpload = async () => {
    setIsUpload(true);
    const formData = new FormData();
    formData.append("image_file", selectedFile);
    formData.append("size", "auto");

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": api_key,
          },
          responseType: "blob",
        }
      );

      addWhiteBackground(response.data);
    } catch (error) {
      console.error("Error uploading file time:", error);
    } finally {
      setIsUpload(false);
    }
  };

  return (
    <div>
      <form>
        <label htmlFor="userImg">Select a File</label>
        <input
          type="file"
          id="userImg"
          onChange={handleFileInputChange}
          required
        />
        {!isUpload ? (
          <button type="button" onClick={handleFileUpload}>
            Upload File
          </button>
        ) : (
          <button type="button" disabled={true}>
            Uploading...
          </button>
        )}
      </form>
      <div>
        {finalUrl && (
          <div>
            <img
              src={finalUrl}
              alt="final_img"
              style={{ background: "#fff" }}
            />
          </div>
        )}
        {finalUrl && (
          <a href={finalUrl} download="Removed_Background.png">
            <button>Download</button>
          </a>
        )}
      </div>
    </div>
  );
};

export default Remover;
