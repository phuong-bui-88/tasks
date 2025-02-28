import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  Link,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiCheckSquare, 
  FiUsers, 
  FiSettings, 
  FiBarChart2 
} from 'react-icons/fi';

interface NavItemProps {
  icon: React.ElementType;
  path: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ icon, path, children }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(path);
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Link
      as={RouterLink}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : 'inherit'}
        _hover={{
          bg: hoverBg,
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
        />
        <Text>{children}</Text>
      </Flex>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="100vh"
      w="240px"
      bg={useColorModeValue('white', 'gray.800')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      zIndex="sticky"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Task Manager
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch">
        <Box>
          <NavItem icon={FiHome} path="/dashboard">Dashboard</NavItem>
          <NavItem icon={FiCheckSquare} path="/tasks">Tasks</NavItem>
          <NavItem icon={FiUsers} path="/users">Users</NavItem>
          <NavItem icon={FiBarChart2} path="/reports">Reports</NavItem>
        </Box>
        <Divider my={2} />
        <Box>
          <NavItem icon={FiSettings} path="/settings">Settings</NavItem>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
