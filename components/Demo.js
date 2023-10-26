import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Message from './Message';

const Demo = () => {
  const [isBlocked, setIsBlocked] = useState(null);

  useEffect(() => {
    const checkBlockedStatus = async () => {
      try {
        const response = await fetch('/api/isBlocked');
        if (response.ok) {
          const data = await response.json();
          setIsBlocked(data.blocked);
        } else {
          setIsBlocked(true);
        }
      } catch (error) {
        setIsBlocked(true);
      }
    };

    checkBlockedStatus();
  }, []);

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Welcome to the Demo Content Page
      </Text>
      <Text>
        This is a demo page created with Chakra UI and Next.js. You can customize and
        add content here to showcase your application's features.
      </Text>
    </Box>
  );
};
{/* <div>
      {isBlocked === true ? (
        <Message message="403" isError={true} />
      ) : isBlocked === false ? (
        <Message message="Your IP is not blocked" isError={false} />
      ) : (
        <Message message="Checking IP status..." isError={false} />
      )}
    </div> */}
export default Demo;
