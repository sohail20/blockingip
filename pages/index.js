// Home.js
import React, { useEffect, useState } from "react";
// 1. import `ChakraProvider` component
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
import Message from "@/components/Message";
import Demo from "@/components/Demo";
import Custom403 from "./403";

export default function Home() {
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
        const response = await fetch("/api/isBlocked");
        if (response.ok) {
          const data = await response.json();
          setIsBlocked(data.blocked);
          setIsLoading(false);
        } else {
          setIsBlocked(true);
          setIsLoading(false);
        }
      } catch (error) {
        setIsBlocked(true);
        setIsLoading(false);
      }
    };
    const user = localStorage.getItem("user");
    if (user === null || user === "") {
      const min = 100;
      const max = 999;
      const random3DigitNumber =
        Math.floor(Math.random() * (max - min + 1)) + min;
      localStorage.setItem("user", "user" + random3DigitNumber);
    }

    checkBlockedStatus();
  }, []);

  const handleLogin = async () => {
    const user = localStorage.getItem("user");
    if (user !== null && user !== "") {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: user, password }),
      });

      const data = await response.json();

      setMessage(data.message);
      if (data.status) {
        setIsAuthorized(true);
        setIsError(false);
      } else {
        if (data.message.includes("attempt")) setIsError(true);
        else setIsBlocked(true);
      }
    } else {
      alert("user not found");
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
