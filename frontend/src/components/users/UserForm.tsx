import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Button, FormControl, FormLabel, Input, 
  Select, Stack, Heading, useToast, FormErrorMessage 
} from '@chakra-ui/react';
import { User, UserFormData, UserRole } from '../../types/User';
import { userService } from '../../services/userService';

interface UserFormProps {
  editMode?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ editMode = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (editMode && id) {
        try {
          setIsLoading(true);
          const userData = await userService.getUserById(parseInt(id));
          setFormData({
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
          });
        } catch (error) {
          console.error('Error fetching user:', error);
          toast({
            title: 'Error fetching user',
            description: 'Unable to load user data',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [id, editMode, toast]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!editMode && !formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      if (editMode && id) {
        await userService.updateUser(parseInt(id), formData);
        toast({
          title: 'User updated',
          description: 'User has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await userService.createUser(formData);
        toast({
          title: 'User created',
          description: 'User has been created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setFormData({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          role: 'USER',
          password: '',
        });
      }
      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Error',
        description: 'There was a problem saving the user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={8} p={5} borderWidth="1px" borderRadius="lg">
      <Heading size="lg" mb={6}>
        {editMode ? 'Edit User' : 'Create New User'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              isDisabled={isLoading || (editMode && true)} // Username cannot be changed in edit mode
            />
            {errors.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              isDisabled={isLoading}
            />
            {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              isDisabled={isLoading}
            />
            {errors.firstName && <FormErrorMessage>{errors.firstName}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              isDisabled={isLoading}
            />
            {errors.lastName && <FormErrorMessage>{errors.lastName}</FormErrorMessage>}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="role">Role</FormLabel>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              isDisabled={isLoading}
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="USER">User</option>
            </Select>
          </FormControl>

          {!editMode && (
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                isDisabled={isLoading}
              />
              {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
            </FormControl>
          )}
          
          {editMode && (
            <FormControl>
              <FormLabel htmlFor="password">Password (leave blank to keep current)</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                isDisabled={isLoading}
              />
            </FormControl>
          )}

          <Stack direction="row" spacing={4} pt={4}>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              loadingText="Saving"
            >
              {editMode ? 'Update User' : 'Create User'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/users')}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default UserForm;
