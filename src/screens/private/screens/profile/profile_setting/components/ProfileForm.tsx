import { useState } from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  GithubIcon,
  XIcon,
  WebsiteIcon,
} from '@assets';
import { InputText, InputType } from '@components';
import {
  Box,
  SimpleGrid,
  Flex,
  Input,
  Button,
  IconButton,
  Badge,
  Separator,
  Stack,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { useForm } from '@tanstack/react-form';
import { ProfileFormProps, ProfileFormValues } from '../types';
import { cleanProfileFormValues } from '../util';



/**
 * ProfileForm Component.
 * Renders the input settings form for updating user profile fields.
 *
 * @param props Component properties containing initialData, name, and mutations.
 */
export const ProfileForm = ({
  initialData,
  name,
  saveMutation,
  successToast,
  errorToast,
}: ProfileFormProps) => {
  const [hobbyInput, setHobbyInput] = useState('');
  const defaultValues: ProfileFormValues = {
    bio: initialData?.bio || '',
    phone_number: initialData?.phone_number || [],
    socialLink: {
      facebook: initialData?.socialLink?.facebook || '',
      instagram: initialData?.socialLink?.instagram || '',
      github: initialData?.socialLink?.github || '',
      x: initialData?.socialLink?.x || '',
      website: initialData?.socialLink?.website || '',
    },
    hobbies: initialData?.hobbies || [],
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Non-TSX business logic moved to util function
      const cleanedData = cleanProfileFormValues(value);

      try {
        await saveMutation.mutateAsync(cleanedData);
        successToast('Profile updated successfully on Google Drive! 🎉');
      } catch (err: unknown) {
        const error = err as Error;
        errorToast(`Failed to update profile: ${error.message || error}`);
      }
    },
  });

  const Field = form.Field;
  const Subscribe = form.Subscribe;
  const isSaving = saveMutation.isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <InputText
          type={InputType.TEXT}
          labelTitle="Name"
          defaultValue={name || 'User'}
          updateType="name"
          updateFormValue={() => 0}
          disabled={true}
        />

        <Field name="bio">
          {(field) => (
            <Box w="100%" mb={2}>
              <Text fontSize="sm" px={1} mb={1} color="gray.300" fontWeight="semibold">
                Bio
              </Text>
              <Input
                bg="gray.800"
                borderColor="gray.600"
                color="white"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Tell us about yourself..."
                pl={4}
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              />
            </Box>
          )}
        </Field>

        {/* Phone Numbers array editor */}
        <Field name="phone_number">
          {(field) => {
            const list = field.state.value || [];
            // Ensure we always have an empty input at the end to type a new value
            const displayList = [...list];
            if (
              displayList.length === 0 ||
              displayList[displayList.length - 1] !== ''
            ) {
              displayList.push('');
            }

            return (
              <Box display="flex" flexDirection="column" gap={2}>
                <Text fontSize="sm" px={1} mb={1} color="gray.300" fontWeight="semibold">
                  Phone Numbers
                </Text>
                <Stack gap={2}>
                  {displayList.map((phone: string, idx: number) => (
                    <Flex key={idx} gap={2} align="center">
                      <Input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          const updated = [...displayList];
                          updated[idx] = e.target.value;
                          field.handleChange(updated);
                        }}
                        bg="gray.800"
                        borderColor="gray.600"
                        color="white"
                        placeholder="Enter phone number"
                        pl={4}
                        h="10"
                        _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                      />
                      {(phone !== '' || idx < displayList.length - 1) && (
                        <IconButton
                          aria-label="Remove phone number"
                          onClick={() => {
                            const updated = displayList.filter(
                              (_, i) => i !== idx,
                            );
                            field.handleChange(updated);
                          }}
                          variant="outline"
                          colorPalette="red"
                          borderColor="red.500"
                          color="red.500"
                          _hover={{ bg: 'red.500', color: 'white' }}
                          size="sm"
                          h="10"
                          w="10"
                        >
                          ✕
                        </IconButton>
                      )}
                    </Flex>
                  ))}
                </Stack>
              </Box>
            );
          }}
        </Field>

        {/* Hobbies tag/badge editor */}
        <Field name="hobbies">
          {(field) => {
            const list: string[] = field.state.value || [];

            const handleKeyDown = (
              e: React.KeyboardEvent<HTMLInputElement>,
            ) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = hobbyInput.trim();
                if (val && !list.includes(val)) {
                  field.handleChange([...list, val]);
                  setHobbyInput('');
                }
              }
            };

            return (
              <Box display="flex" flexDirection="column" gap={2}>
                <Text fontSize="sm" px={1} mb={1} color="gray.300" fontWeight="semibold">
                  Hobbies
                </Text>
                <Flex
                  flexWrap="wrap"
                  gap={2}
                  mb={1}
                  p={2}
                  border="1px solid"
                  borderColor="gray.800"
                  borderRadius="md"
                  bg="rgba(26, 32, 44, 0.4)"
                  minH="40px"
                  align="center"
                >
                  {list.length === 0 ? (
                    <Text fontSize="xs" color="gray.500" fontStyle="italic" px={1}>
                      No hobbies added yet. Press Enter in the input below to add.
                    </Text>
                  ) : (
                    list.map((hobby: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="subtle"
                        colorPalette="blue"
                        py={1}
                        px={2}
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                      >
                        <Text fontSize="xs">{hobby}</Text>
                        <IconButton
                          aria-label="Remove hobby"
                          onClick={() =>
                            field.handleChange(
                              list.filter((_, i) => i !== idx),
                            )
                          }
                          variant="ghost"
                          size="xs"
                          p={0}
                          minH="0"
                          h="auto"
                          w="auto"
                          color="gray.400"
                          _hover={{ color: 'red.400' }}
                        >
                          ✕
                        </IconButton>
                      </Badge>
                    ))
                  )}
                </Flex>
                <Input
                  type="text"
                  value={hobbyInput}
                  onChange={(e) => setHobbyInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="white"
                  placeholder="Type a hobby and press Enter to add"
                  pl={4}
                  h="10"
                  _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                />
              </Box>
            );
          }}
        </Field>
      </SimpleGrid>

      <Separator my={6} borderColor="border.subtle" />
      <Text fontSize="xl" fontWeight="semibold" mb={2} color="text.primary">
        Social Links
      </Text>
      <Separator my={2} borderColor="border.subtle" />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Field name="socialLink">
          {(field) => {
            const social = field.state.value || {
              facebook: '',
              instagram: '',
              github: '',
              x: '',
              website: '',
            };

            const socialFields = [
              { key: 'facebook', label: 'Facebook', icon: <FacebookIcon />, placeholder: 'Facebook Profile URL' },
              { key: 'instagram', label: 'Instagram', icon: <InstagramIcon />, placeholder: 'Instagram Profile URL' },
              { key: 'github', label: 'Github', icon: <GithubIcon />, placeholder: 'Github Profile URL' },
              { key: 'x', label: 'X (Twitter)', icon: <XIcon />, placeholder: 'X Profile URL' },
              { key: 'website', label: 'Website', icon: <WebsiteIcon />, placeholder: 'Website URL' },
            ];

            return (
              <>
                {socialFields.map((sf) => (
                  <Box key={sf.key} display="flex" flexDirection="column" w="full">
                    <Text fontSize="sm" px={1} mb={1} color="gray.300" fontWeight="semibold">
                      {sf.label}
                    </Text>
                    <Flex gap={2} align="center">
                      <Flex
                        bg="gray.800"
                        border="1px solid"
                        borderColor="gray.700"
                        color="white"
                        h="10"
                        w="10"
                        align="center"
                        justify="center"
                        borderRadius="md"
                        flexShrink={0}
                        shadow="md"
                      >
                        {sf.icon}
                      </Flex>
                      <Input
                        type="text"
                        value={social[sf.key as keyof typeof social]}
                        onChange={(e) =>
                          field.handleChange({
                            ...social,
                            [sf.key]: e.target.value,
                          })
                        }
                        bg="gray.800"
                        borderColor="gray.600"
                        color="white"
                        placeholder={sf.placeholder}
                        pl={4}
                        h="10"
                        _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                      />
                    </Flex>
                  </Box>
                ))}
              </>
            );
          }}
        </Field>
      </SimpleGrid>

      <Subscribe
        selector={(state) => [state.isDirty, state.isSubmitting]}
        children={([isDirty, isSubmitting]) => {
          const isLoading = isDirty === false ? false : (isSubmitting || isSaving);
          return (
            <Flex justify="end" mt={8} borderTop="1px solid" borderColor="border.subtle" pt={6}>
              <Button
                type="submit"
                disabled={!isDirty || isLoading}
                bg={!isDirty || isLoading ? 'gray.700' : 'blue.600'}
                opacity={!isDirty || isLoading ? 0.5 : 1}
                color="white"
                fontWeight="semibold"
                px={8}
                py={2.5}
                borderRadius="lg"
                shadow="lg"
                _hover={
                  !isDirty || isLoading
                    ? {}
                    : {
                        bg: 'blue.500',
                        transform: 'translateY(-2px)',
                        shadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                      }
                }
                transition="all 0.2s"
              >
                {isLoading ? (
                  <Flex align="center" gap={2}>
                    <Spinner size="sm" color="white" />
                    <Text>Saving...</Text>
                  </Flex>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </Flex>
          );
        }}
      />
    </form>
  );
};
