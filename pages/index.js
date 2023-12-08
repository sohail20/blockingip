// import React, { useEffect, useState } from "react";
// import { ChakraProvider } from "@chakra-ui/react";
// import {
//   Box,
//   Input,
//   InputGroup,
//   InputRightElement,
//   IconButton,
//   Button,
//   Text
// } from '@chakra-ui/react';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
// import { useRouter } from 'next/router';

// import Demo from "../components/Demo";
// import { getClientIp } from "../helper";
// import axiosInstance from "../axiosInstance";
// import Custom403 from "./403";

// export default function Home() {
//   const router = useRouter();
//   const [isDownloading, setIsDownLoading] = useState(false)
//   const [isLoading, setIsLoading] = useState(true);
//   const [isBlocked, setIsBlocked] = useState(null);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(prevState => !prevState);
//   };

//   const checkBlockedStatus = async () => {
//     try {
//       const clientIp = await getClientIp();
//       const response = await axiosInstance.post('/isBlocked', { clientIp });
//       setIsBlocked(response.data.blocked);
//     } catch (error) {
//       if (error?.response?.data?.blocked) {
//         setIsBlocked(error.response.data.blocked);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     const clientIp = await getClientIp();
//     const response = await axiosInstance.post('/login', { clientIp, password });

//     setMessage(response.data.message);
//     if (response.data.status) {
//       setIsAuthorized(true);
//       setIsError(false);
//     } else {
//       if (response.data.message.includes("attempt")) {
//         setIsError(true);
//       } else {
//         router.push('/403', undefined, { shallow: true });
//       }
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       setIsDownLoading(true)
//       const response = await fetch('http://3.208.1.147:3001/api/download-pdf', {
//         method: "POST"
//       });
//       console.log("response", response)
//       const blob = await response.blob();

//       if (window.navigator.msSaveOrOpenBlob) {
//         // For Internet Explorer/Edge browsers
//         window.navigator.msSaveOrOpenBlob(blob, 'output.pdf');
//       } else {
//         // Create a blob URL from the PDF blob received
//         const pdfUrl = window.URL.createObjectURL(blob);

//         // Create a temporary link element
//         const link = document.createElement('a');
//         link.href = pdfUrl;
//         link.setAttribute('download', 'output.pdf');

//         // Simulate a click to trigger the download
//         document.body.appendChild(link);
//         link.click();

//         // Cleanup
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(pdfUrl);
//         setIsDownLoading(false)
//       }
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//       setIsDownLoading(false)
//     }
//   };


//   const handleDownload12 = async () => {
//     try {
//       const response = await fetch('/api/generatePdf');
//       const pdfDataUri = await response.text();

//       // Create a temporary link element
//       const link = document.createElement('a');
//       link.href = pdfDataUri;
//       link.setAttribute('download', 'output.pdf');

//       // Simulate a click to trigger the download
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//     }
//   };


//   useEffect(() => {
//     checkBlockedStatus();
//   }, []);

//   return (
//     <ChakraProvider>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div>
//           {isBlocked ? (
//             <Custom403 />
//           ) : isAuthorized ? (
//             <Demo />
//           ) : (
//             <Box
//               display="flex"
//               flexDirection="column"
//               justifyContent="center"
//               alignItems="center"
//               height="100vh"
//             >
//               US Moment
//               <InputGroup width="300px">
//                 <Input
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Password"
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <InputRightElement>
//                   <IconButton
//                     h="1.75rem"
//                     size="sm"
//                     onClick={togglePasswordVisibility}
//                     icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                   />
//                 </InputRightElement>
//               </InputGroup>
//               <Button colorScheme="teal" mt={2} onClick={handleLogin}>
//                 Login
//               </Button>
//               <Button colorScheme="teal" mt={2} onClick={handleDownload12}>
//                 Download 2
//               </Button> 
//               <Button isDisabled={isDownloading} colorScheme="teal" mt={2} onClick={handleDownload}>
//                 {isDownloading ? "Loading..." : "DownLoad pdf"}
//               </Button>
//               <Text mt={2} fontSize="sm" color={isError ? "red" : "green"}>
//                 {message}
//               </Text>
//             </Box>
//           )}
//         </div>
//       )}
//     </ChakraProvider>
//   );
// }



// import { useRef } from 'react';
// import jsPDF from 'jspdf';
// import PDFGenerator from '../components/PDFGenerator';
import React from 'react';
import ReactToPrint from 'react-to-print';

class PrintableContent extends React.Component {
  render() {
    return (
      <>
        <embed type="text/html" src="https://the.akdn/en/home" width="100%" height="7500" />
      </>
    );
  }
}

const PDFGenerator = () => {
  let componentRef = null;

  return (
    <div>
      <ReactToPrint
        trigger={() => <button>Download as PDF</button>}
        content={() => componentRef}
      />
      <div style={{ display: 'none' }}>
        <PrintableContent ref={el => (componentRef = el)} />
      </div>
    </div>
  );
};

export default PDFGenerator;
