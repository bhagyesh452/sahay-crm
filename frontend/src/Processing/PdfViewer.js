
// import React, { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import axios from "axios";

// function PdfImageViewer(props) {
//   const [numPages, setNumPages] = useState(null);
//   const [pageImages, setPageImages] = useState([]);
//   const [fileType, setFileType] = useState("");
//   const [fileData, setFileData] = useState("");

//   const secretKey = process.env.REACT_APP_SECRET_KEY;

//   pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

//   useEffect(() => {
//     fetchPdf();
//   }, []);

//   const fetchPdf = async () => {
//     const path = props.path;
//     const specificpath = props.type;

//     try {
//       const response = await axios.get(
//         `${secretKey}/${specificpath}/${path}`,
//         { responseType: "blob" }
//       );

//       const blob = response.data;

//       // Get the file type from the path or name
//       const extension = path.split(".").pop().toLowerCase();

//       // Set the file type
//       setFileType(extension);

//       if (extension === "pdf") {
//         // If the file is a PDF, render it using react-pdf
//         const reader = new FileReader();
//         reader.onload = function () {
//           const typedArray = new Uint8Array(this.result);
//           setFileData(typedArray);
//         };
//         reader.readAsArrayBuffer(blob);
//       } else {
//         // For image files (JPG, JPEG, PNG), set the data URL directly
//         const dataUrl = URL.createObjectURL(blob);
//         setFileData(dataUrl);
//       }
//     } catch (error) {
//       console.error("Error fetching file:", error);
//     }
//   };

//   return (
//     <div>
//       {fileType === "pdf" ? (
//         // Render PDF using react-pdf
//         <PdfViewer fileData={fileData} />
//       ) : (
//         // Render image directly
//         <ImageViewer fileData={fileData} />
//       )}
//     </div>
//   );
// }

// function PdfViewer({ fileData }) {
//   const [pageImages, setPageImages] = useState([]);
//   const [numPages, setNumPages] = useState(null);

//   useEffect(() => {
//     renderPdf();
//   }, [fileData]);

//   const renderPdf = async () => {
//     try {
//       const pdf = await pdfjs.getDocument({ data: fileData }).promise;
//       const images = [];
  
//       // Fixed dimensions for the canvas
//       const canvasWidth = 4000; // Set the desired width
//       const canvasHeight = 3900; // Set the desired height
  
//       const page = await pdf.getPage(1); // Get the first page
//       const viewport = page.getViewport({ scale: 8.0 });
  
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
  
//       canvas.height = canvasHeight;
//       canvas.width = canvasWidth;
  
//       await page.render({ canvasContext: context, viewport }).promise;
//       images.push(canvas.toDataURL());
  
//       setPageImages(images);
//       setNumPages(1);
//     } catch (error) {
//       console.error("Error rendering PDF:", error);
//     }
//   };
//   console.log(fileData)

//   return (
//     <div>
//       <div style={{ width: "100%", height: "100%", overflow: "none" }}>
//         {pageImages.map((image, index) => (
//           <img
//             key={index}
//             src={image}
//             alt={`Page ${index + 1}`}
//             style={{ width: "100%", height: "100%" }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function ImageViewer({ fileData }) {
//   return (
//     <div>
//       <img src={fileData} alt="File" />
//     </div>
//   );
// }

// export default PdfImageViewer;



import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

function PdfImageViewer(props) {

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageImages, setPageImages] = useState([]);
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  useEffect(() => {
    fetchPdf();
  }, []);
// console.log(props.path)
  const fetchPdf = async () => {
   const path = props.path
   const specificpath = props.type
    try {
      const response = await axios.get(`${secretKey}/${specificpath}/${path}`, {
        responseType: "blob"
      });
      const blob = response.data;
      const reader = new FileReader();
      reader.onload = function () {
        const typedArray = new Uint8Array(this.result);
        renderPdf(typedArray);
      };
      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const renderPdf = async (typedArray) => {
    const pdf = await pdfjs.getDocument(typedArray).promise;
    const images = [];

    // Fixed dimensions for the canvas
    const canvasWidth = 4000; // Set the desired width
    const canvasHeight = 3900; // Set the desired height

    const page = await pdf.getPage(1); // Get the first page
    const viewport = page.getViewport({ scale: 7 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    await page.render({ canvasContext: context, viewport }).promise;
    images.push(canvas.toDataURL());

    setPageImages(images);
    setNumPages(1);
  };

  return (
    <div>
      <div style={{ width: "100%", height: "100%", overflow: "none" }}>
        {pageImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Page ${index + 1}`}
            style={{ width: "100%", height:'100%'}}
          />
        ))}
      </div>
    </div>
  );
}

export default PdfImageViewer;
