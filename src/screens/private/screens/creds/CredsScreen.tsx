import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Button,
  Grid,
  Text,
  Input,
  IconButton,
  VStack,
  HStack,
  Separator,
  Spinner,
} from '@chakra-ui/react';
import { useShallow, credsSelector } from '@selectors';
import { appStore } from '@store';
import { CredentialItem, CredentialField } from '@store';
import { useGetCredsData, useSaveCredsData } from '@services/hooks/private';
import { useSuccessToast, useErrorToast, DialogContainer } from '@components';
import {
  LuPlus,
  LuTrash2,
  LuPencil,
  LuSearch,
  LuEye,
  LuEyeOff,
  LuCopy,
  LuCheck,
  LuX,
} from 'react-icons/lu';

// Empty state component for when no credentials exist
import { EmptyState } from '@components';

const CredsScreen = () => {
  const { t } = useTranslation();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const { credsData } = appStore(useShallow(credsSelector));
  const { isLoading } = useGetCredsData();
  const { mutateAsync: saveCreds, isPending: isSaving } = useSaveCredsData();

  // Local component UI States
  const [formOpen, setFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formFields, setFormFields] = useState<CredentialField[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  // Visibility state for individual credentials fields (masked vs visible)
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(
    {},
  );
  // Copied indicator state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleVisibility = (credIdx: number, fieldIdx: number) => {
    const key = `${credIdx}-${fieldIdx}`;
    setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCardVisibility = (credIdx: number, item: CredentialItem) => {
    const allVisible = item.credData.every(
      (_, fieldIdx) => visibleFields[`${credIdx}-${fieldIdx}`],
    );
    const newState = !allVisible;
    setVisibleFields((prev) => {
      const updated = { ...prev };
      item.credData.forEach((_, fieldIdx) => {
        updated[`${credIdx}-${fieldIdx}`] = newState;
      });
      return updated;
    });
  };

  const isCardAllVisible = (credIdx: number, item: CredentialItem) => {
    return item.credData.every(
      (_, fieldIdx) => visibleFields[`${credIdx}-${fieldIdx}`],
    );
  };

  const handleCopyCardAsEnv = async (item: CredentialItem, credIdx: number) => {
    const envString = item.credData
      .map((field) => {
        const envKey = field.name
          .replace(/[^a-zA-Z0-9_]/g, '')
          .replace(/\s+/g, '_')
          .toUpperCase();
        return `${envKey || 'FIELD'}=${field.value}`;
      })
      .join('\n');
    try {
      await navigator.clipboard.writeText(envString);
      successToast(
        t('Credentials.copiedEnv', 'Copied all fields as .env format!'),
      );
    } catch (err) {
      console.error('Failed to copy card as env', err);
      errorToast(t('Credentials.copyFailed', 'Failed to copy fields.'));
    }
  };

  const applyPreset = (type: 'login' | 'database' | 'apikey' | 'ssh') => {
    let fields: CredentialField[] = [];
    switch (type) {
      case 'login':
        fields = [
          { name: 'URL', value: '' },
          { name: 'Username', value: '' },
          { name: 'Password', value: '' },
        ];
        break;
      case 'database':
        fields = [
          { name: 'Host', value: '' },
          { name: 'Port', value: '' },
          { name: 'Database', value: '' },
          { name: 'Username', value: '' },
          { name: 'Password', value: '' },
        ];
        break;
      case 'apikey':
        fields = [
          { name: 'API Key', value: '' },
          { name: 'Endpoint', value: '' },
        ];
        break;
      case 'ssh':
        fields = [
          { name: 'Host', value: '' },
          { name: 'Username', value: '' },
          { name: 'Private Key', value: '' },
        ];
        break;
    }
    setFormFields(fields);
  };

  const handleCopyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  // Filter credentials list based on search query
  const filteredCreds = credsData.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    if (item.credTitle.toLowerCase().includes(query)) return true;
    return item.credData.some(
      (field) =>
        field.name.toLowerCase().includes(query) ||
        field.value.toLowerCase().includes(query),
    );
  });

  // Add / Edit Form Actions
  const handleOpenAdd = () => {
    setEditIndex(null);
    setFormTitle('');
    setFormFields([{ name: '', value: '' }]);
    setFormOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    const item = credsData[index];
    setEditIndex(index);
    setFormTitle(item.credTitle);
    setFormFields(item.credData.map((f) => ({ ...f })));
    setFormOpen(true);
  };

  const handleAddFieldRow = () => {
    setFormFields([...formFields, { name: '', value: '' }]);
  };

  const handleRemoveFieldRow = (idx: number) => {
    setFormFields(formFields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (
    idx: number,
    key: 'name' | 'value',
    val: string,
  ) => {
    const updated = [...formFields];
    updated[idx][key] = val;
    setFormFields(updated);
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      errorToast(t('SignUpError.nameRequired', 'Title is required!'));
      return;
    }

    const validFields = formFields.filter((f) => f.name.trim() !== '');
    if (validFields.length === 0) {
      errorToast(
        t('Credentials.nameLabel', 'At least one field name is required.'),
      );
      return;
    }

    const newItem: CredentialItem = {
      credTitle: formTitle.trim(),
      credData: validFields.map((f) => ({
        name: f.name.trim(),
        value: f.value,
      })),
    };

    const updatedList = [...credsData];
    if (editIndex !== null) {
      updatedList[editIndex] = newItem;
    } else {
      updatedList.push(newItem);
    }

    try {
      await saveCreds(updatedList);
      successToast(
        editIndex !== null
          ? t('Credentials.successEdit', 'Credential updated successfully!')
          : t('Credentials.successAdd', 'Credential added successfully!'),
      );
      setFormOpen(false);
    } catch (e) {
      console.error(e);
      errorToast(t('Credentials.errorSave', 'Failed to save credentials.'));
    }
  };

  // Delete Action Flow
  const handleOpenDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteConfirmInput('');
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteIndex === null) return;
    const targetItem = credsData[deleteIndex];
    if (deleteConfirmInput !== targetItem.credTitle) {
      return;
    }

    const updatedList = credsData.filter((_, i) => i !== deleteIndex);
    try {
      await saveCreds(updatedList);
      successToast(
        t('Credentials.successDelete', 'Credential deleted successfully!'),
      );
      setDeleteOpen(false);
      setDeleteIndex(null);
    } catch (e) {
      console.error(e);
      errorToast(t('Credentials.errorSave', 'Failed to save credentials.'));
    }
  };

  // Define colors for the dynamic colored top border of cards to give a gorgeous look
  const accentColors = [
    'blue.500',
    'teal.500',
    'purple.500',
    'emerald.500',
    'pink.500',
    'orange.500',
  ];

  return (
    <Box h="full" w="100%" p={4}>
      {/* Top Header Section */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="bg.glass"
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor="border.subtle"
        p={4}
        borderRadius="xl"
        shadow="md"
        mb={6}
        gap={4}
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box fontSize="2xl" fontWeight="bold" color="text.primary">
          {t('Credentials.title', 'Credentials')}
        </Box>

        <Flex
          gap={3}
          w={{ base: '100%', md: 'auto' }}
          flexGrow={{ md: 1 }}
          maxW={{ md: '500px' }}
          justify="flex-end"
          align="center"
        >
          {/* Search Box */}
          <Box position="relative" w="100%">
            <Input
              placeholder={t(
                'Credentials.searchPlaceholder',
                'Search by title or field...',
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="bg.card"
              borderColor="border.subtle"
              _focus={{
                borderColor: 'border.focus',
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)',
              }}
              borderRadius="lg"
              color="text.primary"
              pl="10"
              size="md"
            />
            <Box
              position="absolute"
              left="3"
              top="50%"
              transform="translateY(-50%)"
              color="text.muted"
              display="flex"
              alignItems="center"
            >
              <LuSearch />
            </Box>
            {searchQuery && (
              <IconButton
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                variant="ghost"
                size="xs"
                position="absolute"
                right="3"
                top="50%"
                transform="translateY(-50%)"
                color="text.muted"
                _hover={{ color: 'text.primary' }}
              >
                <LuX />
              </IconButton>
            )}
          </Box>

          <Button
            onClick={handleOpenAdd}
            bg="blue.600"
            color="white"
            size="md"
            fontWeight="semibold"
            _hover={{
              bg: 'blue.500',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
            }}
            _active={{ bg: 'blue.700' }}
            borderRadius="lg"
            gap={2}
            px={5}
            flexShrink={0}
          >
            <LuPlus />
            {t('Credentials.addCredential', 'Add')}
          </Button>
        </Flex>
      </Box>

      {/* Main Content Area */}
      {isLoading ? (
        <Flex
          justify="center"
          align="center"
          minH="200px"
          direction="column"
          gap={3}
        >
          <Spinner size="lg" color="blue.500" />
          <Text color="text.secondary">
            {t('PrivateScreen.loading', 'Loading data from Google Drive...')}
          </Text>
        </Flex>
      ) : filteredCreds.length === 0 ? (
        <EmptyState
          title={t('Credentials.noCredentials', 'No credentials found')}
          description={t(
            'Credentials.noCredentialsDesc',
            'Click "Add" to create a new credential.',
          )}
          onAdd={handleOpenAdd}
        />
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }}
          gap={6}
        >
          {filteredCreds.map((item, credIdx) => {
            const cardAccentColor = accentColors[credIdx % accentColors.length];
            return (
              <Box
                key={credIdx}
                bg="bg.card"
                backdropFilter="blur(16px)"
                border="1px solid"
                borderColor="border.subtle"
                borderTop="3px solid"
                borderTopColor={cardAccentColor}
                borderRadius="xl"
                p={5}
                shadow="2xl"
                position="relative"
                _hover={{
                  borderColor: 'border.focus',
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 30px rgba(0, 0, 0, 0.3)`,
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
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
                        isCardAllVisible(credIdx, item)
                          ? t('Credentials.hideAll', 'Hide All')
                          : t('Credentials.revealAll', 'Reveal All')
                      }
                      onClick={() => toggleCardVisibility(credIdx, item)}
                      variant="ghost"
                      size="xs"
                      color="text.secondary"
                      _hover={{
                        bg: 'bg.active',
                        color: cardAccentColor,
                      }}
                    >
                      {isCardAllVisible(credIdx, item) ? (
                        <LuEyeOff />
                      ) : (
                        <LuEye />
                      )}
                    </IconButton>

                    {/* Copy All as .env */}
                    <IconButton
                      aria-label="Copy all as env"
                      title={t('Credentials.copyAllEnv', 'Copy all as .env')}
                      onClick={() => handleCopyCardAsEnv(item, credIdx)}
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
                      onClick={() => handleOpenEdit(credIdx)}
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
                      onClick={() => handleOpenDelete(credIdx)}
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
                    const fieldKey = `${credIdx}-${fieldIdx}`;
                    const isVisible = visibleFields[fieldKey] || false;
                    const isCopied = copiedKey === fieldKey;

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
                          px={3}
                          py={2}
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
                              onClick={() =>
                                toggleVisibility(credIdx, fieldIdx)
                              }
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
                              onClick={() =>
                                handleCopyToClipboard(field.value, fieldKey)
                              }
                              variant="ghost"
                              size="xs"
                              color={
                                isCopied ? 'emerald.400' : 'text.secondary'
                              }
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
          })}
        </Grid>
      )}

      {/* Unified Add / Edit Credential Dialog */}
      <DialogContainer
        isOpen={formOpen}
        onOpenChange={(e: { open: boolean }) => setFormOpen(e.open)}
        title={
          editIndex !== null
            ? t('Credentials.editCredential', 'Edit Credential')
            : t('Credentials.addCredential', 'Add Credential')
        }
        maxW="lg"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              borderColor="border.subtle"
              color="text.secondary"
              _hover={{ bg: 'bg.active' }}
              onClick={() => setFormOpen(false)}
            >
              {t('Credentials.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleSave}
              bg="blue.600"
              color="white"
              size="sm"
              fontWeight="semibold"
              _hover={{ bg: 'blue.500' }}
              loading={isSaving}
            >
              {t('Credentials.save', 'Save')}
            </Button>
          </>
        }
      >
        <VStack align="stretch" gap={4}>
          {/* Credential Title Input */}
          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="text.secondary"
              mb={2}
            >
              {t('Credentials.credTitleLabel', 'Credential Title')}
            </Text>
            <Input
              placeholder={t(
                'Credentials.credTitlePlaceholder',
                'e.g. Server Credentials',
              )}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              bg="bg.card"
              borderColor="border.subtle"
              _focus={{
                borderColor: 'border.focus',
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.2)',
              }}
              borderRadius="md"
              color="text.primary"
            />
          </Box>

          {/* Quick Start Presets */}
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="text.muted" mb={2}>
              {t(
                'Credentials.presetsLabel',
                'Or Quick Start with a Preset Template:',
              )}
            </Text>
            <HStack gap={2} flexWrap="wrap">
              {[
                {
                  type: 'login',
                  label: 'Login (URL/User/Pass)',
                  color: 'blue',
                },
                { type: 'database', label: 'Database Config', color: 'green' },
                {
                  type: 'apikey',
                  label: 'API Key / Endpoint',
                  color: 'purple',
                },
                { type: 'ssh', label: 'SSH Server', color: 'orange' },
              ].map((preset) => (
                <Button
                  key={preset.type}
                  size="xs"
                  variant="outline"
                  borderColor={`${preset.color}.500/30`}
                  color={`${preset.color}.300`}
                  bg={`${preset.color}.500/5`}
                  _hover={{
                    bg: `${preset.color}.500/15`,
                    borderColor: `${preset.color}.500`,
                  }}
                  onClick={() => applyPreset(preset.type as any)}
                  borderRadius="md"
                  px={3}
                  py={2.5}
                >
                  {preset.label}
                </Button>
              ))}
            </HStack>
          </Box>

          <Separator borderColor="border.subtle" my={2} />

          <Flex justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="bold" color="text.secondary">
              Attributes / Fields
            </Text>
            <Button
              onClick={handleAddFieldRow}
              variant="ghost"
              size="xs"
              color="blue.400"
              _hover={{ bg: 'bg.active' }}
              gap={1}
            >
              <LuPlus />
              {t('Credentials.addPair', 'Add Row')}
            </Button>
          </Flex>

          {/* Dynamic Fields List */}
          <Box maxH="250px" overflowY="auto" pr={1}>
            <VStack align="stretch" gap={3}>
              {formFields.map((field, idx) => (
                <HStack key={idx} align="center" gap={2}>
                  <Input
                    placeholder={t('Credentials.nameLabel', 'Name (e.g. host)')}
                    value={field.name}
                    onChange={(e) =>
                      handleFieldChange(idx, 'name', e.target.value)
                    }
                    bg="bg.card"
                    borderColor="border.subtle"
                    _focus={{ borderColor: 'border.focus' }}
                    borderRadius="md"
                    color="text.primary"
                    size="sm"
                    w="40%"
                  />
                  <Input
                    placeholder={t('Credentials.valueLabel', 'Value')}
                    value={field.value}
                    onChange={(e) =>
                      handleFieldChange(idx, 'value', e.target.value)
                    }
                    bg="bg.card"
                    borderColor="border.subtle"
                    _focus={{ borderColor: 'border.focus' }}
                    borderRadius="md"
                    color="text.primary"
                    size="sm"
                    w="50%"
                  />
                  <IconButton
                    aria-label={t('Credentials.deletePair', 'Delete Row')}
                    onClick={() => handleRemoveFieldRow(idx)}
                    variant="ghost"
                    size="sm"
                    color="red.400"
                    disabled={formFields.length === 1}
                    _hover={{ bg: 'bg.active' }}
                  >
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </DialogContainer>

      {/* Confirmation Dialog for Deleting a Credential */}
      <DialogContainer
        isOpen={deleteOpen}
        onOpenChange={(e: { open: boolean }) => setDeleteOpen(e.open)}
        role="alertdialog"
        maxW="md"
        title={
          <Text color="red.400">
            {t('Credentials.deleteConfirmTitle', 'Confirm Deletion')}
          </Text>
        }
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              borderColor="border.subtle"
              color="text.secondary"
              _hover={{ bg: 'bg.active' }}
              onClick={() => setDeleteOpen(false)}
            >
              {t('Credentials.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              bg="red.600"
              color="white"
              size="sm"
              fontWeight="semibold"
              _hover={{
                bg: 'red.500',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
              }}
              _active={{ bg: 'red.700' }}
              loading={isSaving}
              disabled={
                deleteIndex === null ||
                deleteConfirmInput !== credsData[deleteIndex]?.credTitle
              }
            >
              {t('Credentials.delete', 'Delete')}
            </Button>
          </>
        }
      >
        <VStack align="stretch" gap={4}>
          <Text fontSize="sm" color="text.secondary">
            {t('Credentials.deleteConfirmDesc', {
              title:
                deleteIndex !== null ? credsData[deleteIndex]?.credTitle : '',
              defaultValue: `Are you sure you want to delete this credential? This action cannot be undone.`,
            })}
          </Text>

          <Box>
            <Text fontSize="xs" fontWeight="semibold" color="red.300" mb={2}>
              {t('Credentials.deleteConfirmInstruction', {
                title:
                  deleteIndex !== null ? credsData[deleteIndex]?.credTitle : '',
                defaultValue: 'Type the credential title to confirm:',
              })}
            </Text>
            <Input
              placeholder={t(
                'Credentials.deleteConfirmInputPlaceholder',
                'Type title here',
              )}
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              bg="bg.card"
              borderColor="border.subtle"
              _focus={{ borderColor: 'red.500' }}
              borderRadius="md"
              color="text.primary"
            />
          </Box>
        </VStack>
      </DialogContainer>
    </Box>
  );
};

export default CredsScreen;
