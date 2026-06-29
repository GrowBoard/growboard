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
  Badge,
} from '@chakra-ui/react';
import {
  LuPlus,
  LuSearch,
  LuX,
  LuLayoutGrid,
  LuList,
  LuBookOpen,
  LuPencil,
  LuTrash2,
} from 'react-icons/lu';
import { useShallow, learningsSelector } from '@selectors';
import { appStore, LearningItem } from '@store';
import {
  useGetLearningsData,
  useSaveLearningData,
  useDeleteLearningData,
} from '@services/hooks/private';
import { useSuccessToast, useErrorToast, EmptyState } from '@components';
import { filterLearnings } from './util';
import {
  LearningCard,
  LearningFormDrawer,
  DeleteConfirmDialog,
  LearningPreviewDialog,
} from './components';

/**
 * LearningsScreen component.
 * Coordinates data queries and mutations targeting learnings (.md files) in Google Drive,
 * maintains local UI dialog/drawer open/close states, view modes, and search query triggers.
 */
export const LearningsScreen = () => {
  const { t } = useTranslation();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  // Zustand Store selector
  const { learningsData } = appStore(useShallow(learningsSelector));


  // Custom service hooks
  const { isLoading } = useGetLearningsData();
  const { mutateAsync: saveLearning, isPending: isSaving } = useSaveLearningData();
  const { mutateAsync: deleteLearning, isPending: isDeleting } = useDeleteLearningData();

  // UI state variables
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<LearningItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // Deletion UI states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItemTitle, setDeleteItemTitle] = useState('');

  // Preview UI states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<LearningItem | null>(null);

  // Filter learnings based on search input
  const filteredLearnings = filterLearnings(learningsData, searchQuery);

  const handleOpenAddForm = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleOpenEditForm = (item: LearningItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleOpenDeleteConfirm = (title: string) => {
    setDeleteItemTitle(title);
    setDeleteOpen(true);
  };

  const handleOpenPreview = (item: LearningItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  // Triggers when form drawer submits
  const handleSave = async (payload: LearningItem) => {
    try {
      const originalTitle = editItem ? editItem.title : undefined;
      await saveLearning({ learning: payload, originalTitle });
      
      successToast(
        editItem
          ? t('Learnings.successEdit', 'Learning updated successfully!')
          : t('Learnings.successAdd', 'Learning added successfully!'),
      );
      setFormOpen(false);
      setEditItem(null);
    } catch (err) {
      console.error('Failed to save learning:', err);
      errorToast(t('Learnings.errorSave', 'Failed to save learning.'));
    }
  };

  // Triggers when delete confirmation executes
  const handleDelete = async () => {
    if (!deleteItemTitle) return;
    try {
      await deleteLearning(deleteItemTitle);
      successToast(t('Learnings.successDelete', 'Learning deleted successfully!'));
      setDeleteOpen(false);
      setDeleteItemTitle('');
    } catch (err) {
      console.error('Failed to delete learning:', err);
      errorToast(t('Learnings.errorSave', 'Failed to delete learning.'));
    }
  };

  const existingTitles = learningsData.map((item) => item.title);

  return (
    <Box h="full" w="100%" p={4}>
      {/* Top Glassmorphic Navigation & Control Bar */}
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
          {t('Learnings.title', 'Learnings')}
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
                'Learnings.searchPlaceholder',
                'Search by title, subtitle, or tags...',
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
            onClick={handleOpenAddForm}
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
            {t('Learnings.addLearning', 'Add Learning')}
          </Button>
        </Flex>
      </Box>

      {/* Main Content Area */}
      {isLoading ? (
        <Flex justify="center" align="center" minH="300px">
          <VStack gap={3}>
            <Spinner size="lg" color="blue.500" />
            <Text color="text.secondary" fontSize="sm">
              Loading your Learnings from Google Drive...
            </Text>
          </VStack>
        </Flex>
      ) : filteredLearnings.length === 0 ? (
        <EmptyState
          title={
            searchQuery
              ? t('Learnings.noSearchResults', 'No matching learnings found.')
              : t('Learnings.noLearnings', 'No learnings found. Click "Add Learning" to create one.')
          }
          buttonText={searchQuery ? undefined : t('Learnings.addLearning', 'Add Learning')}
          onAdd={searchQuery ? undefined : handleOpenAddForm}
        />
      ) : viewMode === 'card' ? (
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={5}
        >
          {filteredLearnings.map((item) => (
            <LearningCard
              key={item.title}
              item={item}
              onEdit={handleOpenEditForm}
              onDelete={handleOpenDeleteConfirm}
              onPreview={handleOpenPreview}
            />
          ))}
        </Grid>
      ) : (
        // List Mode Layout
        <VStack align="stretch" gap={3}>
          {filteredLearnings.map((item) => (
            <Box
              key={item.title}
              p={4}
              bg="bg.card"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="xl"
              transition="all 0.2s"
              _hover={{ borderColor: 'border.focus', bg: 'bg.panel' }}
            >
              <Flex justify="space-between" align="center" gap={4}>
                <VStack align="flex-start" gap={1} overflow="hidden">
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="text.primary"
                    truncate
                    maxW="100%"
                    cursor="pointer"
                    _hover={{ color: 'blue.400' }}
                    onClick={() => handleOpenPreview(item)}
                  >
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text fontSize="xs" color="text.muted" truncate maxW="100%">
                      {item.subtitle}
                    </Text>
                  )}
                </VStack>
                <HStack gap={3}>
                  {item.tags.length > 0 && (
                    <HStack gap={1.5} display={{ base: 'none', md: 'flex' }}>
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          bg="bg.active"
                          color="text.secondary"
                          px={2}
                          py={0.5}
                          borderRadius="md"
                          fontSize="9px"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </HStack>
                  )}
                  <HStack gap={1}>
                    <IconButton
                      aria-label="Preview Learning"
                      size="xs"
                      variant="ghost"
                      color="text.secondary"
                      _hover={{ bg: 'bg.active', color: 'blue.400' }}
                      onClick={() => handleOpenPreview(item)}
                    >
                      <LuBookOpen size={14} />
                    </IconButton>
                    <IconButton
                      aria-label="Edit Learning"
                      size="xs"
                      variant="ghost"
                      color="text.secondary"
                      _hover={{ bg: 'bg.active', color: 'yellow.400' }}
                      onClick={() => handleOpenEditForm(item)}
                    >
                      <LuPencil size={14} />
                    </IconButton>
                    <IconButton
                      aria-label="Delete Learning"
                      size="xs"
                      variant="ghost"
                      color="text.secondary"
                      _hover={{ bg: 'bg.active', color: 'red.400' }}
                      onClick={() => handleOpenDeleteConfirm(item.title)}
                    >
                      <LuTrash2 size={14} />
                    </IconButton>
                  </HStack>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}

      {/* Slide-out Form Drawer */}
      <LearningFormDrawer
        isOpen={formOpen}
        onOpenChange={(e) => setFormOpen(e.open)}
        editItem={editItem}
        onSave={handleSave}
        isSaving={isSaving}
        existingTitles={existingTitles}
      />

      {/* Delete Confirmation Dialogue */}
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onOpenChange={(e) => setDeleteOpen(e.open)}
        itemTitle={deleteItemTitle}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Full Markdown Preview Dialog */}
      <LearningPreviewDialog
        isOpen={previewOpen}
        onOpenChange={(e) => setPreviewOpen(e.open)}
        item={previewItem}
      />
    </Box>
  );
};

export default LearningsScreen;
