import {
  Flex,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Button,
  SimpleGrid,
  Text,
  Box,
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
} from "@chakra-ui/react";
import { useState } from "react";

export interface Results {
  wins: number;
  losses: number;
  ties: number;
  totalBets: number;
  totalReturn: number;
  numberOfPlaythroughs?: number;
}

export const DEFAULT_RESULTS: Results = {
  wins: 0,
  losses: 0,
  ties: 0,
  totalBets: 0,
  totalReturn: 0,
  numberOfPlaythroughs: 0,
};

export default function Main({
  numberOfPlaythroughs,
  setNumberOfPlaythroughs,
  play,
  finalResult,
  setFinalResult,
  loading,
  setLoading,
}: {
  numberOfPlaythroughs: number;
  setNumberOfPlaythroughs: (val: number) => void;
  play: (finalResult: any) => void;
  finalResult: any;
  setFinalResult: (val: any) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}) {
  return (
    <Flex
      w="full"
      h="full"
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <VStack
        margin={"auto"}
        spacing={2}
        alignItems="center"
        p={2}
        justifyContent={"center"}
        h="full"
      >
        <Text>Number of simulation runs:</Text>
        <NumberInput
          min={1}
          max={1000000}
          value={numberOfPlaythroughs}
          onChange={(valueString) =>
            setNumberOfPlaythroughs(parseInt(valueString))
          }
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <HStack>
          <Button
            isLoading={loading}
            onClick={() => {
              setLoading(true);
              play(finalResult);
            }}
            colorScheme={"blue"}
          >
            Simulate
          </Button>
          <Button
            isDisabled={loading}
            onClick={() => setFinalResult({ ...DEFAULT_RESULTS })}
            colorScheme={"blue"}
          >
            Reset Results
          </Button>
        </HStack>

        <ResultsDisplay results={finalResult} />
      </VStack>
    </Flex>
  );
}

const toPercent = (val: number) => {
  return `${(val * 100).toFixed(2)}%`;
};

const formatMoney = (val: number) => {
  if (val < 0) {
    return (
      "- $" +
      Math.abs(val).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  } else {
    return (
      "$" +
      val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
};

const ResultsDisplay = ({ results }: { results: Results | null }) => {
  const [timePerGame, setTimePerGame] = useState<number>(300);

  if (!results.totalBets) {
    return null;
  }

  const totalPlays = results.wins + results.losses + results.ties;

  const netRoi = results.totalReturn / results.totalBets;

  return (
    <SimpleGrid columns={2} columnGap={8}>
      <Text>Total Plays</Text>
      {Math.round(totalPlays)}
      <Text>Winrate:</Text>
      {toPercent(results.wins / totalPlays)}
      <Text>Lossrate:</Text> {toPercent(results.losses / totalPlays)}
      <Text>Pushrate:</Text> {toPercent(results.ties / totalPlays)}
      <Text>Net winrate (ignore pushes):</Text>
      {toPercent(results.wins / (results.wins + results.losses))}
      <Text>Average wager per shoe:</Text>
      {formatMoney(results.totalBets / results.numberOfPlaythroughs)}
      <Text>Average return per shoe:</Text>
      <Text color={results.totalReturn > 0 ? "green.500" : "red.500"}>
        {formatMoney(results.totalReturn / results.numberOfPlaythroughs)}
      </Text>
      <Text>Net roi:</Text>
      <Text color={netRoi > 0 ? "green.500" : "red.500"}>
        {toPercent(netRoi)}
      </Text>
      <Text>Average profit per game:</Text>
      <Text color={results.totalReturn > 0 ? "green.500" : "red.500"}>
        {formatMoney(results.totalReturn / totalPlays)}
      </Text>
      <Box>
        Income at average game duration:
        <Slider
          aria-label="time-per-game-slide"
          min={1}
          max={600}
          value={timePerGame}
          onChange={(val) => setTimePerGame(val)}
        >
          <SliderMark
            value={timePerGame}
            textAlign="center"
            bg="blue.500"
            color="white"
            mt="1"
            ml="-25px"
            w="50px"
          >
            {(Math.floor(timePerGame / 60) > 0
              ? `${Math.floor(timePerGame / 60)}m`
              : "") + (timePerGame % 60 > 0 ? `${timePerGame % 60}s` : "")}
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <Text color={results.totalReturn > 0 ? "green.500" : "red.500"}>
        {formatMoney((results.totalReturn / totalPlays) * (3600 / timePerGame))}
        /hr
      </Text>
    </SimpleGrid>
  );
};
