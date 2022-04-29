import { ChakraProvider, Container, theme } from "@chakra-ui/react";
import { Form } from "./components/form";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Container>
        <Form />
      </Container>
    </ChakraProvider>
  );
};
