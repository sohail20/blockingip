// pages/403.js

import { Box, Text } from "@chakra-ui/react";

const Custom403 = () => {
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        403 - Access Denied
      </Text>
      <Text fontSize="lg">
        Sorry, you don't have permission to access this page.
      </Text>
    </Box>
  );
};

export default Custom403;
