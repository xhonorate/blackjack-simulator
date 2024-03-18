import { Box, HStack, VStack } from "@chakra-ui/react";

export default function Counts({ countValues, setCountValues }) {
  return (
    <>
      Counts
      <VStack>
        {Object.entries(countValues).map(([card, count]) => (
          <HStack key={card}>
            <Box>{card.replace("1", "A").replace("10", "10, J, Q, K")}</Box>
            <Box>{count as string}</Box>
          </HStack>
        ))}
      </VStack>
    </>
  );
}
