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
  Spinner,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useShallow, credsSelector } from '@selectors';
import { appStore } from '@store';
import { CredentialItem } from '@store';
import { useGetCredsData, useSaveCredsData } from '@services/hooks/private';
import { useSuccessToast, useErrorToast, EmptyState } from '@components';
import { LuPlus, LuSearch, LuX, LuLayoutGrid, LuList } from 'react-icons/lu';
import {
  CredentialCard,
  CredentialFormDialog,
  DeleteConfirmDialog,
} from './components';

/**
 * CredsScreen component is the main screen for managing, adding, editing, and deleting credentials.
 * It coordinates data fetching from Google Drive and updates the store accordingly.
 */
const CredsScreen = () => {
  const { t } = useTranslation();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const { credsData } = appStore(useShallow(credsSelector));
  const { isLoading } = useGetCredsData();
  const { mutateAsync: saveCreds, isPending: isSaving } = useSaveCredsData();

  // Local UI Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

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

  // Open add credential form
  const handleOpenAdd = () => {
    setEditIndex(null);
    setFormOpen(true);
  };

  // Open edit credential form
  const handleOpenEdit = (index: number) => {
    setEditIndex(index);
    setFormOpen(true);
  };

  // Open deletion confirm modal
  const handleOpenDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  // Copy card values as .env structure
  const handleCopyCardAsEnv = async (item: CredentialItem) => {
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

  // Save changes from form dialog
  const handleSave = async (newItem: CredentialItem) => {
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

  // Delete credential item
  const handleConfirmDelete = async () => {
    if (deleteIndex === null) return;
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

  const currentEditItem = editIndex !== null ? credsData[editIndex] : null;
  const currentDeleteTitle =
    deleteIndex !== null ? credsData[deleteIndex]?.credTitle || '' : '';

  return (
    <Box h="full" w="100%" p={4}>
      {/* Top Header Section */}
      <Box
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
              border="1px solid"
              borderColor="border.subtle"
              _focus={{
                borderColor: 'border.focus',
                boxShadow: 'none',
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

          {/* View Mode Toggle Slider */}
          <HStack
            position="relative"
            bg="bg.active"
            p="1"
            borderRadius="lg"
            w="100px"
            h="40px"
            gap={0}
            border="1px solid"
            borderColor="border.subtle"
            flexShrink={0}
          >
            {/* Sliding Highlight */}
            <Box
              position="absolute"
              top="3px"
              bottom="3px"
              left={viewMode === 'card' ? '3px' : 'calc(50% + 1px)'}
              w="calc(50% - 4px)"
              bg="blue.600"
              borderRadius="md"
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              shadow="sm"
              zIndex={0}
            />

            {/* Card View Tab */}
            <IconButton
              aria-label="Card View"
              title="Card View"
              onClick={() => setViewMode('card')}
              variant="ghost"
              size="sm"
              w="50%"
              h="full"
              zIndex={1}
              color={viewMode === 'card' ? 'white' : 'text.secondary'}
              _hover={{ bg: 'transparent' }}
              transition="color 0.2s"
            >
              <LuLayoutGrid />
            </IconButton>

            {/* List View Tab */}
            <IconButton
              aria-label="List View"
              title="List View"
              onClick={() => setViewMode('list')}
              variant="ghost"
              size="sm"
              w="50%"
              h="full"
              zIndex={1}
              color={viewMode === 'list' ? 'white' : 'text.secondary'}
              _hover={{ bg: 'transparent' }}
              transition="color 0.2s"
            >
              <LuList />
            </IconButton>
          </HStack>

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
      ) : credsData.length === 0 ? (
        <EmptyState
          title={t('Credentials.noCredentials', 'No credentials found')}
          description={t(
            'Credentials.noCredentialsDesc',
            'Click "Add" to create a new credential.',
          )}
          onAdd={handleOpenAdd}
        />
      ) : filteredCreds.length === 0 ? (
        <EmptyState
          title={t('Credentials.noSearchResults', 'No matching results')}
          description={t(
            'Credentials.noSearchResultsDesc',
            'Try adjusting your search query or clearing the filter.',
          )}
        />
      ) : viewMode === 'list' ? (
        <VStack gap={4} align="stretch">
          {filteredCreds.map((item) => {
            const originalIdx = credsData.indexOf(item);
            return (
              <CredentialCard
                key={originalIdx}
                item={item}
                credIdx={originalIdx}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onCopyAsEnv={handleCopyCardAsEnv}
                viewMode="list"
              />
            );
          })}
        </VStack>
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }}
          gap={6}
        >
          {filteredCreds.map((item) => {
            const originalIdx = credsData.indexOf(item);
            return (
              <CredentialCard
                key={originalIdx}
                item={item}
                credIdx={originalIdx}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onCopyAsEnv={handleCopyCardAsEnv}
                viewMode="card"
              />
            );
          })}
        </Grid>
      )}

      {/* Unified Add / Edit Credential Dialog */}
      <CredentialFormDialog
        isOpen={formOpen}
        onOpenChange={(e) => setFormOpen(e.open)}
        editItem={currentEditItem}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Confirmation Dialog for Deleting a Credential */}
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onOpenChange={(e) => setDeleteOpen(e.open)}
        targetTitle={currentDeleteTitle}
        onConfirm={handleConfirmDelete}
        isSaving={isSaving}
      />
    </Box>
  );
};

export default CredsScreen;
