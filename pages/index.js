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
import React, { useEffect } from 'react';
import { Box, Heading, Text, Button, Image, Flex, Stack, Link } from '@chakra-ui/react';

const PlaceholderImage = ({ src, alt }) => {
  return (
    <Box boxShadow="md" borderRadius="md" overflow="hidden">
      <Image src={src} alt={alt} />
    </Box>
  );
};
const PrintableContent = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} style={{ userSelect: 'text' }} id="my-element">
      <Box p="4">
        <Link href={"https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png"}>Click memmeme</Link>
        <Flex align="center" justify="space-between" direction={{ base: 'column', md: 'row' }}>
          <Box maxW="400px">
            <Heading as="h1" size="2xl" mb="4">
              Welcome to Your Website
            </Heading>
            <Text fontSize="lg" mb="6">
              This is a beautiful one-page layout created with Chakra UI. Add your content here!
            </Text>
            <Link href="https://www.example.com" isExternal style={{ textDecoration: "none", color: "ActiveBorder" }}>
              <Button colorScheme="blue" cursor={"pointer"}>
                Visit Example Website
              </Button>
            </Link>
          </Box>
          <Box maxW="400px" mt={{ base: '8', md: '0' }}>
            <PlaceholderImage src="https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png" alt="Placeholder" />
          </Box>
        </Flex>

        <Stack spacing="8" mt="12">
          <Heading as="h2" size="xl">
            Our Services
          </Heading>
          <Flex align="center" justify="space-between" flexWrap="wrap">
            <Box maxW="300px" flex="1" mr="4" mb="4">
              <PlaceholderImage src="https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png" alt="Placeholder" />
              <Text mt="2">Service 1 Description</Text>
            </Box>
            <Box maxW="300px" flex="1" mr="4" mb="4">
              <PlaceholderImage src="https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png" alt="Placeholder" />
              <Text mt="2">Service 2 Description</Text>
            </Box>
            <Box maxW="300px" flex="1" mb="4">
              <PlaceholderImage src="https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png" alt="Placeholder" />
              <Text mt="2">Service 3 Description</Text>
            </Box>
          </Flex>
        </Stack>

        <Box mt="12">
          <Heading as="h2" size="xl">
            About Us
          </Heading>
          <Flex align="center" justify="space-between" direction={{ base: 'column', md: 'row' }} mt="4">
            <Box maxW="400px" mr={{ base: '0', md: '8' }} mb={{ base: '8', md: '0' }}>
              <PlaceholderImage src="https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png" alt="Placeholder" />
            </Box>
            <Box maxW="400px">
              <Text>
                A brief description about your company. Add more information about your values, mission, or team here.
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </div>
  );
});

const PDFGenerator = () => {
  const componentRef = React.useRef(null);

  // const handleDownload = () => {
  //   if (componentRef.current) {
  //     const content = componentRef.current;

  //     if (typeof window !== 'undefined') {
  //       import('html2pdf.js').then(({ default: html2pdf }) => {
  //         const options = {
  //           filename: 'itttt.pdf',
  //           image: { type: "jpg", quality: 0.95 },
  //           html2canvas: {
  //             dpi: 300,
  //             letterRendering: true,
  //             useCORS: true
  //           }
  //           // Other options...
  //         };

  //         html2pdf().from(content).set(options).save();
  //       });
  //     }
  //   }
  // };

  const handleDownload = () => {
    const content = document.getElementById('my-element'); // Replace 'content' with the ID of your content element
    if (content) {
      import('html2pdf.js').then(({ default: html2pdf }) => {
        const options = {
          filename: 'generated_pdf.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2, // Adjust scale as needed
            letterRendering: true,
            useCORS: true,
          },
          enableLinks: true, // Enable hyperlinks
          jsPDF: { format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: 'avoid-all' },
          onBeforeGenerate: (pdf) => {
            // Enable text selection in the PDF
            pdf.internal.events.subscribe('addPage', function (data) {
              pdf.internal.getPageInfo(data.pageNumber).pageContext.textRenderingMode = pdf.TextRenderingMode.FILL;
            });
          },
        };

        // Enable text selection in the PDF
        const style = document.createElement('style');
        style.innerHTML = `body { user-select: text; }`;
        content.appendChild(style);

        // const options1 = {
        //   filename: 'my-document.pdf',
        //   header:
        //     '<div style="text-align:center;">Page <span class="page"></span> of <span class="total"></span></div>',
        //   footer:
        //     '<div style="text-align:center;">Generated by my app on ' +
        //     new Date().toLocaleDateString() +
        //     '</div>',
        //   html2canvas: {
        //     scale: 2, // Adjust scale as needed
        //     letterRendering: true,
        //     useCORS: true,
        //   },
        // };
        // const element = document.querySelector('#my-element');

        // html2pdf().set(options1).from(element).save();

        html2pdf().from(content).set(options).save();
      });
    }
  };

  return (
    <div>
      <div style={{ display: 'none' }}>
        <PrintableContent ref={componentRef} />
      </div>
      <button onClick={handleDownload}>Download as PDF</button>
      <PrintableContent />
    </div>
  );
};

export default PDFGenerator;