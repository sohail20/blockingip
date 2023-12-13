import React, { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  Text
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

import Demo from "../components/Demo";
import { getClientIp } from "../helper";
import axiosInstance from "../axiosInstance";
import Custom403 from "./403";
import { htmlElement } from "../utils/akdn";

export async function getServerSideProps() {
  // Read the HTML file from the file system
  return {
    props: {
      htmlContent: htmlElement,
    },
  };
}


const SampleComponent = ({ htmlContent, ref }) => {
  return (
    <div ref={ref} style={{ userSelect: 'text' }} id="my-element">
      {/* Render the HTML content using dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default function Home({ htmlContent }) {
  const router = useRouter();
  const [isDownloading, setIsDownLoading] = useState(false)
  const [isDownloading1, setIsDownLoading1] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const checkBlockedStatus = async () => {
    try {
      const clientIp = await getClientIp();
      const response = await axiosInstance.post('/isBlocked', { clientIp });
      setIsBlocked(response.data.blocked);
    } catch (error) {
      if (error?.response?.data?.blocked) {
        setIsBlocked(error.response.data.blocked);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    const clientIp = await getClientIp();
    const response = await axiosInstance.post('/login', { clientIp, password });

    setMessage(response.data.message);
    if (response.data.status) {
      setIsAuthorized(true);
      setIsError(false);
    } else {
      if (response.data.message.includes("attempt")) {
        setIsError(true);
      } else {
        router.push('/403', undefined, { shallow: true });
      }
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownLoading(true)
      const response = await fetch('https://leaper.store/api/download-pdf', {
        method: "POST",
      });
      const blob = await response.blob();

      if (window.navigator.msSaveOrOpenBlob) {
        // For Internet Explorer/Edge browsers
        window.navigator.msSaveOrOpenBlob(blob, 'akdn.pdf');
      } else {
        // Create a blob URL from the PDF blob received
        const pdfUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 'output.pdf');

        // Simulate a click to trigger the download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(pdfUrl);
        setIsDownLoading(false)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setIsDownLoading(false)
    }
  };

  const onDownloadPdf = () => {
    setIsDownLoading1(true)
    fetch("https://leaper.store/api/download-pdf-lambda", {
      method: "POST",
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/pdf'
      },
      body: JSON.stringify({ "url": props.pageUrl ? props.pageUrl : "" })
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = props?.title?.replace(/[^a-zA-Z0-9 ]/g, '').trim() + '.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setIsDownLoading1(false)
      })
      .catch(error => {
        console.error('Error fetching PDF:', error)
        setIsDownLoading1(false)
      })
  }

  useEffect(() => {
    checkBlockedStatus();
  }, []);

  return (
    <>
      <ChakraProvider>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {isBlocked ? (
              <Custom403 />
            ) : isAuthorized ? (
              <Demo />
            ) : (
              <Box>
                {/* <InputGroup width="300px">
                  <Input
                  type={'text'}
                  placeholder="URL"
                  onChange={(e) => setPassword(e.target.value)}
                />
                  <InputRightElement>
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    onClick={togglePasswordVisibility}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  />
                </InputRightElement>
                </InputGroup> */}
                {/* <Button colorScheme="teal" mt={2} onClick={handleLogin}>
                Login
              </Button> */}
                {/* <Button colorScheme="teal" mt={2} onClick={handleDownload12}>
                Download 2
              </Button> */}
                <Button isDisabled={isDownloading} mt={2} onClick={handleDownload}>
                  {isDownloading ? "Loading..." : "use of puppeteer"}
                </Button>

                <Button isDisabled={isDownloading1} mt={2} onClick={onDownloadPdf}>
                  {isDownloading1 ? "Loading..." : "Use of aws-lambda"}
                </Button>
                <Text mt={2} fontSize="sm" color={isError ? "red" : "green"}>
                  {message}
                </Text>
              </Box>
            )}
          </div>
        )}
      </ChakraProvider>
      <SampleComponent htmlContent={htmlContent} />
    </>
  );
}