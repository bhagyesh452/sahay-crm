// import React, { useState } from 'react';
// import { Document, Page } from 'react-pdf';

// const PdfViewer = ({ pdfPath, pdfImage }) => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div>
//       {/* <img src={pdfImage} alt="pdficon" /> */}
//       <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
//         <Page pageNumber={pageNumber} />
//       </Document>
//       <p>
//         Page {pageNumber} of {numPages}
//       </p>
//     </div>
//   );
// };

// export default PdfViewer;

import React, { useState } from 'react';
import { Document, Page } from 'react-pdf-to-image';

const PdfToImageConverter = ({ pdfPath }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document
        file={pdfPath}
        onLoadSuccess={onDocumentLoadSuccess}
        renderMode="canvas" // Use "canvas" to render as an image
      >
        {[...Array(numPages)].map((_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

export default PdfToImageConverter;

