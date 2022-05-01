import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  origem?: String;
  destino?: String;
  duracao?: String;
  plano?: String;
};

type CallCost = {
  custoComPlano?: Number;
  custoSemPlano?: Number;
};

type Response = {
  Ok: CallCost;
};

export const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const [selectedOrigemDDD, setSelectedOrigemDDD] = useState<String>();
  const [DDD, setDDD] = useState<boolean>();
  const [requestedCallValue, setRequestedCallValue] = useState<Response>({
    Ok: { custoComPlano: 0, custoSemPlano: 0 },
  });
  const [callCost, setCallCost] = useState<Response>();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const selected = event.target.options[event.target.selectedIndex].value;

    selected === '011' ? setDDD(true) : setDDD(false);
    setSelectedOrigemDDD(selected);
  }

  useEffect(() => {
    setCallCost(requestedCallValue);
  }, [requestedCallValue]);

  async function handleFetch({ origem, destino, duracao, plano }: FormData): Promise<Response> {
    const response = await fetch(
      `http://localhost:3333/tarifa?origem=${origem}&destino=${destino}&duracao=${duracao}&plano=${plano}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.error(err);
      });

    setRequestedCallValue(response);

    return response;
  }

  return (
    <VStack maxW="1280px" w="100%" h="100vh" justifyContent="center">
      <Heading color="#3182ce">FaleMais</Heading>

      <Stack w="100%" border={'1px'} borderColor="gray" borderRadius="lg" p={5}>
        <form onSubmit={handleSubmit(handleFetch)}>
          <FormControl>
            <FormLabel htmlFor="origem">Origem</FormLabel>
            <Select
              id="origem"
              placeholder="Selecione o DDD de origem"
              {...register('origem', { required: 'Selecione o DDD de origem' })}
              onChange={handleChange}
            >
              <option value={'011'}>011</option>
              <option value={'016'}>016</option>
              <option value={'017'}>017</option>
              <option value={'018'}>018</option>
            </Select>

            {errors.origem && <Text color="red">{errors.origem.message}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="destino">Destino</FormLabel>
            <Select
              id="destino"
              placeholder="Selecione o DDD de destino"
              {...register('destino', { required: 'Selecione o DDD de destino' })}
            >
              {selectedOrigemDDD && DDD ? (
                <>
                  <option value={'016'}>016</option>
                  <option value={'017'}>017</option>
                  <option value={'018'}>018</option>
                </>
              ) : (
                <option value={'011'}>011</option>
              )}
            </Select>

            {errors.destino && <Text color="red">{errors.destino.message}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="duracao">Duração</FormLabel>

            <Input
              id="duracao"
              variant="outline"
              placeholder="Informe a duração da chamada"
              {...register('duracao', {
                required: 'Informe os minutos de duração da chamada',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Somente números',
                },
              })}
            />
            {errors.duracao && <Text color="red">{errors.duracao.message}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="plano">Plano</FormLabel>
            <Select
              id="plano"
              placeholder="Selecione o plano"
              {...register('plano', { required: 'Selecione o plano' })}
            >
              <option value={'FaleMais 30'}>FaleMais 30</option>
              <option value={'FaleMais 60'}>FaleMais 60</option>
              <option value={'FaleMais 120'}>FaleMais 120</option>
            </Select>

            {errors.plano && <Text color="red">{errors.plano.message}</Text>}
          </FormControl>

          <Box>
            <HStack justify={'space-around'} w={'100%'} mt={5} mb={5}>
              <VStack>
                <Text fontWeight="bold" fontSize={'lg'}>
                  Com FaleMais
                </Text>

                <Box>
                  <Text fontSize="lg">{`$ ${
                    callCost?.Ok && callCost.Ok.custoComPlano?.toFixed(2)
                  }`}</Text>
                </Box>
              </VStack>

              <VStack>
                <Text fontWeight="bold" fontSize="lg">
                  Sem FaleMais
                </Text>

                <Box>
                  <Text fontSize="lg">{`$ ${
                    callCost?.Ok && callCost.Ok.custoSemPlano?.toFixed(2)
                  }`}</Text>
                </Box>
              </VStack>
            </HStack>
          </Box>

          <Center>
            <Button bgColor="#3182ce" color="#FFF" _hover={{ opacity: '0.6' }} type="submit">
              Calcular chamada
            </Button>
          </Center>
        </form>
      </Stack>
    </VStack>
  );
};
