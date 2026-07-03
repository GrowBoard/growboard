import { useState } from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaXTwitter,
  FaGlobe,
  FaLinkedin,
} from 'react-icons/fa6';
import { LuUser, LuMail, LuUserRound, LuPhone } from 'react-icons/lu';
import { TitleCard, PageLoadingComponent, useSuccessToast } from '@components';
import {
  profileSelector,
  authNameSelector,
  authEmailSelector,
  authPictureSelector,
  useShallow,
} from '@selectors';
import { appStore } from '@store';
import { useGetProfileData } from '@services/hooks/private';
import {
  Box,
  Flex,
  Text,
  Image,
  Badge,
  Stack,
  Link,
  SimpleGrid,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from './components';

/**
 * ProfilePreviewScreen Component.
 * Renders a visual card preview of the user's profile information, including their avatar,
 * name, email, bio, phone numbers (with click-to-copy utility), hobbies, and social links.
 *
 * @returns The ProfilePreviewScreen component.
 */
const ProfilePreviewScreen = () => {
  const { profileData } = appStore(useShallow(profileSelector));
  const googleName = appStore(useShallow(authNameSelector));
  const googleEmail = appStore(useShallow(authEmailSelector));
  const googlePicture = appStore(useShallow(authPictureSelector));

  const { isLoading } = useGetProfileData();
  const successToast = useSuccessToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  /**
   * Copies the selected phone number to the user's clipboard and triggers
   * a success toast message along with a temporary visual icon checkmark.
   *
   * @param phone The phone number string to be copied.
   * @param idx The index of the phone number item in the array.
   */
  const handleCopy = (phone: string, idx: number) => {
    navigator.clipboard.writeText(phone);
    setCopiedIndex(idx);
    successToast('Phone number copied to clipboard! 📋');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const displayName = googleName || 'User';
  const displayEmail = googleEmail || 'No email connected';
  const displayPicture = googlePicture
    ? googlePicture.replace('s96-c', 's1028-c')
    : null;

  return (
    <Box m={4} h="full">
      {isLoading && <PageLoadingComponent />}
      <TitleCard title="Profile Preview" topMargin="mt-2">
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap={8}
          maxW="4xl"
          mx="auto"
          p={4}
        >
          {/* Left panel: Avatar & Basic Details */}
          <Box
            gridColumn={{ base: 'span 1', md: 'span 1' }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={4}
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="text.muted"
              letterSpacing="wider"
              textTransform="uppercase"
            >
              Profile Photo
            </Text>
            <Box
              w="56"
              h="56"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              overflow="hidden"
              border="1px solid"
              borderColor="border.subtle"
              bg="bg.card"
              shadow="md"
            >
              {displayPicture ? (
                <Image
                  alt="Profile Avatar"
                  src={displayPicture}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Box transform="scale(1.5)" color="text.muted">
                  <LuUserRound size={48} />
                </Box>
              )}
            </Box>
          </Box>

          {/* Right panel: Account Details, Bio, Hobbies, Social Links */}
          <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
            <Stack gap={6}>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="text.muted"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  mb={3}
                >
                  Account Information
                </Text>
                <Stack gap={3}>
                  <Flex
                    fontSize="md"
                    fontWeight="semibold"
                    border="1px solid"
                    borderColor="border.subtle"
                    borderRadius="md"
                    p={3}
                    align="center"
                    gap={3}
                    bg="bg.card"
                    color="text.primary"
                    shadow="sm"
                  >
                    <LuUser />
                    <Text
                      fontSize="xs"
                      color="text.muted"
                      textTransform="uppercase"
                      mr={1}
                    >
                      Name:
                    </Text>
                    <Text>{displayName}</Text>
                  </Flex>
                  <Flex
                    fontSize="md"
                    fontWeight="semibold"
                    border="1px solid"
                    borderColor="border.subtle"
                    borderRadius="md"
                    p={3}
                    align="center"
                    gap={3}
                    bg="bg.card"
                    color="text.primary"
                    shadow="sm"
                  >
                    <LuMail />
                    <Text
                      fontSize="xs"
                      color="text.muted"
                      textTransform="uppercase"
                      mr={1}
                    >
                      Email:
                    </Text>
                    <Text>{displayEmail}</Text>
                  </Flex>
                </Stack>
              </Box>

              {profileData.bio && (
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="text.muted"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    mb={2}
                  >
                    Bio
                  </Text>
                  <Box
                    border="1px solid"
                    borderColor="border.subtle"
                    borderRadius="md"
                    p={4}
                    bg="bg.card"
                    color="text.primary"
                    fontStyle="italic"
                    shadow="sm"
                  >
                    &ldquo;{profileData.bio}&rdquo;
                  </Box>
                </Box>
              )}

              {profileData.phone_number &&
                profileData.phone_number.length > 0 && (
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color="text.muted"
                      letterSpacing="wider"
                      textTransform="uppercase"
                      mb={2}
                    >
                      Phone Numbers
                    </Text>
                    <Stack gap={2}>
                      {profileData.phone_number.map(
                        (phone: string, idx: number) => (
                          <Flex
                            key={idx}
                            border="1px solid"
                            borderColor="border.subtle"
                            borderRadius="md"
                            p={3}
                            bg="bg.card"
                            color="text.primary"
                            fontSize="sm"
                            shadow="sm"
                            align="center"
                            justify="space-between"
                          >
                            <Flex align="center" gap={3}>
                              <LuPhone
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  color: 'var(--chakra-colors-text-muted)',
                                }}
                              />
                              <Text>{phone}</Text>
                            </Flex>
                            <IconButton
                              aria-label="Copy phone number"
                              onClick={() => handleCopy(phone, idx)}
                              variant="ghost"
                              size="xs"
                              color="text.secondary"
                              _hover={{
                                color: 'border.focus',
                                bg: 'transparent',
                              }}
                            >
                              {copiedIndex === idx ? (
                                <CheckIcon />
                              ) : (
                                <CopyIcon />
                              )}
                            </IconButton>
                          </Flex>
                        ),
                      )}
                    </Stack>
                  </Box>
                )}

              {profileData.hobbies && profileData.hobbies.length > 0 && (
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="text.muted"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    mb={2}
                  >
                    Hobbies
                  </Text>
                  <Flex flexWrap="wrap" gap={2}>
                    {profileData.hobbies.map((hobby: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="subtle"
                        colorPalette="blue"
                        py={1.5}
                        px={4}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="semibold"
                        shadow="sm"
                      >
                        {hobby}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              )}

              {profileData.socialLink && (
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="text.muted"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    mb={3}
                  >
                    Social Connections
                  </Text>
                  <HStack gap={3}>
                    {profileData.socialLink.facebook && (
                      <Link
                        href={
                          profileData.socialLink.facebook.startsWith('http')
                            ? profileData.socialLink.facebook
                            : `https://${profileData.socialLink.facebook}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        bg="#1877F2"
                        border="1px solid #1877F2"
                        _hover={{
                          bg: '#0e65d9',
                          transform: 'scale(1.12)',
                          boxShadow: '0 0 14px rgba(24,119,242,0.65)',
                        }}
                        transition="all 0.2s ease"
                        color="white"
                        h="10"
                        w="10"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        title="Facebook"
                      >
                        <FaFacebook size={20} />
                      </Link>
                    )}
                    {profileData.socialLink.instagram && (
                      <Link
                        href={
                          profileData.socialLink.instagram.startsWith('http')
                            ? profileData.socialLink.instagram
                            : `https://${profileData.socialLink.instagram}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        background="linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
                        border="1px solid #cc2366"
                        _hover={{
                          opacity: 0.82,
                          transform: 'scale(1.12)',
                          boxShadow: '0 0 14px rgba(220,39,67,0.65)',
                        }}
                        transition="all 0.2s ease"
                        color="white"
                        h="10"
                        w="10"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        title="Instagram"
                      >
                        <FaInstagram size={20} />
                      </Link>
                    )}
                    {profileData.socialLink.github && (
                      <Link
                        href={
                          profileData.socialLink.github.startsWith('http')
                            ? profileData.socialLink.github
                            : `https://${profileData.socialLink.github}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        bg="#24292e"
                        border="1px solid #444d56"
                        _hover={{
                          bg: '#1a1e22',
                          transform: 'scale(1.12)',
                          boxShadow: '0 0 14px rgba(255,255,255,0.18)',
                        }}
                        transition="all 0.2s ease"
                        color="white"
                        h="10"
                        w="10"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        title="Github"
                      >
                        <FaGithub size={20} />
                      </Link>
                    )}
                    {profileData.socialLink.x && (
                      <Link
                        href={
                          profileData.socialLink.x.startsWith('http')
                            ? profileData.socialLink.x
                            : `https://${profileData.socialLink.x}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        bg="#000000"
                        border="1px solid #333"
                        _hover={{
                          bg: '#111111',
                          transform: 'scale(1.12)',
                          boxShadow: '0 0 14px rgba(255,255,255,0.2)',
                        }}
                        transition="all 0.2s ease"
                        color="white"
                        h="10"
                        w="10"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        title="X (Twitter)"
                      >
                        <FaXTwitter size={20} />
                      </Link>
                    )}
                    {profileData.socialLink.website && (
                      <Link
                        href={
                          profileData.socialLink.website.startsWith('http')
                            ? profileData.socialLink.website
                            : `https://${profileData.socialLink.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        bg="#0891b2"
                        border="1px solid #06b6d4"
                        _hover={{
                          bg: '#0e7490',
                          transform: 'scale(1.12)',
                          boxShadow: '0 0 14px rgba(6,182,212,0.65)',
                        }}
                        transition="all 0.2s ease"
                        color="white"
                        h="10"
                        w="10"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        title="Website"
                      >
                        <FaGlobe height={20} />
                      </Link>
                    )}
                    {profileData.socialLink.linkedin && (
                      <Link
                        href={
                          profileData.socialLink.linkedin.startsWith('http')
                            ? profileData.socialLink.linkedin
                            : `https://${profileData.socialLink.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        bg="#0A66C2"
                        border="1px solid #0A66C2"
                        _hover={{
                          bg: '#004182',
                          transform: 'scale(1.12)',
                          boxShadow: '0 0 14px rgba(10,102,194,0.65)',
                        }}
                        transition="all 0.2s ease"
                        color="white"
                        h="10"
                        w="10"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        title="LinkedIn"
                      >
                        <FaLinkedin size={20} />
                      </Link>
                    )}
                  </HStack>
                </Box>
              )}
            </Stack>
          </Box>
        </SimpleGrid>
      </TitleCard>
    </Box>
  );
};

export default ProfilePreviewScreen;
