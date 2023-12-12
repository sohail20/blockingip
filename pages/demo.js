import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import { htmlElement } from '../utils/akdn';

export async function getServerSideProps() {
    return {
        props: {
            htmlContent: htmlElement,
        },
    };
}

const ConvertToPDFPage = ({ htmlContent }) => {
    const contentRef = useRef(null);

    const downloadPDF = () => {
        if (contentRef.current) {
            const content = contentRef.current;
            var pdf = new jsPDF('p', 'pt', [11050, 10000], true);
            pdf.addImage("https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png", 'PNG', 0, 0, 485, 270, undefined, 'FAST');

            // Add the content to the PDF
            pdf.html(content, {
                // enableLinks: true, // Enable hyperlinks
                // html2canvas: { dpi: 800, letterRendering: true, width: 780, height: 1920},
                callback: (pdf) => {
                    //Enable text selection in the PDF
                    pdf.internal.events.subscribe('addPage', (data) => {
                        pdf.internal.getPageInfo(data.pageNumber).pageContext.textRenderingMode = pdf.TextRenderingMode.FILL;
                    });

                    // Download the PDF
                    pdf.save('converted-page.pdf');
                },
            });
        }
    };

    useEffect(() => {
        // Any necessary setup or data fetching logic here
    }, []);

    return (
        <div>
            <button onClick={downloadPDF}>Download as PDF</button>
            <div ref={contentRef}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </div>
    );
};

export default ConvertToPDFPage;
