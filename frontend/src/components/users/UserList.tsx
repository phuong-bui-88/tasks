import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Badge, IconButton, Flex, useToast, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent,
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Spinner, Text
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { User } from '../../types/User';
import { userService } from '../../services/userService';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (id: number) => {
    setSelectedUserId(id);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId) {
      try {
        await userService.deleteUser(selectedUserId);
        setUsers(users.filter(user => user.id !== selectedUserId));
        toast({
          title: 'User deleted',
          description: 'User has been deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    onClose();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'MANAGER': return 'purple';
      case 'USER': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Users</Heading>
        <Button
          as={RouterLink}
          to="/users/new"
          leftIcon={<AddIcon />}
          colorScheme="green"
        >
          New User
        </Button>
      </Flex>

      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : users.length === 0 ? (
        <Box textAlign="center" p={5}>
          <Text fontSize="lg">No users found</Text>
        </Box>
      ) : (
        <Box overflow="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.id}>
                  <Td>{user.username}</Td>
                  <Td>{`${user.firstName} ${user.lastName}`}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge colorScheme={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      as={RouterLink}
                      to={`/users/edit/${user.id}`}
                      icon={<EditIcon />}
                      aria-label="Edit user"
                      size="sm"
                      colorScheme="blue"
                      mr={2}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete user"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteClick(user.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UserList;
