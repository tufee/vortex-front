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
import { useForm, SubmitHandler } from "react-hook-form";

type Chamada = {
  origem: String;
  destino: String;
  duracao: Number;
  plano: String;
};

type Response = {
  custoComPlano: Number;
  custoSemPlano: Number;
};

export const Form = () => {
  const { handleSubmit, register } = useForm<Chamada>();

  const handleFetch = async ({ origem, destino, duracao, plano }: Chamada) => {
    return fetch(
      `/tarifa?origem=${origem}&destino=${destino}&duracao=${duracao}&plano=${plano}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
            type={"submit"}
          >
            Calcular ligação
          </Button>
        </form>
      </Stack>
    </VStack>
  );
};
