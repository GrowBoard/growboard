import { useState, useRef } from 'react';
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
import { LuPlus, LuSearch, LuX, LuLayoutGrid, LuList } from 'react-icons/lu';
import { useShallow, goalsSelector } from '@selectors';
import { appStore, GoalItem } from '@store';
import { useGetGoalsData, useSaveGoalData, useDeleteGoalData } from '@services/hooks/private';
import { useSuccessToast, useErrorToast, EmptyState } from '@components';
import { filterGoals } from './util';
import {
  GoalCard,
  GoalFormDialog,
  DeleteConfirmDialog,
} from './components';

/**
 * GoalsScreen component.
 * Coordinates data query flows with Google Drive, maintains screen local dialogs,
 * view toggles, search filters, and triggers saving/deletion mutations.
 */
export const GoalsScreen = () => {
  const { t } = useTranslation();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  // Zustand Store Selectors
  const { goalsData, updateGoals } = appStore(useShallow(goalsSelector));

  // Service Hook Queries/Mutations
  const { isLoading } = useGetGoalsData();
  const { mutateAsync: saveGoal, isPending: isSaving } = useSaveGoalData();
  const { mutateAsync: deleteGoal, isPending: isDeleting } = useDeleteGoalData();

  // Local UI States
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<GoalItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItemTitle, setDeleteItemTitle] = useState('');

  // Drag and Drop States
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const draggedIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (searchQuery.trim() !== '') return;
    setDraggedIndex(index);
    draggedIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const sourceIndex = draggedIndexRef.current;
    if (sourceIndex === null || sourceIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    draggedIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = draggedIndexRef.current;
    if (sourceIndex === null || sourceIndex === targetIndex) {
      setDraggedIndex(null);
      draggedIndexRef.current = null;
      setDragOverIndex(null);
      return;
    }

    // Backup current goals data for reversion if operation fails
    const backupGoals = [...goalsData];

    // Reorder goals list based on visual positions in filteredGoals
    const updatedGoals = [...filteredGoals];
    const [draggedItem] = updatedGoals.splice(sourceIndex, 1);
    updatedGoals.splice(targetIndex, 0, draggedItem);

    // Map new rankings and update the list
    const newGoalsList = updatedGoals.map((goal, idx) => ({
      ...goal,
      ranking: idx + 1,
    }));

    // Optimistically update store state to immediately update UI and rankings
    updateGoals(newGoalsList);

    // Update rankings in Google Drive
    const rankingPromises = newGoalsList.map((goal) => {
      // Find the old goal in the backup to see if its rank actually changed
      const oldGoal = backupGoals.find((g) => g.title === goal.title);
      if (!oldGoal || oldGoal.ranking !== goal.ranking) {
        return saveGoal(goal);
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(rankingPromises);
      successToast(t('Goals.reorderSuccess', 'Goal rankings updated successfully!'));
    } catch (err: unknown) {
      const error = err as Error;
      // Revert store state on failure
      updateGoals(backupGoals);
      errorToast(
        t('Goals.reorderError', 'Failed to update rankings, reverting changes: {{message}}', {
          message: error.message || error,
        }),
      );
    }

    setDraggedIndex(null);
    draggedIndexRef.current = null;
    setDragOverIndex(null);
  };

  // Filter goals list based on search query
  const filteredGoals = filterGoals(goalsData, searchQuery);

  // Open add goal form dialog
  const handleOpenAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  // Open edit goal form dialog
  const handleOpenEdit = (title: string) => {
    const goal = goalsData.find((g) => g.title === title);
    if (goal) {
      setEditItem(goal);
      setFormOpen(true);
    }
  };

  // Open delete confirm dialog
  const handleOpenDelete = (title: string) => {
    setDeleteItemTitle(title);
    setDeleteOpen(true);
  };

  // Save changes from form dialog
  const handleSave = async (payload: GoalItem) => {
    try {
      await saveGoal(payload);
      successToast(
        editItem
          ? t('Goals.successEdit', 'Goal updated successfully!')
          : t('Goals.successAdd', 'Goal added successfully!'),
      );
      setFormOpen(false);
    } catch (e) {
      console.error(e);
      errorToast(t('Goals.errorSave', 'Failed to save goal.'));
    }
  };

  // Confirm and execute goal deletion
  const handleConfirmDelete = async () => {
    if (!deleteItemTitle) return;
    try {
      await deleteGoal(deleteItemTitle);
      successToast(t('Goals.successDelete', 'Goal deleted successfully!'));
      setDeleteOpen(false);
      setDeleteItemTitle('');
    } catch (e) {
      console.error(e);
      errorToast(t('Goals.errorDelete', 'Failed to delete goal.'));
    }
  };

  const existingTitles = goalsData.map((g) => g.title);

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
          {t('Goals.title', 'Goals')}
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
              placeholder={t('Goals.searchPlaceholder', 'Search goals, tags...')}
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
            w={{ base: 'full', sm: 'auto' }}
          >
            <LuPlus />
            {t('Goals.addBtn', 'Add Goal')}
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
      ) : goalsData.length === 0 ? (
        <EmptyState
          title={t('Goals.noGoals', 'No goals found')}
          description={t(
            'Goals.noGoalsDesc',
            'Click "Add Goal" to create your first goal.',
          )}
          buttonText={t('Goals.addBtn', 'Add Goal')}
          onAdd={handleOpenAdd}
        />
      ) : filteredGoals.length === 0 ? (
        <EmptyState
          title={t('Goals.noSearchResults', 'No matching results')}
          description={t(
            'Goals.noSearchResultsDesc',
            'Try adjusting your search query or clearing the filter.',
          )}
        />
      ) : viewMode === 'list' ? (
        <VStack gap={4} align="stretch">
          {filteredGoals.map((item, index) => (
            <GoalCard
              key={item.title}
              item={item}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              viewMode="list"
              isDraggable={searchQuery.trim() === ''}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              isDragOver={dragOverIndex === index}
              isDragged={draggedIndex === index}
            />
          ))}
        </VStack>
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }}
          gap={6}
        >
          {filteredGoals.map((item, index) => (
            <GoalCard
              key={item.title}
              item={item}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              viewMode="card"
              isDraggable={searchQuery.trim() === ''}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              isDragOver={dragOverIndex === index}
              isDragged={draggedIndex === index}
            />
          ))}
        </Grid>
      )}

      {/* Goal Add/Edit Form Dialog */}
      <GoalFormDialog
        isOpen={formOpen}
        onOpenChange={(e) => setFormOpen(e.open)}
        editItem={editItem}
        onSave={handleSave}
        isSaving={isSaving}
        existingTitles={existingTitles}
      />

      {/* Delete Goal Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onOpenChange={(e) => setDeleteOpen(e.open)}
        targetTitle={deleteItemTitle}
        onConfirm={handleConfirmDelete}
        isSaving={isDeleting}
      />
    </Box>
  );
};

export default GoalsScreen;
