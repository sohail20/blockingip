import { useEffect, useRef } from 'react';
import { Box, Heading, Text, Button, Image, Flex, Stack, Link } from '@chakra-ui/react';
import jsPDF from 'jspdf';

const PlaceholderImage = ({ src, alt }) => {
    return (
        <Box boxShadow="md" borderRadius="md" overflow="hidden">
            <Image src={src} alt={alt} />
        </Box>
    );
};

const ConvertToPDFPage = () => {
    const contentRef = useRef(null);

    const downloadPDF = () => {
        if (contentRef.current) {
            const content = contentRef.current;
            var pdf = new jsPDF('p', 'pt', [1350, 2500], true);
            pdf.addImage("https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png", 'PNG', 0, 0, 485, 270, undefined, 'FAST');

            // Add the content to the PDF
            pdf.html(content, {
                enableLinks: true, // Enable hyperlinks
                // html2canvas: { dpi: 800, letterRendering: true, width: 780, height: 1920},
                callback: (pdf) => {
                    //Enable text selection in the PDF
                    // pdf.internal.events.subscribe('addPage', (data) => {
                    //     pdf.internal.getPageInfo(data.pageNumber).pageContext.textRenderingMode = pdf.TextRenderingMode.FILL;
                    // });

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
                {/* Your webpage content goes here */}
                <Box p="4">
                    <a href="https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png" data-uri="https://static.the.akdn/53832/1642351531-akf_7_dilangez_asanalishoeva_sewing.jpg?h=280&w=560&auto=format&fm=png">Click me</a>
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
        </div>
    );
};

export default ConvertToPDFPage;
