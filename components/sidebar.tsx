import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { BsSuitSpade } from "react-icons/bs";

interface Tab {
  title: string;
  icon: any;
  content: any;
}

export default ({ tabs }: { tabs: Tab[] }) => {
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const sidebar = useDisclosure();

  const NavItem = (props) => {
    const { icon, idx, children, ...rest } = props;
    return (
      <Flex
        align="center"
        px="4"
        mx="2"
        rounded="md"
        py="3"
        cursor="pointer"
        color={currentTabIdx === idx ? "whiteAlpha.900" : "whiteAlpha.700"}
        _hover={{
          bg: "blackAlpha.300",
          color: "whiteAlpha.900",
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        onClick={() => {
          setCurrentTabIdx(idx);
          sidebar.onClose();
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="2"
            boxSize="4"
            _groupHover={{
              color: "gray.300",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  };

  const SidebarContent = (props) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="blue.600"
      borderColor="blackAlpha.300"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Icon color="whiteAlpha.900" as={BsSuitSpade} h={6} w={6} />
        <Text fontSize="2xl" ms="2" color="white" fontWeight="semibold">
          Blackjack Sim
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        {tabs.map((tab, index) => (
          <NavItem idx={index} icon={tab.icon}>
            {tab.title}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: "gray.700",
      }}
      minH="100vh"
    >
      <SidebarContent
        display={{
          base: "none",
          md: "unset",
        }}
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        transition=".3s ease"
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          _dark={{
            bg: "gray.800",
          }}
          borderBottomWidth="1px"
          borderColor="blackAlpha.300"
          h="14"
        >
          <Text fontSize="xl" fontWeight="semibold">
            {tabs[currentTabIdx].title}
          </Text>
          <IconButton
            aria-label="Menu"
            display={{
              base: "inline-flex",
              md: "none",
            }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
        </Flex>
        <Box as="main" p="4" h="full">
          {tabs.map((tab, index) => (
            <Box
              key={index}
              display={index === currentTabIdx ? "block" : "none"}
            >
              {tab.content}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
