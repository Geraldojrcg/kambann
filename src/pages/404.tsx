import React from "react";
import {} from "next/error";
import { Center, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

function NotFound() {
  return (
    <VStack p="10%" alignItems="center">
      <Center>
        <Text fontSize="xl" fontWeight="bold">
          Resource not found!
        </Text>
      </Center>
      <Link href="/">Back</Link>
    </VStack>
  );
}

export default NotFound;
