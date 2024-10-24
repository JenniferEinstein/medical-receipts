import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCR = () => {
  const [imagePath, setImagePath] = useState("");
  const [image, setImage] = useState(null); // To store the uploaded image
  const [text, setText] = useState('');     // To store the extracted text
  const [loading, setLoading] = useState(false); // For loading state
  const [progress, setProgress] = useState(0); // To track OCR progress


  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  };


  const handleClick = () => {
    setLoading(true); // Start loading
    Tesseract.recognize(
      imagePath, 'eng',
      { 
        logger: m => {
          console.log(m);
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      }
    )
    .then(result => {
      setText(result.data.text); // Get the recognized text
      setLoading(false); // Stop loading
    })
    .catch(err => {
      console.error(err);
      setLoading(false); // Stop loading on error
    });
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Perform OCR using Tesseract.js
  const performOCR = () => {
    if (image) {
      setLoading(true);
      setProgress(0);

      Tesseract.recognize(
        image,
        'eng',
        {
          logger: (m) => {
            console.log(m);
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      )
        .then(({ data: { text } }) => {
          setText(text);
        })
        .catch(err => {
          console.error(err);
          setText('Error recognizing text');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <h1>React OCR with Tesseract.js</h1>

      {/* Input to upload the image */}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br /><br />

      {/* Show image preview if available */}
      {image && <img src={image} alt="Uploaded preview" style={{ width: '300px' }} />}
      <br /><br />

      {/* Button to trigger OCR */}
      <button onClick={performOCR}>Extract Text</button>

      {/* Show loading spinner or progress */}
      {loading && <p>Progress: {progress}%</p>}

      {/* Show the extracted text */}
      <div>
        <h2>Extracted Text</h2>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default OCRApp;
