import {
  Box,
  Button,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { signOut, useSession } from "next-auth/react";

import { MdLogout } from "react-icons/md";
import logo from "../assets/logo.png";

function Header() {
  const { data, status } = useSession();
  const isLogged = status === "authenticated";
  return (
    <Box maxW="full" h="50px" bg="blue.400" boxShadow="lg" paddingX="10%">
      <HStack h="100%" alignItems="center" justifyContent="space-between">
        <LinkBox>
          <LinkOverlay href="/">
            <HStack>
              <Box width="40px" justifyContent="center">
                <Image src={logo.src} alt="logo" />
              </Box>
              <Text fontSize="2xl" color="white" fontWeight="bold">
                Kambann
              </Text>
            </HStack>
          </LinkOverlay>
        </LinkBox>
        {isLogged && (
          <HStack>
            <Text color="white" fontWeight="bold" marginRight="20px">
              Hi, {data?.user?.name}
            </Text>
            <Button
              color="white"
              variant="unstyled"
              leftIcon={<MdLogout />}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </HStack>
        )}
      </HStack>
    </Box>
  );
}

export default Header;
