"use client";

import {
  Box,
  Button,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";

import React, { useState } from "react";

const DECK_OF_CARDS: number[] = [
  1, //Ace

  2,

  3,

  4,

  5,

  6,

  7,

  8,

  9,

  10,

  10, //Jack

  10, //Queen

  10, //King

  1, //Ace

  2,

  3,

  4,

  5,

  6,

  7,

  8,

  9,

  10,

  10, //Jack

  10, //Queen

  10, //King

  1, //Ace

  2,

  3,

  4,

  5,

  6,

  7,

  8,

  9,

  10,

  10, //Jack

  10, //Queen

  10, //King

  1, //Ace

  2,

  3,

  4,

  5,

  6,

  7,

  8,

  9,

  10,

  10, //Jack

  10, //Queen

  10, //King
];

// const DEFAULT_COUNT_VALUES = {

//   2: -0.4,

//   3: -0.43,

//   4: -0.52,

//   5: -0.67,

//   6: -0.45,

//   7: -0.3,

//   8: -0.01,

//   9: 0.15,

//   10: 0.51,

//   1: 0.59,

// };

const DEFAULT_COUNT_VALUES = {
  1: -1,

  2: 1,

  3: 1,

  4: 1,

  5: 1,

  6: 1,

  7: 0,

  8: 0,

  9: 0,

  10: -1,
};

// Dealer showing [2, 3, 4, 5, 6, 7, 8, 9, 10, A]

// 1 = split, 2 = don't split

const DEFAULT_SPLITTING_STRATEGY = {
  2: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],

  3: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],

  4: [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],

  5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  6: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],

  7: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],

  8: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  9: [1, 1, 1, 1, 1, 0, 1, 1, 0, 0],

  10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  1: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};

// Soft total: dealer showing [2, 3, 4, 5, 6, 7, 8, 9, 10, A]

// 0 = stand, 1 = hit, 2 = double if allowed, otherwise hit, 3 = double if allowed, otherwise stay

const DEFAULT_SOFT_HAND_STRATEGY = {
  13: [1, 1, 1, 2, 2, 1, 1, 1, 1, 1],

  14: [1, 1, 1, 2, 2, 1, 1, 1, 1, 1],

  15: [1, 1, 2, 2, 2, 1, 1, 1, 1, 1],

  16: [1, 1, 2, 2, 2, 1, 1, 1, 1, 1],

  17: [1, 2, 2, 2, 2, 1, 1, 1, 1, 1],

  18: [3, 3, 3, 3, 3, 0, 0, 1, 1, 1],

  19: [0, 0, 0, 0, 3, 0, 0, 0, 0, 0],

  20: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  21: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

// Hard total: dealer showing [2, 3, 4, 5, 6, 7, 8, 9, 10]

// 0 = stand, 1 = hit, 2 = double if allowed, otherwise hit

const DEFAULT_HARD_HAND_STRATEGY = {
  3: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  5: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  6: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  7: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  8: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  9: [1, 2, 2, 2, 2, 1, 1, 1, 1, 1],

  10: [2, 2, 2, 2, 2, 2, 2, 2, 1, 1],

  11: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],

  12: [1, 1, 0, 0, 0, 1, 1, 1, 1, 1],

  13: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],

  14: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],

  15: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],

  16: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],

  17: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  18: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  19: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  20: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  21: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const generateShoe = (numberOfDecks: number) => {
  const shoe = Array.from(
    { length: numberOfDecks },
    () => DECK_OF_CARDS
  ).flat();

  // Shuffle the deck

  for (let i = shoe.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);

    [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
  }

  return shoe;
};

const getSoftHandValue = (hand: number[]): number => {
  let softHandValue = hand.reduce((acc, card) => acc + card, 0);

  if (hand.includes(1) && softHandValue <= 11) {
    softHandValue += 10;
  }

  return softHandValue;
};

interface Results {
  wins: number;

  losses: number;

  ties: number;

