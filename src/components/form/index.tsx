import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Text,
  VStack,
  Stack,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

type FaleMais = {
  origem: String;
  destino: String;
  duracao: Number;
  plano: String;
};

export const Form = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function handleFetch({ origem, destino, duracao, plano }: FaleMais) {
    await fetch("/tarifa", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ origem, destino, duracao, plano }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }

  return (
    <VStack>
      <Heading color={"#3182ce"}>FaleMais</Heading>

      <Stack
        w="100%"
        border={"1px"}
        borderColor={"gray.200"}
        borderRadius={"lg"}
        p={5}
      >
        <form onSubmit={handleSubmit(handleFetch)}>
          <FormControl>
            <FormLabel htmlFor="origem">Origem</FormLabel>
            <Select
              id="origem"
              placeholder="Selecione o DDD de origem"
              {...register("origem", { required: true })}
            >
              <option value={"011"}>011</option>
              <option value={"016"}>016</option>
              <option value={"017"}>017</option>
              <option value={"018"}>018</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="destino">Destino</FormLabel>
            <Select
              id="destino"
              placeholder="Selecione o DDD de destino"
              {...register("destino", { required: true })}
            >
              <option value={"011"}>011</option>
              <option value={"016"}>016</option>
              <option value={"017"}>017</option>
              <option value={"018"}>018</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="duracao">Duração</FormLabel>

            <Input
              id="duracao"
              variant="outline"
              placeholder="Informe a duração da chamada"
              {...register("duracao", {
                required: true,
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Somente números",
                },
              })}
            />
          </FormControl>

          <Box w={"100%"}></Box>

          <HStack justify={"space-around"} w={"100%"}>
            <VStack>
              <Text fontWeight="bold" fontSize={"lg"}>
                Com FaleMais
              </Text>

              <Box>
                <Text fontSize={"lg"}>0</Text>
              </Box>
            </VStack>

            <VStack>
              <Text fontWeight="bold" fontSize={"lg"}>
                Sem FaleMais
              </Text>

              <Box>
                <Text fontSize={"lg"}>0</Text>
              </Box>
            </VStack>
          </HStack>

          <Button
            bgColor={"#3182ce"}
            color={"#FFF"}
            _hover={{ opacity: "0.6" }}
          >
            Calcular ligação
          </Button>
        </form>
      </Stack>
    </VStack>
  );
};
