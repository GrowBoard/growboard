import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Button,
  Grid,
  Input,
  Spinner,
  Text,
  HStack,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import { useShallow, plansSelector } from '@selectors';
import { appStore, PlanItem } from '@store';
import {
  useGetPlansData,
  useSavePlanData,
  useDeletePlanData,
} from '@services/hooks/private';
import { useSuccessToast, useErrorToast, EmptyState } from '@components';
import { LuPlus, LuSearch, LuLayoutGrid, LuList } from 'react-icons/lu';
import {
  PlanCard,
  PlanFormDrawer,
  PlanAboutDrawer,
  DeleteConfirmDialog,
} from './components';

/**
 * PlansScreen component coordinates plans data fetching from Google Sheets
 * and coordinates adding/editing/deleting/viewing flows.
 */
const PlansScreen = () => {
  const { t } = useTranslation();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const { plansData } = appStore(useShallow(plansSelector));
  const { isLoading } = useGetPlansData();
  const { mutateAsync: savePlan, isPending: isSaving } = useSavePlanData();
  const { mutateAsync: deletePlan } = useDeletePlanData();

  // Local UI State
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<PlanItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // Detail viewing Drawer state
  const [viewAboutOpen, setViewAboutOpen] = useState(false);
  const [viewAboutItem, setViewAboutItem] = useState<PlanItem | null>(null);

  // Filter plans list based on search query
  const filteredPlans = plansData.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
      item.tags.some((t) => t.toLowerCase().includes(query)) ||
      (item.about_plan && item.about_plan.toLowerCase().includes(query))
    );
  });

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (item: PlanItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleOpenViewAbout = (item: PlanItem) => {
    setViewAboutItem(item);
    setViewAboutOpen(true);
  };

  const handleSave = async (newPlan: Omit<PlanItem, 'Id'> & { Id?: string }) => {
    try {
      await savePlan(newPlan);
      successToast(
        newPlan.Id
          ? t('Plans.successEdit', 'Plan updated successfully!')
          : t('Plans.successAdd', 'Plan added successfully!'),
      );
      setFormOpen(false);
      setEditItem(null);
    } catch (e) {
      console.error(e);
      errorToast(t('Plans.errorSave', 'Failed to save plan.'));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePlan(deleteId);
      successToast(t('Plans.successDelete', 'Plan deleted successfully!'));
      setDeleteOpen(false);
      setDeleteId(null);
    } catch (e) {
      console.error(e);
      errorToast(t('Plans.errorSave', 'Failed to save plan.'));
    }
  };

  const currentDeleteTitle =
    deleteId !== null
      ? plansData.find((r) => r.Id === deleteId)?.title || ''
      : '';

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
          {t('Plans.title', 'Plans')}
        </Box>

        <Flex
          gap={3}
          w={{ base: '100%', md: 'auto' }}
          flexGrow={{ md: 1 }}
          maxW={{ md: '620px' }}
          justify="flex-end"
          align="center"
        >
          {/* Search Box */}
          <Box position="relative" w="100%">
            <Input
              placeholder={t(
                'Plans.searchPlaceholder',
                'Search plans by title, tags, about...',
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
              pointerEvents="none"
            >
              <LuSearch size={18} />
            </Box>
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

          {/* Add Plan Button */}
          <Button
            onClick={handleOpenAdd}
            aria-label="Add Plan"
            bg="blue.600"
            color="white"
            borderRadius="lg"
            fontWeight="semibold"
            h="40px"
            px={4}
            shadow="md"
            transition="all 0.2s"
            _hover={{
              bg: 'blue.500',
              transform: 'translateY(-1px)',
            }}
            _active={{
              bg: 'blue.700',
              transform: 'translateY(0)',
            }}
            display="flex"
            alignItems="center"
            gap={2}
            flexShrink={0}
          >
            <LuPlus size={16} />
            <Text display={{ base: 'none', sm: 'inline' }}>
              {t('Plans.addPlan', 'Add Plan')}
            </Text>
          </Button>
        </Flex>
      </Box>

      {/* Main Content Area */}
      {isLoading ? (
        <Flex justify="center" align="center" h="50vh" w="100%">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : filteredPlans.length === 0 ? (
        <EmptyState
          title={
            searchQuery
              ? t('Plans.noResults', 'No matching plans')
              : t('Plans.noPlans', 'No plans found')
          }
          description={
            searchQuery
              ? t('Plans.noResultsDesc', 'Try adjusting your search terms.')
              : t('Plans.noPlansDesc', 'Add your first plan using the button above.')
          }
        />
      ) : viewMode === 'list' ? (
        <VStack gap={4} align="stretch" pb={8}>
          {filteredPlans.map((item, idx) => (
            <PlanCard
              key={item.Id}
              item={item}
              planIdx={idx}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onViewAbout={handleOpenViewAbout}
              viewMode="list"
            />
          ))}
        </VStack>
      ) : (
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          gap={6}
          pb={8}
        >
          {filteredPlans.map((item, idx) => (
            <PlanCard
              key={item.Id}
              item={item}
              planIdx={idx}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onViewAbout={handleOpenViewAbout}
              viewMode="card"
            />
          ))}
        </Grid>
      )}

      {/* Add / Edit Form Drawer */}
      <PlanFormDrawer
        isOpen={formOpen}
        onOpenChange={(details: { open: boolean }) => setFormOpen(details.open)}
        editItem={editItem}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onOpenChange={(details: { open: boolean }) => setDeleteOpen(details.open)}
        title={currentDeleteTitle}
        onConfirm={handleConfirmDelete}
      />

      {/* Details Preview Drawer */}
      <PlanAboutDrawer
        isOpen={viewAboutOpen}
        onOpenChange={(details: { open: boolean }) => setViewAboutOpen(details.open)}
        item={viewAboutItem}
      />
    </Box>
  );
};

export default PlansScreen;
export { PlansScreen };