  totalBets: number;

  totalReturn: number;
}

export default function Page(): JSX.Element {
  const [finalResult, setFinalResult] = useState<Results | null>(null);

  const [numberOfDecks, setNumberOfDecks] = useState(6);

  const [numberOfPlaythroughs, setNumberOfPlaythroughs] = useState(1);

  const [minBet, setMinBet] = useState(1);

  const [maxBet, setMaxBet] = useState(10);

  const [numberOfOtherPlayers, setNumberOfOtherPlayers] = useState(0);

  const [dealerHitsSoft17, setDealerHitsSoft17] = useState(true);

  const [flatBet, setFlatBet] = useState(false);

  const [blackjackPayout, setBlackjackPayout] = useState(1.5);

  const [countValues, setCountValues] = useState(DEFAULT_COUNT_VALUES);

  const [splittingStrategy, setSplittingStrategy] = useState(
    DEFAULT_SPLITTING_STRATEGY
  );

  const [softHandStrategy, setSoftHandStrategy] = useState(
    DEFAULT_SOFT_HAND_STRATEGY
  );

  const [hardHandStrategy, setHardHandStrategy] = useState(
    DEFAULT_HARD_HAND_STRATEGY
  );

  const absAvgWeight =
    (Object.values(countValues).reduce((acc, val) => acc + Math.abs(val), 0) +
      Math.abs(countValues[10] * 3)) /
    13;

  const getBet = (count: number): number => {
    if (flatBet) {
      return minBet;
    }

    if (count / numberOfDecks > absAvgWeight) {
      return maxBet;
    } else {
      return minBet;
    }
  };

  const playShoe = (log: any): Results => {
    const results = {
      wins: 0,

      losses: 0,

      ties: 0,

      totalBets: 0, // count how much the player has wagered in total

      totalReturn: 0, // count how much the player has won/lost in total
    };

    let count = 0;

    let shoe = generateShoe(numberOfDecks);

    let shoeEmpty = false;

    const drawCard = (): number => {
      if (shoe.length > 0) {
        const card = shoe.pop() as number;

        //@ts-ignore

        count += countValues[card];

        return card;
      } else {
        count = 0;

        shoeEmpty = true;

        shoe = generateShoe(1);

        return shoe.pop() as number;
      }
    };

    const formatCardName = (card: number): string => {
      if (card === 1) {
        return "A";
      }

      return card.toString();
    };

    const formatHand = (hand: number[]): string => {
      return hand.map(formatCardName).join(", ");
    };

    const playHand = () => {
      log("////// NEW HAND //////");

      // TODO - bet based on count

      const initialBet = getBet(count);

      const playerHand = [drawCard(), drawCard()];

      const dealerHand = [drawCard(), drawCard()]; // Dealer's second card is hidden

      log("Bet:", initialBet);

      log("Dealer showing:", formatCardName(dealerHand[0]));

      // Check for dealer blackjack first

      if (dealerHand.length === 2 && getSoftHandValue(dealerHand) === 21) {
        log("Dealer has blackjack");

        if (playerHand.length === 2 && getSoftHandValue(playerHand) === 21) {
          log("Player has blackjack");

          log("PUSH");

          // Player also has blackjack, push

          results.ties += 1;

          results.totalBets += initialBet;

          return;
        } else {
          log("LOSS");

          // Dealer has blackjack, player loses

          results.losses += 1;

          results.totalBets += initialBet;

          results.totalReturn -= initialBet;

          return;
        }
      }

      // given hand, return final hand values as array

      // return array of [handValue, bet] (multiple if user split)

      const doStrategy = (
        hand: number[],
        bet: number,
        isNatural: boolean = true
      ): number[][] => {
        log("Player hand:", formatHand(hand));

        const dealerCard = dealerHand[0];

        // Check if player busts (after just hitting)

        if (hand.length > 2 && getSoftHandValue(hand) > 21) {
          log("Player busts");

          log("LOSS");

          results.losses += 1;

          results.totalBets += bet;

          results.totalReturn -= bet;

          return []; // no need to compare hands
        }

        // Check for blackjack

        if (hand.length === 2 && getSoftHandValue(hand) === 21 && isNatural) {
          log("Player has blackjack");

          log("BLACKJACK!");

          // Blackjack, instant win

          results.wins += 1;

          results.totalBets += bet;

          results.totalReturn += bet * blackjackPayout;

          return []; // no need to compare hands
        }

        if (hand[0] === hand[1] && hand.length === 2) {
          log("Player can split");

          // Check if player should split

          //@ts-ignore

          if (splittingStrategy[hand[0]][dealerCard - 1 ? dealerCard - 1 : 9]) {
            log("Player split");

            // Split

            return [
              ...doStrategy([hand[0], drawCard()], bet, false), //Flag as unnatural blackjack

              ...doStrategy([hand[1], drawCard()], bet, false), //Flag as unnatural blackjack
            ];
          } else {
            log("Player didn't split");
          }
        }

        // 0 = stand, 1 = hit, 2 = double if allowed, otherwise hit, 3 = double if allowed, otherwise stay

        let strategy = 0;

        let handValue = hand.reduce((acc, card) => acc + card, 0);

        if (hand.includes(1) && handValue <= 11) {
          // Soft hand

          handValue += 10;

          log("Soft hand value:", handValue);

          //@ts-ignore

          strategy =
            softHandStrategy[handValue][dealerCard - 1 ? dealerCard - 1 : 9];
        } else {
          // Hard hand

          log("Hard hand value:", handValue);

          //@ts-ignore

          strategy =
            hardHandStrategy[handValue][dealerCard - 1 ? dealerCard - 1 : 9];
        }

        if ((strategy === 2 || strategy === 3) && hand.length < 3) {
          log("Player doubles down");

          // Double down

          return doStrategy([...hand, drawCard()], bet * 2);
        } else if (strategy === 1 || strategy === 2) {
          log("Player hits");

          // Hit

          return doStrategy([...hand, drawCard()], bet);
        } else {
          log("Player stands");

          // Stand

          return [[handValue, bet]];
        }
      };

      const handValues = doStrategy(playerHand, initialBet);

      // If player got blackjack, end here.

      if (handValues.length === 0) {
        return;
      }

      let dealerHandValue = getSoftHandValue(dealerHand);

      while (
        dealerHandValue < (dealerHand.includes(1) && dealerHitsSoft17 ? 18 : 17)
      ) {
        log("Dealer hits");

        dealerHand.push(drawCard());

        dealerHandValue = getSoftHandValue(dealerHand);
      }

      if (dealerHandValue > 21) {
        log("Dealer busts");

        log("WIN");

        results.wins += handValues.length;

        results.totalBets += handValues.reduce((acc, [_, bet]) => acc + bet, 0);

        results.totalReturn += handValues.reduce(
          (acc, [_, bet]) => acc + bet,
          0
        );

        return;
      } else {
        handValues.forEach(([handValue, bet]) => {
          results.totalBets += bet;

          if (handValue > dealerHandValue) {
            log("WIN");

            results.wins += 1;

            results.totalReturn += bet;
          } else if (handValue === dealerHandValue) {
            log("PUSH");

            results.ties += 1;
          } else {
            log("LOSS");

            results.losses += 1;

            results.totalReturn -= bet;
          }
        });
      }
    };

    while (!shoeEmpty) {
      playHand();
    }

    return results;
  };

  const play = () => {
    const results: Results = {
      wins: 0,

      losses: 0,

      ties: 0,

      totalBets: 0,

      totalReturn: 0,
    };

    let log = console.log;

    if (numberOfPlaythroughs > 10) {
      log = () => null;
    }

    setFinalResult(null);

    for (let i = 0; i < numberOfPlaythroughs; i++) {
      const playThroughResults = playShoe(log);

      results.wins += playThroughResults.wins;

      results.losses += playThroughResults.losses;

      results.ties += playThroughResults.ties;

      results.totalBets += playThroughResults.totalBets;

      results.totalReturn += playThroughResults.totalReturn;
    }

    console.log("DONE!");

    setFinalResult(results);
  };

  return (
    <>
      <VStack>
        <Box w={"250px"}>
          <Text>Number of decks in shoe:</Text>

          <NumberInput
            min={0}
            max={12}
            value={numberOfDecks}
            onChange={(valueString) => setNumberOfDecks(parseInt(valueString))}
          >
            <NumberInputField />

            <NumberInputStepper>
              <NumberIncrementStepper />

              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>

        <Box w={"250px"}>
          <Text>Minbet:</Text>

          <NumberInput
            min={0}
            max={10}
            value={minBet}
            onChange={(valueString) => setMinBet(parseInt(valueString))}
          >
            <NumberInputField />

            <NumberInputStepper>
              <NumberIncrementStepper />

              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>

        <Box w={"250px"}>
          <Text>Maxbet:</Text>

          <NumberInput
            min={1}
            max={10}
            value={maxBet}
            onChange={(valueString) => setMaxBet(parseInt(valueString))}
          >
            <NumberInputField />

            <NumberInputStepper>
              <NumberIncrementStepper />

              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>

        <Box w={"250px"}>
          <Text>Number of other players at table:</Text>

          <NumberInput
            min={0}
            max={7}
            value={numberOfOtherPlayers}
            onChange={(valueString) =>
              setNumberOfOtherPlayers(parseInt(valueString))
            }
          >
            <NumberInputField />

            <NumberInputStepper>
              <NumberIncrementStepper />

              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>

        <Box w={"250px"}>
          <Text>Number of shoes to play through:</Text>

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
        </Box>

        <HStack w={"250px"}>
          <Text>Dealer hits soft 17:</Text>

          <Switch
            isChecked={dealerHitsSoft17}
            onChange={(e) => setDealerHitsSoft17(e.target.checked)}
          />
        </HStack>

        <HStack w={"250px"}>
          <Text>Flat bet:</Text>

          <Switch
            isChecked={flatBet}
            onChange={(e) => setFlatBet(e.target.checked)}
          />
        </HStack>

        <HStack w={"250px"}>
          <Text>Blackjack pays:</Text>

          <Select
            w="max-content"
            value={blackjackPayout.toString()}
            onChange={(e) => setBlackjackPayout(parseFloat(e.target.value))}
          >
            <option value={"1"}>1:1</option>

            <option value={"1.2"}>6:5</option>

            <option value={"1.5"}>3:2</option>

            <option value={"2"}>2:1</option>
          </Select>
        </HStack>

        <Button onClick={play}>Play</Button>

        <ResultsDisplay results={finalResult} />
      </VStack>
    </>
  );
}

const toPercent = (val: number) => {
  return `${(val * 100).toFixed(2)}%`;
};

const ResultsDisplay = ({ results }: { results: Results | null }) => {
  if (!results) {
    return null;
  }

  const totalPlays = results.wins + results.losses + results.ties;

  return (
    <SimpleGrid columns={2} columnGap={8}>
      <Text>Total Plays</Text>
      {totalPlays}
      <Text>Winrate:</Text>
      {toPercent(results.wins / totalPlays)}
      <Text>Lossrate:</Text> {toPercent(results.losses / totalPlays)}
      <Text>Pushrate:</Text> {toPercent(results.ties / totalPlays)}
      <Text>Net Winrate (ignore pushes):</Text>
      {toPercent(results.wins / (results.wins + results.losses))}
      <Text>Total wager:</Text>
      {results.totalBets}
      <Text>Total return:</Text>
      {results.totalReturn}
      <Text>Net roi:</Text>
      {toPercent(results.totalReturn / results.totalBets)}
    </SimpleGrid>
  );
};
