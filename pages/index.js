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
import axiosInstance from "./axiosInstance";
import Custom403 from "./403";

export default function Home() {
  const router = useRouter();
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

  useEffect(() => {
    checkBlockedStatus();
  }, []);

  return (
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
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100vh"
            >
              <InputGroup width="300px">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
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
              </InputGroup>
              <Button colorScheme="teal" mt={2} onClick={handleLogin}>
                Login
              </Button>
              <Text mt={2} fontSize="sm" color={isError ? "red" : "green"}>
                {message}
              </Text>
            </Box>
          )}
        </div>
      )}
    </ChakraProvider>
  );
}
