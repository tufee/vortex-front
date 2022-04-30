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
import {
  ChangeEvent,
  ChangeEventHandler,
  OptionHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormData = {
  origem?: String;
  destino?: String;
  duracao?: String;
  plano?: String;
};

type Cost = {
  custoComPlano?: Number;
  custoSemPlano?: Number;
};

type Response = {
  Ok: Cost;
};

export const Form = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [callValue, setCallValue] = useState<Response>();
  const [cost, setCost] = useState<Response>();

  const [selected, setSelected] = useState<String>();
  const [DDD, setDDD] = useState<boolean>();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const selected = event.target.options[event.target.selectedIndex].value;

    console.log(selected);

    selected === "011" ? setDDD(true) : setDDD(false);
    setSelected(selected);
  }

  useEffect(() => {
    setCost(callValue);
  }, [callValue]);

  async function handleFetch({
    origem,
    destino,
    duracao,
    plano,
  }: FormData): Promise<Response> {
    const response = await fetch(
      `http://localhost:3333/tarifa?origem=${origem}&destino=${destino}&duracao=${duracao}&plano=${plano}`,
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

    setCallValue(response);

    return response;
  }

  return (
    <VStack>
      <Heading color={"#3182ce"}>FaleMais</Heading>

      <Stack
        w="100%"
        border={"1px"}
        borderColor={"gray"}
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
              onChange={handleChange}
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
              {selected && DDD ? (
                <>
                  <option value={"016"}>016</option>
                  <option value={"017"}>017</option>
                  <option value={"018"}>018</option>
                </>
              ) : (
                <option value={"011"}>011</option>
              )}
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
            {errors.duracao && <Text color="red">{errors.duracao.errors}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="plano">Plano</FormLabel>
            <Select
              id="plano"
              placeholder="Selecione o plano"
              {...register("plano", { required: true })}
            >
              <option value={"FaleMais 30"}>FaleMais 30</option>
              <option value={"FaleMais 60"}>FaleMais 60</option>
              <option value={"FaleMais 120"}>FaleMais 120</option>
            </Select>
          </FormControl>

          <Box w={"100%"}></Box>

          <HStack justify={"space-around"} w={"100%"}>
            <VStack>
              <Text fontWeight="bold" fontSize={"lg"}>
                Com FaleMais
              </Text>

              <Box>
                <Text fontSize={"lg"}>{cost?.Ok && cost.Ok.custoComPlano}</Text>
              </Box>
            </VStack>

            <VStack>
              <Text fontWeight="bold" fontSize={"lg"}>
                Sem FaleMais
              </Text>

              <Box>
                <Text fontSize={"lg"}>{cost?.Ok && cost.Ok.custoSemPlano}</Text>
              </Box>
            </VStack>
          </HStack>

          <Button
            bgColor={"#3182ce"}
            color={"#FFF"}
            _hover={{ opacity: "0.6" }}
            type={"submit"}
          >
            Calcular chamada
          </Button>
        </form>
      </Stack>
    </VStack>
  );
};
