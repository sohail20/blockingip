// Home.js
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


export async function getStaticProps() {
  try {

    const clientIp = await getClientIp();
    console.log("clientIpgetStaticProps", clientIp)
    const response = await fetch('http://localhost:3000/api/isBlocked', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientIp
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        props: { data },
      };
    } else {
      return {
        props: { error: 'Failed to fetch data from the external API' },
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      props: { error: 'Server error' },
    };
  }
}

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
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const checkBlockedStatus = async () => {
      try {
        const clientIp = await getClientIp();
        const response = await axiosInstance.post('/isBlocked', { clientIp })
        if (response.status === 200) {
          console.log("data.blocked", response.data.blocked)
          setIsBlocked(response.data.blocked);
          setIsLoading(false);
        } else {
          router.push('/403', undefined, { shallow: true });
        }
      } catch (error) {
        if (error && error.response && error.response.data && error.response.data.blocked) {
          setIsBlocked(error.response.data.blocked);
        }
        setIsLoading(false);
      }
    };

    checkBlockedStatus();
  }, []);

  const handleLogin = async () => {
    const clientIp = await getClientIp()
    const response = await axiosInstance.post('/login', { clientIp, password })

    // const response = await fetch("/api/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ clientIp, password }),
    // });

    // const data = await response.json();

    setMessage(response.data.message);
    if (response.data.status) {
      setIsAuthorized(true);
      setIsError(false);
    } else {
      if (response.data.message.includes("attempt")) setIsError(true);
      else {
        router.push('/403', undefined, { shallow: true });
      }
    }
  };

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
            <>
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
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }}
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
            </>
          )}
        </div>
      )}
    </ChakraProvider>
  );
}
