import React, { useState, useEffect } from "react";
import LightGallery from "lightgallery/react";

// Styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch("http://localhost:5001/gallery"); // Ensure this URL is correct
        const imagesList = await response.json(); // List of image filenames
        setImages(imagesList.map((filename) => `/gallery/${filename}`));
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, []);

  return (
    <div>
      <h2>My Work</h2>
      <LightGallery plugins={[lgThumbnail, lgZoom]} speed={500}>
        {images.map((src, index) => (
          <a href={src} key={index}>
            <img
              src={src}
              alt={`Gallery Image ${index + 1}`}
              style={{ width: "200px", margin: "10px" }}
            />
          </a>
        ))}
      </LightGallery>
    </div>
  );
};

export default Gallery;
