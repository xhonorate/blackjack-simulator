import { Box, HStack, VStack } from "@chakra-ui/react";
import { formatCardName } from "../app/page";

export default function Counts({ countValues, setCountValues }) {
  return (
    <>
      Counts
      <VStack>
        {Object.entries(countValues).map(([card, count]) => (
          <HStack key={card}>
            <Box>{formatCardName(parseInt(card))}</Box>
            <Box>{count as string}</Box>
          </HStack>
        ))}
      </VStack>
    </>
  );
}
