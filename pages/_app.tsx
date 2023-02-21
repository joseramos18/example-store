import theme from "@/theme";
import {
  Box,
  ChakraProvider,
  Container,
  Divider,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
        <Container
          backgroundColor="white"
          borderRadius="sm"
          boxShadow="md"
          marginY={4}
          maxWidth="container.xl"
          padding={4}
        >
          <VStack marginBottom={6}>
            <Image borderRadius={9999} src="//placehold.it/128x128"></Image>
            <Heading>Almacency</Heading>
            <Text>El almacén de goncy</Text>
          </VStack>
          <Divider marginY={6}/>
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
}
