import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  Separator,
  VStack,
} from '@chakra-ui/react';
import {
  LuEye,
  LuEyeOff,
  LuCopy,
  LuPencil,
  LuTrash2,
  LuCheck,
} from 'react-icons/lu';
import { CredentialCardProps } from './types';

/**
 * CredentialCard component renders an individual credential card,
 * managing its own field visibility and copy status states.
 */
const CredentialCard = ({
  item,
  credIdx,
  onEdit,
  onDelete,
  onCopyAsEnv,
  viewMode = 'card',
}: CredentialCardProps) => {
  const { t } = useTranslation();
  const [visibleFields, setVisibleFields] = useState<Record<number, boolean>>(
    {},
  );
  const [copiedFieldIdx, setCopiedFieldIdx] = useState<number | null>(null);

  const toggleVisibility = (fieldIdx: number) => {
    setVisibleFields((prev) => ({ ...prev, [fieldIdx]: !prev[fieldIdx] }));
  };

  const toggleCardVisibility = () => {
    const allVisible = item.credData.every((_, idx) => visibleFields[idx]);
    const newState = !allVisible;
    const updated: Record<number, boolean> = {};
    item.credData.forEach((_, idx) => {
      updated[idx] = newState;
    });
    setVisibleFields(updated);
  };

  const isCardAllVisible = () => {
    return (
      item.credData.length > 0 &&
      item.credData.every((_, idx) => visibleFields[idx])
    );
  };

  const handleCopyToClipboard = async (text: string, fieldIdx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFieldIdx(fieldIdx);
      setTimeout(() => setCopiedFieldIdx(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const accentColors = [
    'blue.500',
    'teal.500',
    'purple.500',
    'emerald.500',
    'pink.500',
    'orange.500',
  ];
  const cardAccentColor = accentColors[credIdx % accentColors.length];

  if (viewMode === 'list') {
    return (
      <Box
        bg="bg.card"
        backdropFilter="blur(16px)"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="xl"
        p={4}
        shadow="md"
        _hover={{
          borderColor: 'border.focus',
          boxShadow: 'lg',
        }}
        transition="all 0.2s ease"
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
          gap={4}
        >
          {/* Left Column: Title & General Card Actions */}
          <Flex
            align="center"
            justify="space-between"
            minW={{ base: 'auto', md: '200px' }}
            maxW={{ base: '100%', md: '240px' }}
            gap={3}
          >
            <Text
              fontSize="md"
              fontWeight="bold"
              color="text.primary"
              lineClamp={1}
              title={item.credTitle}
            >
              {item.credTitle}
            </Text>

            <HStack gap={0.5}>
              {/* Reveal/Hide All */}
              <IconButton
                aria-label="Toggle all visibility"
                title={
                  isCardAllVisible()
                    ? t('Credentials.hideAll', 'Hide All')
                    : t('Credentials.revealAll', 'Reveal All')
                }
                onClick={toggleCardVisibility}
                variant="ghost"
                size="xs"
                color="text.secondary"
                _hover={{
                  bg: 'bg.active',
                  color: cardAccentColor,
                }}
              >
                {isCardAllVisible() ? <LuEyeOff /> : <LuEye />}
              </IconButton>

              {/* Copy All as .env */}
              <IconButton
                aria-label="Copy all as env"
                title={t('Credentials.copyAllEnv', 'Copy all as .env')}
                onClick={() => onCopyAsEnv(item, credIdx)}
                variant="ghost"
                size="xs"
                color="text.secondary"
                _hover={{
                  bg: 'bg.active',
                  color: 'emerald.400',
                }}
              >
                <LuCopy />
              </IconButton>
            </HStack>
          </Flex>

          {/* Middle Column: Horizontal fields list */}
          <Flex flex={1} flexWrap="wrap" gap={3} align="center">
            {item.credData.map((field, fieldIdx) => {
              const isVisible = visibleFields[fieldIdx] || false;
              const isCopied = copiedFieldIdx === fieldIdx;

              return (
                <HStack
                  key={fieldIdx}
                  bg={isCopied ? 'bg.active' : 'bg.input'}
                  border="1px solid"
                  borderColor={isCopied ? 'border.focus' : 'border.subtle'}
                  borderRadius="md"
                  px={2}
                  py={1}
                  gap={2}
                  maxW="300px"
                  align="center"
                >
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="text.muted"
                    whiteSpace="nowrap"
                  >
                    {field.name}:
                  </Text>
                  <Text
                    fontSize="xs"
                    fontFamily="mono"
                    color={isVisible ? 'text.primary' : 'text.muted'}
                    lineClamp={1}
                    maxW="140px"
                    userSelect={isVisible ? 'all' : 'none'}
                  >
                    {isVisible ? field.value : '••••••••••••'}
                  </Text>
                  <HStack gap={0.5}>
                    <IconButton
                      aria-label="Toggle Visibility"
                      onClick={() => toggleVisibility(fieldIdx)}
                      variant="ghost"
                      size="xs"
                      h="20px"
                      w="20px"
                      minW="20px"
                      color="text.secondary"
                      _hover={{ bg: 'bg.active', color: 'text.primary' }}
                    >
                      {isVisible ? <LuEyeOff size={12} /> : <LuEye size={12} />}
                    </IconButton>
                    <IconButton
                      aria-label="Copy to Clipboard"
                      onClick={() =>
                        handleCopyToClipboard(field.value, fieldIdx)
                      }
                      variant="ghost"
                      size="xs"
                      h="20px"
                      w="20px"
                      minW="20px"
                      color={isCopied ? 'emerald.400' : 'text.secondary'}
                      _hover={{ bg: 'bg.active', color: 'text.primary' }}
                    >
                      {isCopied ? <LuCheck size={12} /> : <LuCopy size={12} />}
                    </IconButton>
                  </HStack>
                </HStack>
              );
            })}
          </Flex>

          {/* Right Column: Edit & Delete Row Actions */}
          <HStack gap={1} justify="end" align="center">
            <IconButton
              aria-label={t('Credentials.editCredential', 'Edit')}
              title={t('Credentials.editCredential', 'Edit')}
              onClick={() => onEdit(credIdx)}
              variant="ghost"
              size="sm"
              color="text.secondary"
              _hover={{
                bg: 'bg.active',
                color: 'blue.400',
              }}
            >
              <LuPencil />
            </IconButton>

            <IconButton
              aria-label={t('Credentials.deleteCredential', 'Delete')}
              title={t('Credentials.deleteCredential', 'Delete')}
              onClick={() => onDelete(credIdx)}
              variant="ghost"
              size="sm"
              color="text.secondary"
              _hover={{
                bg: 'bg.active',
                color: 'red.400',
              }}
            >
              <LuTrash2 />
            </IconButton>
          </HStack>
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      bg="bg.card"
      backdropFilter="blur(16px)"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p={5}
      shadow="2xl"
      position="relative"
      _hover={{
        borderColor: 'border.focus',
        boxShadow: '2xl',
      }}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      {/* Card Title & Actions Row */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color="text.primary"
          lineClamp={1}
          maxW="50%"
          title={item.credTitle}
        >
          {item.credTitle}
        </Text>
        <HStack gap={1}>
          {/* Reveal/Hide All */}
          <IconButton
            aria-label="Toggle all visibility"
            title={
              isCardAllVisible()
                ? t('Credentials.hideAll', 'Hide All')
                : t('Credentials.revealAll', 'Reveal All')
            }
            onClick={toggleCardVisibility}
            variant="ghost"
            size="xs"
            color="text.secondary"
            _hover={{
              bg: 'bg.active',
              color: cardAccentColor,
            }}
          >
            {isCardAllVisible() ? <LuEyeOff /> : <LuEye />}
          </IconButton>

          {/* Copy All as .env */}
          <IconButton
            aria-label="Copy all as env"
            title={t('Credentials.copyAllEnv', 'Copy all as .env')}
            onClick={() => onCopyAsEnv(item, credIdx)}
            variant="ghost"
            size="xs"
            color="text.secondary"
            _hover={{
              bg: 'bg.active',
              color: 'emerald.400',
            }}
          >
            <LuCopy />
          </IconButton>

          {/* Edit */}
          <IconButton
            aria-label={t('Credentials.editCredential', 'Edit')}
            title={t('Credentials.editCredential', 'Edit')}
            onClick={() => onEdit(credIdx)}
            variant="ghost"
            size="xs"
            color="text.secondary"
            _hover={{
              bg: 'bg.active',
              color: 'blue.400',
            }}
          >
            <LuPencil />
          </IconButton>

          {/* Delete */}
          <IconButton
            aria-label={t('Credentials.deleteCredential', 'Delete')}
            title={t('Credentials.deleteCredential', 'Delete')}
            onClick={() => onDelete(credIdx)}
            variant="ghost"
            size="xs"
            color="text.secondary"
            _hover={{
              bg: 'bg.active',
              color: 'red.400',
            }}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      </Flex>

      <Separator borderColor="border.subtle" mb={4} />

      {/* Credential Data Fields List */}
      <VStack align="stretch" gap={3}>
        {item.credData.map((field, fieldIdx) => {
          const isVisible = visibleFields[fieldIdx] || false;
          const isCopied = copiedFieldIdx === fieldIdx;

          return (
            <Box key={fieldIdx}>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.muted"
                mb={1}
              >
                {field.name}
              </Text>
              <Flex
                align="center"
                bg={isCopied ? 'bg.active' : 'bg.card'}
                borderRadius="md"
                justify="space-between"
                border="1px solid"
                borderColor={isCopied ? 'border.focus' : 'border.subtle'}
                transition="all 0.2s ease"
                _hover={{ borderColor: 'border.subtle' }}
              >
                <Text
                  fontSize="sm"
                  fontFamily="mono"
                  color={isVisible ? 'text.primary' : 'text.muted'}
                  lineClamp={1}
                  maxW="70%"
                  userSelect={isVisible ? 'all' : 'none'}
                >
                  {isVisible ? field.value : '••••••••••••'}
                </Text>
                <HStack gap={1}>
                  <IconButton
                    aria-label="Toggle Visibility"
                    onClick={() => toggleVisibility(fieldIdx)}
                    variant="ghost"
                    size="xs"
                    color="text.secondary"
                    _hover={{
                      bg: 'bg.active',
                      color: 'text.primary',
                    }}
                  >
                    {isVisible ? <LuEyeOff /> : <LuEye />}
                  </IconButton>
                  <IconButton
                    aria-label="Copy to Clipboard"
                    onClick={() => handleCopyToClipboard(field.value, fieldIdx)}
                    variant="ghost"
                    size="xs"
                    color={isCopied ? 'emerald.400' : 'text.secondary'}
                    _hover={{
                      bg: 'bg.active',
                      color: 'text.primary',
                    }}
                  >
                    {isCopied ? <LuCheck /> : <LuCopy />}
                  </IconButton>
                </HStack>
              </Flex>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default CredentialCard;
