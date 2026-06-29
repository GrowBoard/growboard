import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Text,
  Field,
  IconButton,
  Badge,
  Box,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react';
import { LuPlus, LuTrash, LuX } from 'react-icons/lu';
import { useForm } from '@tanstack/react-form';
import { DialogContainer } from '@components';
import { GoalItem } from '@store';
import { GoalFormDialogProps } from './types';
import {
  MAX_TITLE_LENGTH,
  MAX_TAGS,
  MAX_TAG_LENGTH,
  MAX_TIMELINE_ENTRIES,
  MAX_TIMELINE_ENTRY_LENGTH,
} from '../const';

interface GoalFormValues {
  title: string;
  subtitle: string;
  details: string;
  tags: string[];
  timeline: string[];
  status: 'Pending' | 'In-Progress' | 'Completed';
  ranking: string;
}

const defaultValues: GoalFormValues = {
  title: '',
  subtitle: '',
  details: '',
  tags: [],
  timeline: [''],
  status: 'Pending',
  ranking: '',
};

/**
 * GoalFormDialog renders the form modal for adding or editing a goal.
 * Uses TanStack Form for schema validation and state management.
 */
export const GoalFormDialog = ({
  isOpen,
  onOpenChange,
  editItem,
  onSave,
  isSaving,
  existingTitles,
}: GoalFormDialogProps) => {
  const { t } = useTranslation();

  // Helper local state for tag input text
  const [tagInput, setTagInput] = useState('');

  // Initialize TanStack Form
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Filter out blank timeline milestones
      const cleanTimeline = value.timeline
        .map((item) => item.trim())
        .filter((item) => item !== '');

      // Parse ranking if populated
      let parsedRanking: number | undefined = undefined;
      if (value.ranking.trim()) {
        parsedRanking = Number(value.ranking.trim());
      }

      const now = new Date().toISOString();
      const payload: GoalItem = {
        title: value.title.trim(),
        subtitle: value.subtitle.trim(),
        tags: value.tags,
        details: value.details.trim(),
        timeline: cleanTimeline,
        status: value.status,
        ranking: parsedRanking,
        createdAt: editItem ? editItem.createdAt : now,
        updatedAt: now,
      };

      await onSave(payload);
    },
  });

  // Reset form when dialog opens or changes editItem
  useEffect(() => {
    if (isOpen) {
      form.reset(
        editItem
          ? {
              title: editItem.title,
              subtitle: editItem.subtitle,
              details: editItem.details,
              tags: [...editItem.tags],
              timeline:
                editItem.timeline.length > 0 ? [...editItem.timeline] : [''],
              status: editItem.status || 'Pending',
              ranking: editItem.ranking ? editItem.ranking.toString() : '',
            }
          : defaultValues,
      );
      setTagInput('');
    }
  }, [isOpen, editItem, form]);

  // Handle Dynamic Tag addition
  const handleAddTag = (
    currentTags: string[],
    handleChange: (val: string[]) => void,
  ) => {
    const cleanTag = tagInput.trim();
    if (!cleanTag) return;

    if (cleanTag.length > MAX_TAG_LENGTH) return;
    if (currentTags.includes(cleanTag)) {
      setTagInput('');
      return;
    }
    if (currentTags.length >= MAX_TAGS) return;

    handleChange([...currentTags, cleanTag]);
    setTagInput('');
  };

  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentTags: string[],
    handleChange: (val: string[]) => void,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(currentTags, handleChange);
    }
  };

  const handleRemoveTag = (
    tagToRemove: string,
    currentTags: string[],
    handleChange: (val: string[]) => void,
  ) => {
    handleChange(currentTags.filter((tag) => tag !== tagToRemove));
  };

  // Handle Dynamic Timeline rows
  const handleAddTimelineRow = (
    currentTimeline: string[],
    handleChange: (val: string[]) => void,
  ) => {
    if (currentTimeline.length >= MAX_TIMELINE_ENTRIES) return;
    handleChange([...currentTimeline, '']);
  };

  const handleRemoveTimelineRow = (
    idx: number,
    currentTimeline: string[],
    handleChange: (val: string[]) => void,
  ) => {
    handleChange(currentTimeline.filter((_, i) => i !== idx));
  };

  const handleTimelineChange = (
    idx: number,
    val: string,
    currentTimeline: string[],
    handleChange: (val: string[]) => void,
  ) => {
    const updated = [...currentTimeline];
    updated[idx] = val;
    handleChange(updated);
  };

  const isEditMode = editItem !== null;

  return (
    <DialogContainer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={
        isEditMode
          ? t('Goals.editTitle', 'Edit Goal')
          : t('Goals.addTitle', 'Add Goal')
      }
      maxW="xl"
      footer={
        <HStack gap={4} justify="flex-end" w="full">
          <Button
            variant="ghost"
            onClick={() => onOpenChange({ open: false })}
            disabled={isSaving}
            color="text.secondary"
            borderRadius="lg"
            px={5}
            _hover={{ bg: 'bg.active' }}
          >
            {t('Goals.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={() => form.handleSubmit()}
            loading={isSaving}
            bg="blue.600"
            color="white"
            fontWeight="bold"
            px={6}
            shadow="lg"
            transition="all 0.2s"
            _hover={{
              bg: 'blue.500',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
            }}
            _active={{ bg: 'blue.700', transform: 'translateY(0)' }}
            borderRadius="lg"
          >
            {t('Goals.save', 'Save')}
          </Button>
        </HStack>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <VStack gap={4} align="stretch" py={2}>
          {/* Title */}
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) {
                  return t(
                    'Goals.validationTitleRequired',
                    'Title is required.',
                  );
                }
                if (value.trim().length > MAX_TITLE_LENGTH) {
                  return t(
                    'Goals.validationTitleLength',
                    'Title is too long (max 100 characters).',
                  );
                }
                if (
                  !isEditMode &&
                  existingTitles.some(
                    (t) => t.toLowerCase() === value.trim().toLowerCase(),
                  )
                ) {
                  return t(
                    'Goals.validationTitleUnique',
                    'A goal with this title already exists.',
                  );
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <Field.Root invalid={!!field.state.meta.errors.length}>
                <Field.Label fontWeight="semibold" color="text.primary">
                  {t('Goals.labelTitle', 'Goal Title')}
                </Field.Label>
                <Input
                  placeholder={t(
                    'Goals.placeholderTitle',
                    'e.g. Learn System Design',
                  )}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSaving || isEditMode} // Cannot edit title to ensure unique file key integrity
                  maxLength={MAX_TITLE_LENGTH}
                  border="1px solid"
                  borderColor={
                    field.state.meta.errors.length ? 'red.500' : 'border.subtle'
                  }
                  px={3}
                  borderRadius="lg"
                  _focus={{ borderColor: 'border.focus', boxShadow: 'none' }}
                />
                {field.state.meta.errors.length > 0 && (
                  <Field.ErrorText>
                    {field.state.meta.errors.join(', ')}
                  </Field.ErrorText>
                )}
              </Field.Root>
            )}
          </form.Field>

          {/* Subtitle */}
          <form.Field name="subtitle">
            {(field) => (
              <Field.Root>
                <Field.Label fontWeight="semibold" color="text.primary">
                  {t('Goals.labelSubtitle', 'Subtitle / Short Pitch')}
                </Field.Label>
                <Input
                  placeholder={t(
                    'Goals.placeholderSubtitle',
                    'e.g. Master high-level architecture principles',
                  )}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSaving}
                  border="1px solid"
                  borderColor="border.subtle"
                  px={3}
                  borderRadius="lg"
                  _focus={{ borderColor: 'border.focus', boxShadow: 'none' }}
                />
              </Field.Root>
            )}
          </form.Field>

          {/* Status and Rank */}
          <HStack gap={4} w="full" align="flex-start">
            <form.Field name="status">
              {(field) => (
                <Field.Root w="50%">
                  <Field.Label fontWeight="semibold" color="text.primary">
                    {t('Goals.labelStatus', 'Status')}
                  </Field.Label>
                  <NativeSelectRoot w="100%" disabled={isSaving}>
                    <NativeSelectField
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value as
                            | 'Pending'
                            | 'In-Progress'
                            | 'Completed',
                        )
                      }
                      border="1px solid"
                      borderColor="border.subtle"
                      px={3}
                      borderRadius="lg"
                      color="text.primary"
                      bg="bg.panel"
                      _focus={{
                        borderColor: 'border.focus',
                        boxShadow: 'none',
                      }}
                    >
                      <option
                        value="Pending"
                        style={{
                          background: 'var(--chakra-colors-bg-panel)',
                          color: 'var(--chakra-colors-text-primary)',
                        }}
                      >
                        {t('Goals.statusPending', 'Pending')}
                      </option>
                      <option
                        value="In-Progress"
                        style={{
                          background: 'var(--chakra-colors-bg-panel)',
                          color: 'var(--chakra-colors-text-primary)',
                        }}
                      >
                        {t('Goals.statusInProgress', 'In-Progress')}
                      </option>
                      <option
                        value="Completed"
                        style={{
                          background: 'var(--chakra-colors-bg-panel)',
                          color: 'var(--chakra-colors-text-primary)',
                        }}
                      >
                        {t('Goals.statusCompleted', 'Completed')}
                      </option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field.Root>
              )}
            </form.Field>

            <form.Field
              name="ranking"
              validators={{
                onChange: ({ value }) => {
                  if (value.trim()) {
                    const rankNum = Number(value.trim());
                    if (
                      isNaN(rankNum) ||
                      !Number.isInteger(rankNum) ||
                      rankNum <= 0
                    ) {
                      return t(
                        'Goals.validationRankingPositiveInteger',
                        'Rank must be a positive integer.',
                      );
                    }
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field.Root w="50%" invalid={!!field.state.meta.errors.length}>
                  <Field.Label fontWeight="semibold" color="text.primary">
                    {t('Goals.labelRank', 'Rank / Priority')}
                  </Field.Label>
                  <Input
                    type="number"
                    placeholder={t(
                      'Goals.placeholderRank',
                      'e.g. 1 (Top priority)',
                    )}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isSaving}
                    border="1px solid"
                    borderColor={
                      field.state.meta.errors.length
                        ? 'red.500'
                        : 'border.subtle'
                    }
                    px={3}
                    borderRadius="lg"
                    _focus={{ borderColor: 'border.focus', boxShadow: 'none' }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Field.ErrorText>
                      {field.state.meta.errors.join(', ')}
                    </Field.ErrorText>
                  )}
                </Field.Root>
              )}
            </form.Field>
          </HStack>

          {/* Tags */}
          <form.Field name="tags">
            {(field) => (
              <Field.Root>
                <Field.Label fontWeight="semibold" color="text.primary">
                  {t('Goals.labelTags', 'Tags')}
                </Field.Label>
                <HStack w="full" gap={2}>
                  <Input
                    placeholder={t(
                      'Goals.placeholderTag',
                      'e.g. Tech (Press Enter to Add)',
                    )}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      handleTagInputKeyDown(
                        e,
                        field.state.value,
                        field.handleChange,
                      )
                    }
                    disabled={isSaving || field.state.value.length >= MAX_TAGS}
                    maxLength={MAX_TAG_LENGTH}
                    border="1px solid"
                    borderColor="border.subtle"
                    px={3}
                    borderRadius="lg"
                    _focus={{ borderColor: 'border.focus', boxShadow: 'none' }}
                  />
                  <Button
                    onClick={() =>
                      handleAddTag(field.state.value, field.handleChange)
                    }
                    disabled={
                      isSaving ||
                      !tagInput.trim() ||
                      field.state.value.length >= MAX_TAGS
                    }
                    size="sm"
                    bg="cyan.600"
                    color="white"
                    borderRadius="lg"
                    _hover={{ bg: 'cyan.500' }}
                  >
                    {t('Goals.addTag', 'Add')}
                  </Button>
                </HStack>
                {field.state.value.length > 0 && (
                  <HStack wrap="wrap" gap={2} mt={2}>
                    {field.state.value.map((tag) => (
                      <Badge
                        key={tag}
                        colorPalette="cyan"
                        variant="subtle"
                        borderRadius="md"
                        px={2}
                        py={0.5}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Text as="span">{tag}</Text>
                        {!isSaving && (
                          <IconButton
                            aria-label={`Remove tag ${tag}`}
                            variant="ghost"
                            size="2xs"
                            onClick={() =>
                              handleRemoveTag(
                                tag,
                                field.state.value,
                                field.handleChange,
                              )
                            }
                            p={0}
                            h="auto"
                            w="auto"
                            color="cyan.700"
                            _dark={{ color: 'cyan.300' }}
                            _hover={{ bg: 'transparent', color: 'red.500' }}
                          >
                            <LuX />
                          </IconButton>
                        )}
                      </Badge>
                    ))}
                  </HStack>
                )}
              </Field.Root>
            )}
          </form.Field>

          {/* Details */}
          <form.Field
            name="details"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) {
                  return t(
                    'Goals.validationDetailsRequired',
                    'Details are required.',
                  );
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <Field.Root invalid={!!field.state.meta.errors.length}>
                <Field.Label fontWeight="semibold" color="text.primary">
                  {t('Goals.labelDetails', 'Detailed Breakdown / Notes')}
                </Field.Label>
                <Textarea
                  placeholder={t(
                    'Goals.placeholderDetails',
                    'Break down what you need to study, key books/resources, online courses, projects to build...',
                  )}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSaving}
                  minH="120px"
                  border="1px solid"
                  borderColor={
                    field.state.meta.errors.length ? 'red.500' : 'border.subtle'
                  }
                  px={3}
                  borderRadius="lg"
                  _focus={{ borderColor: 'border.focus', boxShadow: 'none' }}
                />
                {field.state.meta.errors.length > 0 && (
                  <Field.ErrorText>
                    {field.state.meta.errors.join(', ')}
                  </Field.ErrorText>
                )}
              </Field.Root>
            )}
          </form.Field>

          {/* Timeline / Milestones */}
          <form.Field name="timeline">
            {(field) => (
              <Box
                borderTop="1px solid"
                borderColor="border.subtle"
                pt={4}
                mt={2}
              >
                <HStack justify="space-between" mb={2}>
                  <Text
                    fontWeight="semibold"
                    fontSize="sm"
                    color="text.primary"
                  >
                    {t('Goals.labelTimeline', 'Timeline Milestones')}
                  </Text>
                  <Button
                    onClick={() =>
                      handleAddTimelineRow(
                        field.state.value,
                        field.handleChange,
                      )
                    }
                    disabled={
                      isSaving ||
                      field.state.value.length >= MAX_TIMELINE_ENTRIES
                    }
                    size="xs"
                    variant="outline"
                    borderColor="border.subtle"
                    color="text.primary"
                    borderRadius="md"
                    gap={1}
                    _hover={{ bg: 'bg.active' }}
                  >
                    <LuPlus /> {t('Goals.addMilestone', 'Add Milestone')}
                  </Button>
                </HStack>

                <VStack align="stretch" gap={3}>
                  {field.state.value.map((milestone, idx) => (
                    <HStack key={idx} gap={2} w="full">
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="text.muted"
                        w="24px"
                        textAlign="right"
                      >
                        #{idx + 1}
                      </Text>
                      <Input
                        placeholder={t(
                          'Goals.placeholderMilestone',
                          'e.g. Read Designing Data-Intensive Applications',
                        )}
                        value={milestone}
                        onChange={(e) =>
                          handleTimelineChange(
                            idx,
                            e.target.value,
                            field.state.value,
                            field.handleChange,
                          )
                        }
                        disabled={isSaving}
                        maxLength={MAX_TIMELINE_ENTRY_LENGTH}
                        border="1px solid"
                        borderColor="border.subtle"
                        px={3}
                        borderRadius="lg"
                        flex={1}
                        _focus={{
                          borderColor: 'border.focus',
                          boxShadow: 'none',
                        }}
                      />
                      <IconButton
                        aria-label="Delete milestone"
                        onClick={() =>
                          handleRemoveTimelineRow(
                            idx,
                            field.state.value,
                            field.handleChange,
                          )
                        }
                        disabled={isSaving}
                        variant="ghost"
                        color="text.secondary"
                        size="sm"
                        _hover={{ bg: 'bg.cardHeader', color: 'red.500' }}
                      >
                        <LuTrash />
                      </IconButton>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}
          </form.Field>
        </VStack>
      </form>
    </DialogContainer>
  );
};

export default GoalFormDialog;
