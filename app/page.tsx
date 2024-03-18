"use client";

import React, { useCallback, useMemo, useReducer, useState } from "react";
import { FaCog, FaHome } from "react-icons/fa";
import { GoNumber } from "react-icons/go";
import { GiCardPlay } from "react-icons/gi";
import Sidebar from "../components/sidebar";
import Main, { Results, DEFAULT_RESULTS } from "../components/main";
import Rules from "../components/rules";
import Counts from "../components/counts";

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

export default function Page(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [finalResult, setFinalResult] = useState({ ...DEFAULT_RESULTS });

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

  const [numberOfPlaythroughs, setNumberOfPlaythroughs] = useState(1000);

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
          const isSoft = dealerHand.includes(1);
          // Dealer strategy is simpler, so for simulation accuracy, we can run math and give results as an average of expected outcomes

          // Get % odds of each card being drawn
          const cardDrawOdds = shoe.reduce(
            (prev, card) => {
              prev[card - 1] += 1;
              return prev;
            },
            [
              0, // 1
              0, // 2
              0, // 3
              0, // 4
              0, // 5
              0, // 6
              0, // 7
              0, // 8
              0, // 9
              0, // 10
            ]
          );

          cardDrawOdds.forEach((val, idx) => {
            cardDrawOdds[idx] = shoe.length ? val / shoe.length : 0;
          });

          const dealerHandOutcomes = {
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            bust: 0,
          };

          const calcOdds = (handVal, soft, odds = 1) => {
            cardDrawOdds.forEach((val, idx) => {
              const newHandValue = handVal + idx + 1;
              const newSoft = idx === 0 || soft;
              const newSoftValue =
                newHandValue + (newSoft && newHandValue < 11 ? 10 : 0);

              if (newHandValue > 21) {
                // Dealer busts
                dealerHandOutcomes.bust += val * odds;
              } else if (
                newHandValue >= 17 ||
                (newSoft &&
                  newSoftValue >= 17 + (rules.dealerHitsSoft17 ? 1 : 0))
              ) {
                // Dealer stays
                dealerHandOutcomes[newSoft ? newSoftValue : newHandValue] +=
                  val * odds;
              } else {
                // Dealer hits
                calcOdds(newHandValue, newSoft, val * odds);
              }
            });
          };

          if (
            dealerHandValue >= 17 &&
            !(isSoft && rules.dealerHitsSoft17 && dealerHandValue === 17)
          ) {
            // Dealer stands, no need to calculate odds of draws
            dealerHandOutcomes[dealerHandValue] = 1;
          } else {
            // Use absolute hand value with soft as an option instead...
            calcOdds(dealerHand[0] + dealerHand[1], isSoft);
          }

          handValues.forEach(([handValue, bet]) => {
            results.totalBets += bet;

            Object.entries(dealerHandOutcomes).forEach(([val, odds]) => {
              if (val === "bust" || parseInt(val) < handValue) {
                // Player wins
                results.wins += odds;
                results.totalReturn += bet * odds;
              } else if (parseInt(val) === handValue) {
                // Push
                results.ties += odds;
              } else {
                // Dealer wins
                results.losses += odds;
                results.totalReturn -= bet * odds;
              }
            });
          });
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
        results.numberOfPlaythroughs += 1;
        if (i + 1 === numberOfPlaythroughs) {
          setFinalResult({ ...results });
          setLoading(false);
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
      <Sidebar
        tabs={[
          {
            title: "Main",
            icon: FaHome,
            content: (
              <Main
                numberOfPlaythroughs={numberOfPlaythroughs}
                setNumberOfPlaythroughs={setNumberOfPlaythroughs}
                play={play}
                finalResult={finalResult}
                setFinalResult={setFinalResult}
                loading={loading}
                setLoading={setLoading}
              />
            ),
          },
          {
            title: "Rules",
            icon: FaCog,
            content: <Rules rules={rules} updateRules={updateRules} />,
          },
          {
            title: "Count Values",
            icon: GoNumber,
            content: (
              <Counts
                countValues={countValues}
                setCountValues={setCountValues}
              />
            ),
          },
          {
            title: "Strategy",
            icon: GiCardPlay,
            content: <>Strategy</>,
          },
        ]}
      />
    </>
  );
}
