import React, { useRef } from 'react';
import dynamic from 'next/dynamic';

const PDFGenerator = () => {
  const contentRef = useRef(null);

  const handleConvertToPDF = async () => {
    if (!contentRef.current) return;

    const html2pdf = await import('html2pdf.js');
    
    const opt = {
      margin: 10,
      filename: 'generated_pdf.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(contentRef.current).set(opt).save();
  };

  return (
    <div>
      <div ref={contentRef}>
        {/* Your entire page content */}
        <h1>asdasdad</h1>
        {/* This will include your Next.js page content */}
      </div>
      <button onClick={handleConvertToPDF}>Download as PDF</button>
    </div>
  );
};

export default PDFGenerator;
