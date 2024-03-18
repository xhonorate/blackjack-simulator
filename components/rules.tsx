import {
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Switch,
  RadioGroup,
  HStack,
  Radio,
  Text,
  Box,
} from "@chakra-ui/react";

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

export default function Rules({ rules, updateRules }) {
  return (
    <>
      <SimpleGrid
        templateColumns={[null, "4fr 3fr"]}
        columns={[1, 2]}
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
          value={"$" + rules.minBet}
          onChange={(valueString) =>
            updateRules({
              minBet: parseInt(valueString.replace("$", "")),
            })
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
          value={"$" + rules.maxBet}
          onChange={(valueString) =>
            updateRules({
              maxBet: parseInt(valueString.replace("$", "")),
            })
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
          onChange={(e) => updateRules({ dealerHitsSoft17: e.target.checked })}
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
          onChange={(e) => updateRules({ hitSplitAces: e.target.checked })}
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
      <Box w="full" textAlign={"center"} mt={6}>
        <Text justifyContent={"center"} align="center" as="b">
          Estimated House Edge:{" "}
          <Box
            as="span"
            color={estimateHouseEdge(rules) < 0 ? "green.400" : "red.500"}
          >
            {estimateHouseEdge(rules).toFixed(2)}%
          </Box>
        </Text>
      </Box>
    </>
  );
}
