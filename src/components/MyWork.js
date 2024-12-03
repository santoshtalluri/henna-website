import React, { useState, useEffect } from "react";
import LightGallery from "lightgallery/react";

// LightGallery Styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// LightGallery Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const MyWork = () => {
  const [images, setImages] = useState([]);

  // Fetch images from the backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5001/gallery");
        if (response.ok) {
          const imageFiles = await response.json();
          setImages(imageFiles.map((filename) => `/gallery/${filename}`)); // Map filenames to full paths
        } else {
          console.error("Failed to fetch images:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="my-work">
      <h2>My Work</h2>
      {images.length > 0 ? (
        <LightGallery plugins={[lgThumbnail, lgZoom]} speed={500}>
          {images.map((src, index) => (
            <a href={src} key={index}>
              <img
                src={src}
                alt={`Henna Design ${index + 1}`}
                style={{ width: "200px", margin: "10px" }}
              />
            </a>
          ))}
        </LightGallery>
      ) : (
        <p>No images available. Please check your gallery folder.</p>
      )}
    </div>
  );
};

export default MyWork;
