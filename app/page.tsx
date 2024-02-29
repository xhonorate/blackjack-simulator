"use client";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Switch,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { e } from "@chakra-ui/toast/dist/toast.types-24f022fd";

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
  12: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
  2: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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

// Surrender: Hard totals - dealer showing [2, 3, 4, 5, 6, 7, 8, 9, 10, A]
// 1 = surrender, 0 = don't surrender
const DEFAULT_SURRENDER_STRATEGY = {
  2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  11: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  12: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  13: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  14: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  15: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  16: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
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

const formatCardName = (card: number): string => {
  if (card === 1) {
    return "A";
  }

  return card.toString();
};

const formatHand = (hand: number[]): string => {
  return hand.map(formatCardName).join(", ");
};

interface Rules {
  dealerHitsSoft17: boolean;
  flatBet: boolean;
  surrenderOption: "early" | "late" | "none";
  doubleAfterSplitting: boolean;
  doubleOn: "any" | "9-11" | "10-11";
  splitTo: 2 | 3 | 4;
  resplitAces: boolean;
  hitSplitAces: boolean;
  blackjackPayout: 1 | 1.2 | 1.5 | 2;
  minBet: number;
  maxBet: number;
  numberOfDecks: number;
  numberOfOtherPlayers: number;
}

const defaultRules: Rules = {
  dealerHitsSoft17: true,
  flatBet: false,
  surrenderOption: "early", // early, late, none
  doubleAfterSplitting: true,
  doubleOn: "any", // any, 9-11, 10-11
  splitTo: 4, // 2, 3, 4
  resplitAces: true,
  hitSplitAces: true,
  blackjackPayout: 1.5,
  minBet: 1,
  maxBet: 10,
  numberOfDecks: 6,
  numberOfOtherPlayers: 0,
};

const estimateHouseEdge = (rules: any) => {
  let houseEdge = -0.2;
  if (rules.blackjackPayout === 1.2) {
    houseEdge += 1.3;
  } else if (rules.blackjackPayout === 1) {
    houseEdge += 2; // estimate
  } else if (rules.blackjackPayout === 2) {
    houseEdge -= 2; // estimate
  }

  if (rules.dealerHitsSoft17) {
    houseEdge += 0.21;
  }

  if (rules.surrenderOption === "late") {
    houseEdge += 0.08;
  } else if (rules.surrenderOption === "none") {
    houseEdge += 0.6;
  }

  if (!rules.doubleAfterSplitting) {
    houseEdge += 0.14;
  }

  if (rules.doubleOn === "9-11") {
    houseEdge += 0.9;
  } else if (rules.doubleOn === "10-11") {
    houseEdge += 1.8;
  }

  if (rules.splitTo === 2) {
    houseEdge += 0.05;
  } else if (rules.splitTo === 3) {
    houseEdge += 0.01;
  }

  if (!rules.resplitAces) {
    houseEdge += 0.07;
  }

  if (!rules.hitSplitAces) {
    houseEdge += 0.18;
  }

  if (rules.flatBet) {
    houseEdge += 0.2;
  }

  houseEdge += 0.64 * (1 - 1 / rules.numberOfDecks); // magic equation, dw bout it

  return houseEdge;
};

interface Results {
  wins: number;
  losses: number;
  ties: number;
  totalBets: number;
  totalReturn: number;
}

const DEFAULT_RESULTS = {
  wins: 0,
  losses: 0,
  ties: 0,
  totalBets: 0,
  totalReturn: 0,
};

export default function Page(): JSX.Element {
  const [finalResult, setFinalResult] = useState({ ...DEFAULT_RESULTS });

  const {
    isOpen: rulesDrawerOpen,
    onOpen: openRulesDrawer,
    onClose: closeRulesDrawer,
  } = useDisclosure();
  const rulesButtonRef = useRef();

  const [rules, updateRules] = useReducer<
    (prev: Rules, val: any) => Rules,
    Rules
  >(
    (prev: Rules, val: any) => {
      return { ...prev, ...val } as Rules;
    },
    defaultRules,
    (val) => val
  );

  const [numberOfPlaythroughs, setNumberOfPlaythroughs] = useState(1);

  const log = numberOfPlaythroughs > 10 ? () => null : console.log;

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

  const [surrenderStrategy, setSurrenderStrategy] = useState(
    DEFAULT_SURRENDER_STRATEGY
  );

  const absAvgWeight = useMemo(
    () =>
      (Object.values(countValues).reduce((acc, val) => acc + Math.abs(val), 0) +
        Math.abs(countValues[10] * 3)) /
      13,
    [countValues]
  );

  const getBet = useCallback(
    (count: number): number => {
      if (rules.flatBet) {
        return rules.minBet;
      }

      if (count / rules.numberOfDecks > absAvgWeight) {
        return rules.maxBet;
      } else {
        return rules.minBet;
      }
    },
    [rules, absAvgWeight]
  );

  const playShoe = useCallback(
    async (): Promise<Results> =>
      new Promise((resolve, reject) => {
        const results = {
          wins: 0,
          losses: 0,
          ties: 0,
          totalBets: 0, // count how much the player has wagered in total
          totalReturn: 0, // count how much the player has won/lost in total
        };

        let count = 0;

        let shoe = generateShoe(rules.numberOfDecks);

        let shoeEmpty = false;

        const drawCard = (): number => {
          if (shoe.length > 0) {
            const card = shoe.pop() as number;
            count += countValues[card];
            return card;
          } else {
            count = 0;
            shoeEmpty = true;
            shoe = generateShoe(1);
            return shoe.pop() as number;
          }
        };

        const playHand = () => {
          log("////// NEW HAND //////");
          const initialBet = getBet(count);
          const playerHand = [drawCard(), drawCard()];
          const dealerHand = [drawCard(), drawCard()]; // Dealer's second card is hidden
          const dealerCardIdx = dealerHand[0] - 1 ? dealerHand[0] - 1 : 9; // shown card --> Ace converted to 9 for strategy lookup
          let splits = 0;

          log("Bet:", initialBet);
          log("Dealer showing:", formatCardName(dealerHand[0]));
          // If player has early surrender option, check for it before blackjack
          if (rules.surrenderOption === "early") {
            if (
              playerHand[0] !== playerHand[1] && // Don't surrender on double 8s // TODO: make this an option
              surrenderStrategy[playerHand[0] + playerHand[1]][
                dealerCardIdx
              ] === 1
            ) {
              log("Player surrenders");
              log("LOSS");
              results.losses += 1;
              results.totalBets += initialBet;
              results.totalReturn -= initialBet / 2;
              return;
            }
          }

          // Check for dealer blackjack first
          if (dealerHand.length === 2 && getSoftHandValue(dealerHand) === 21) {
            log("Dealer has blackjack");
            if (
              playerHand.length === 2 &&
              getSoftHandValue(playerHand) === 21
            ) {
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

          // If player has early surrender option, check for it before blackjack
          if (rules.surrenderOption === "early") {
            if (
              playerHand[0] !== playerHand[1] && // Don't surrender on double 8s // TODO: make this an option
              surrenderStrategy[playerHand[0] + playerHand[1]][
                dealerCardIdx
              ] === 1
            ) {
              log("Player surrenders");
              log("LOSS");
              results.losses += 1;
              results.totalBets += initialBet;
              results.totalReturn -= initialBet / 2;
              return;
            }
          }

          // given hand, return final hand values as array
          // return array of [handValue, bet] (multiple if user split)
          const doStrategy = (hand: number[], bet: number): number[][] => {
            log("Player hand:", formatHand(hand));
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
            if (
              hand.length === 2 &&
              getSoftHandValue(hand) === 21 &&
              splits === 0
            ) {
              log("Player has blackjack");
              log("BLACKJACK!");
              // Blackjack, instant win
              results.wins += 1;
              results.totalBets += bet;
              results.totalReturn += bet * rules.blackjackPayout;
              return []; // no need to compare hands
            }

            if (hand[0] === hand[1] && hand.length === 2) {
              if (splits > 0 && hand[0] === 1 && !rules.resplitAces) {
                // Can't split aces again
                log("Player can't resplit aces");
              } else if (splits + 1 >= rules.splitTo) {
                // Can't split anymore
                log("Player has already split to max number of hands");
              } else {
                log("Player can split");
                // Check if player should split
                if (splittingStrategy[hand[0]][dealerCardIdx]) {
                  log("Player split");
                  // Split
                  splits += 1;
                  return [
                    ...doStrategy([hand[0], drawCard()], bet), //Flag as unnatural blackjack
                    ...doStrategy([hand[1], drawCard()], bet), //Flag as unnatural blackjack
                  ];
                } else {
                  log("Player didn't split");
                }
              }
            }

            // 0 = stand, 1 = hit, 2 = double if allowed, otherwise hit, 3 = double if allowed, otherwise stay
            let strategy = 0;
            let handValue = hand.reduce((acc, card) => acc + card, 0);
            if (hand.includes(1) && handValue <= 11) {
              // Soft hand
              handValue += 10;
              log("Soft hand value:", handValue);
              strategy = softHandStrategy[handValue][dealerCardIdx];
            } else {
              // Hard hand
              log("Hard hand value:", handValue);
              strategy = hardHandStrategy[handValue][dealerCardIdx];
            }

            let canDouble = hand.length < 3; // Can't double after hitting
            if (
              ((handValue < 9 || handValue > 11) &&
                rules.doubleOn === "9-11") ||
              ((handValue < 10 || handValue > 11) && rules.doubleOn === "10-11")
            ) {
              canDouble = false;
            } else if (!rules.doubleAfterSplitting && splits > 0) {
              canDouble = false;
            }

            if (!canDouble) {
              log("Player can't double down");
            }

            if ((strategy === 2 || strategy === 3) && canDouble) {
              log("Player doubles down");
              // Double down
              return doStrategy([...hand, drawCard()], bet * 2);
            } else if (
              strategy === 1 ||
              (strategy === 2 &&
                (rules.hitSplitAces || hand[0] !== 1 || splits === 0)) // If player has split an ace and hitSplitAces is false, don't hit
            ) {
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

          // If player got blackjack or bust already, end here.
          if (handValues.length === 0) {
            return;
          }

          let dealerHandValue = getSoftHandValue(dealerHand);

          while (
            dealerHandValue <
            (dealerHand.includes(1) && rules.dealerHitsSoft17 ? 18 : 17)
          ) {
            log("Dealer hits");
            dealerHand.push(drawCard());
            dealerHandValue = getSoftHandValue(dealerHand);
          }

          if (dealerHandValue > 21) {
            log("Dealer busts");
            log("WIN");
            results.wins += handValues.length;
            results.totalBets += handValues.reduce(
              (acc, [_, bet]) => acc + bet,
              0
            );
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

        resolve(results);
      }),
    [
      rules,
      countValues,
      getBet,
      splittingStrategy,
      softHandStrategy,
      hardHandStrategy,
      surrenderStrategy,
      log,
    ]
  );

  const CHUNK_SIZE = 100;
  const play = (results: Results = { ...DEFAULT_RESULTS }, plays = 0) => {
    // use timeouts to chunk this up so the UI doesn't freeze
    for (
      let i = plays;
      i < Math.min(plays + CHUNK_SIZE, numberOfPlaythroughs);
      i++
    ) {
      playShoe().then((res) => {
        results.wins += res.wins;
        results.losses += res.losses;
        results.ties += res.ties;
        results.totalBets += res.totalBets;
        results.totalReturn += res.totalReturn;
        if (i + 1 === numberOfPlaythroughs) {
          setFinalResult({ ...results });
        }
      });
      if (i % 100 === 99) {
        setFinalResult({ ...results });
        setTimeout(() => {
          play(results, plays + CHUNK_SIZE);
        }, 1);
      }
    }
  };

  return (
    <>
      <Button
        position="fixed"
        m={2}
        rightIcon={<SettingsIcon />}
        ref={rulesButtonRef}
        colorScheme="teal"
        onClick={openRulesDrawer}
      >
        Rules
      </Button>
      <Drawer
        size={"md"}
        isOpen={rulesDrawerOpen}
        placement="left"
        onClose={closeRulesDrawer}
        finalFocusRef={rulesButtonRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Game Rules</DrawerHeader>
          <DrawerBody>
            <SimpleGrid
              templateColumns={"4fr 3fr"}
              columns={2}
              spacing={3}
              alignItems={"center"}
              justifyContent={"space-around"}
            >
              <Text>Number of decks in shoe:</Text>
              <NumberInput
                min={0}
                max={12}
                value={rules.numberOfDecks}
                onChange={(valueString) =>
                  updateRules({ numberOfDecks: parseInt(valueString) })
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Text>Minbet:</Text>
              <NumberInput
                min={0}
                max={10}
                value={rules.minBet}
                onChange={(valueString) =>
                  updateRules({ minBet: parseInt(valueString) })
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Text>Maxbet:</Text>
              <NumberInput
                min={1}
                max={10}
                value={rules.maxBet}
                onChange={(valueString) =>
                  updateRules({ maxBet: parseInt(valueString) })
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Text>Number of other players:</Text>
              <NumberInput
                min={0}
                max={7}
                value={rules.numberOfOtherPlayers}
                onChange={(valueString) =>
                  updateRules({ numberOfOtherPlayers: parseInt(valueString) })
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Text>Blackjack pays:</Text>
              <Select
                value={rules.blackjackPayout.toString()}
                onChange={(e) =>
                  updateRules({ blackjackPayout: parseFloat(e.target.value) })
                }
              >
                <option value={"1"}>1:1</option>
                <option value={"1.2"}>6:5</option>
                <option value={"1.5"}>3:2</option>
                <option value={"2"}>2:1</option>
              </Select>

              <Text>Dealer hits soft 17:</Text>
              <Switch
                isChecked={rules.dealerHitsSoft17}
                onChange={(e) =>
                  updateRules({ dealerHitsSoft17: e.target.checked })
                }
              />

              <Text>Player may double after splitting:</Text>
              <Switch
                isChecked={rules.doubleAfterSplitting}
                onChange={(e) =>
                  updateRules({ doubleAfterSplitting: e.target.checked })
                }
              />

              <Text>Player may re-split aces:</Text>
              <Switch
                isChecked={rules.resplitAces}
                onChange={(e) => updateRules({ resplitAces: e.target.checked })}
              />

              <Text>Player may hit split aces:</Text>
              <Switch
                isChecked={rules.hitSplitAces}
                onChange={(e) =>
                  updateRules({ hitSplitAces: e.target.checked })
                }
              />

              <Text>Max hands player may split to:</Text>
              <RadioGroup
                value={rules.splitTo.toString()}
                onChange={(val) => {
                  updateRules({ splitTo: parseInt(val) });
                }}
              >
                <HStack justifyContent={"space-between"}>
                  <Radio value="2">2</Radio>
                  <Radio value="3">3</Radio>
                  <Radio value="4">4</Radio>
                </HStack>
              </RadioGroup>

              <Text>Player may double down on:</Text>
              <RadioGroup
                value={rules.doubleOn}
                onChange={(val) => {
                  updateRules({ doubleOn: val });
                }}
              >
                <HStack justifyContent={"space-between"}>
                  <Radio value="any">Any</Radio>
                  <Radio value="9-11">9-11</Radio>
                  <Radio value="10-11">10-11</Radio>
                </HStack>
              </RadioGroup>

              <Text>Surrender option:</Text>
              <RadioGroup
                value={rules.surrenderOption}
                onChange={(val) => {
                  updateRules({ surrenderOption: val });
                }}
              >
                <HStack justifyContent={"space-between"}>
                  <Radio value="none">None</Radio>
                  <Radio value="early">Early</Radio>
                  <Radio value="late">Late</Radio>
                </HStack>
              </RadioGroup>

              <Text>Flat bet:</Text>
              <Switch
                isChecked={rules.flatBet}
                onChange={(e) => updateRules({ flatBet: e.target.checked })}
              />
            </SimpleGrid>
          </DrawerBody>
          <Text w="full" justifyContent={"center"} align="center" as="b">
            Estimated House Edge:{" "}
            <Box
              as="span"
              color={estimateHouseEdge(rules) < 0 ? "green.400" : "red.500"}
            >
              {estimateHouseEdge(rules).toFixed(2)}%
            </Box>
          </Text>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={closeRulesDrawer}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <VStack
        spacing={2}
        alignItems="center"
        p={2}
        justifyContent={"center"}
        h="100vh"
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
          <Button onClick={() => play(finalResult)} colorScheme={"blue"}>
            Simulate
          </Button>
          <Button
            onClick={() => setFinalResult({ ...DEFAULT_RESULTS })}
            colorScheme={"blue"}
          >
            Reset Results
          </Button>
        </HStack>

        <ResultsDisplay results={finalResult} />
      </VStack>
    </>
  );
}

const toPercent = (val: number) => {
  return `${(val * 100).toFixed(2)}%`;
};

const ResultsDisplay = ({ results }: { results: Results | null }) => {
  if (!results.totalBets) {
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
