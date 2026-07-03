import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Field,
  IconButton,
  Badge,
  Drawer,
  Box,
} from '@chakra-ui/react';
import { LuTrash2, LuX } from 'react-icons/lu';
import { useForm } from '@tanstack/react-form';
import { PlanItem } from '@store';
import { PlanFormDrawerProps } from './types';

const MAX_TITLE_LENGTH = 100;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;

interface PlanFormValues {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  tags: string[];
  about_plan: string;
}

const defaultValues: PlanFormValues = {
  title: '',
  subtitle: '',
  date: '',
  time: '',
  tags: [],
  about_plan: '',
};

/**
 * PlanFormDrawer renders the drawer slide-out form for adding/editing a plan.
 */
export const PlanFormDrawer = ({
  isOpen,
  onOpenChange,
  editItem,
  onSave,
  isSaving,
}: PlanFormDrawerProps) => {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState('');

  // Initialize TanStack Form
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const payload: Omit<PlanItem, 'Id'> & { Id?: string } = {
        title: (value.title || '').trim(),
        subtitle: (value.subtitle || '').trim(),
        date: value.date || '',
        time: value.time || '',
        tags: value.tags || [],
        about_plan: value.about_plan || '',
      };
      if (editItem) {
        payload.Id = editItem.Id;
      }
      await onSave(payload);
    },
  });

  // Reset form when drawer opens or editItem changes
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        form.reset({
          title: editItem.title,
          subtitle: editItem.subtitle || '',
          date: editItem.date || '',
          time: editItem.time || '',
          tags: editItem.tags || [],
          about_plan: editItem.about_plan || '',
        });
      } else {
        form.reset(defaultValues);
      }
      setTagInput('');
    }
  }, [isOpen, editItem, form]);

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

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      placement="end"
      size="lg"
    >
      <Drawer.Backdrop backdropFilter="blur(3px)" />
      <Drawer.Positioner>
        <Drawer.Content
          bg="bg.panel"
          borderLeft="1px solid"
          borderColor="border.subtle"
          boxShadow="2xl"
          h="100vh"
        >
          <Drawer.CloseTrigger asChild>
            <IconButton
              aria-label="Close"
              variant="ghost"
              size="sm"
              position="absolute"
              top={3}
              right={4}
              color="text.secondary"
              disabled={isSaving}
              _hover={{ bg: 'bg.active', color: 'text.primary' }}
            >
              <LuX />
            </IconButton>
          </Drawer.CloseTrigger>

          <Drawer.Header
            borderBottom="1px solid"
            borderColor="border.subtle"
            py={4}
            px={6}
          >
            <Drawer.Title fontSize="lg" fontWeight="bold" color="text.primary">
              {editItem
                ? t('Plans.editPlan', 'Edit Plan')
                : t('Plans.addPlan', 'Add Plan')}
            </Drawer.Title>
          </Drawer.Header>

          <Drawer.Body py={5} px={6} overflowY="auto" h="calc(100vh - 140px)">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <VStack gap={5} align="stretch">
                {/* Title */}
                <form.Field
                  name="title"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || !value.trim()) {
                        return t(
                          'Plans.validationTitleRequired',
                          'Title is required.',
                        );
                      }
                      if (value.trim().length > MAX_TITLE_LENGTH) {
                        return t(
                          'Plans.validationTitleLength',
                          'Title is too long (max 100 characters).',
                        );
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Field.Root invalid={!!field.state.meta.errors.length}>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Plans.planTitleLabel', 'Plan Title')}
                      </Field.Label>
                      <Input
                        placeholder={t(
                          'Plans.planTitlePlaceholder',
                          'e.g. Code Review Strategy',
                        )}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isSaving}
                        maxLength={MAX_TITLE_LENGTH}
                        border="1px solid"
                        borderColor={
                          field.state.meta.errors.length
                            ? 'red.500'
                            : 'border.subtle'
                        }
                        px={3}
                        borderRadius="lg"
                        _focus={{
                          borderColor: 'border.focus',
                          boxShadow: 'none',
                        }}
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
                        {t('Plans.subtitleLabel', 'Subtitle / Pitch')}
                      </Field.Label>
                      <Input
                        placeholder={t(
                          'Plans.subtitlePlaceholder',
                          'e.g. Standard guidelines for backend PR reviews',
                        )}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isSaving}
                        border="1px solid"
                        borderColor="border.subtle"
                        px={3}
                        borderRadius="lg"
                        _focus={{
                          borderColor: 'border.focus',
                          boxShadow: 'none',
                        }}
                      />
                    </Field.Root>
                  )}
                </form.Field>

                {/* Date & Time Row */}
                <HStack gap={4} w="full">
                  <Box flex="1">
                    <form.Field name="date">
                      {(field) => (
                        <Field.Root style={{ width: '100%' }}>
                          <Field.Label
                            fontWeight="semibold"
                            color="text.primary"
                          >
                            {t('Plans.dateLabel', 'Date')}
                          </Field.Label>
                          <Input
                            type="date"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isSaving}
                            border="1px solid"
                            borderColor="border.subtle"
                            px={3}
                            borderRadius="lg"
                            _focus={{
                              borderColor: 'border.focus',
                              boxShadow: 'none',
                            }}
                          />
                        </Field.Root>
                      )}
                    </form.Field>
                  </Box>

                  <Box flex="1">
                    <form.Field name="time">
                      {(field) => (
                        <Field.Root style={{ width: '100%' }}>
                          <Field.Label
                            fontWeight="semibold"
                            color="text.primary"
                          >
                            {t('Plans.timeLabel', 'Time')}
                          </Field.Label>
                          <Input
                            type="time"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isSaving}
                            border="1px solid"
                            borderColor="border.subtle"
                            px={3}
                            borderRadius="lg"
                            _focus={{
                              borderColor: 'border.focus',
                              boxShadow: 'none',
                            }}
                          />
                        </Field.Root>
                      )}
                    </form.Field>
                  </Box>
                </HStack>

                {/* Tags */}
                <form.Field name="tags">
                  {(field) => (
                    <Field.Root>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Plans.tagsLabel', 'Tags')}
                      </Field.Label>
                      <VStack align="stretch" gap={2}>
                        <Input
                          placeholder={t(
                            'Plans.tagsPlaceholder',
                            'e.g. Work, Q3, Dev (Press Enter to add)',
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
                          disabled={
                            isSaving || field.state.value.length >= MAX_TAGS
                          }
                          border="1px solid"
                          borderColor="border.subtle"
                          px={3}
                          borderRadius="lg"
                          _focus={{
                            borderColor: 'border.focus',
                            boxShadow: 'none',
                          }}
                        />
                        <HStack wrap="wrap" gap={2}>
                          {field.state.value.map((tag) => (
                            <Badge
                              key={tag}
                              bg="bg.active"
                              color="text.primary"
                              px={2.5}
                              py={1}
                              borderRadius="md"
                              display="inline-flex"
                              alignItems="center"
                              gap={1}
                              border="1px solid"
                              borderColor="border.subtle"
                              fontSize="xs"
                            >
                              {tag}
                              <IconButton
                                aria-label="Remove tag"
                                size="xs"
                                variant="ghost"
                                color="text.muted"
                                h="auto"
                                w="auto"
                                minW="auto"
                                p={0}
                                _hover={{ color: 'red.500', bg: 'transparent' }}
                                onClick={() =>
                                  handleRemoveTag(
                                    tag,
                                    field.state.value,
                                    field.handleChange,
                                  )
                                }
                              >
                                <LuTrash2 size={12} />
                              </IconButton>
                            </Badge>
                          ))}
                        </HStack>
                      </VStack>
                    </Field.Root>
                  )}
                </form.Field>

                {/* About Plan (TextArea) */}
                <form.Field
                  name="about_plan"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || !value.trim()) {
                        return t(
                          'Plans.validationAboutRequired',
                          'About description is required.',
                        );
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Field.Root invalid={!!field.state.meta.errors.length}>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Plans.aboutLabel', 'About Plan')}
                      </Field.Label>
                      <Textarea
                        placeholder={t(
                          'Plans.aboutPlaceholder',
                          'Describe the plan objectives and scope...',
                        )}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isSaving}
                        rows={8}
                        border="1px solid"
                        borderColor={
                          field.state.meta.errors.length
                            ? 'red.500'
                            : 'border.subtle'
                        }
                        p={3}
                        borderRadius="lg"
                        _focus={{
                          borderColor: 'border.focus',
                          boxShadow: 'none',
                        }}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <Field.ErrorText mt={1}>
                          {field.state.meta.errors.join(', ')}
                        </Field.ErrorText>
                      )}
                    </Field.Root>
                  )}
                </form.Field>
              </VStack>
            </form>
          </Drawer.Body>

          <Drawer.Footer
            borderTop="1px solid"
            borderColor="border.subtle"
            py={4}
            px={6}
          >
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
                {t('Plans.cancel', 'Cancel')}
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
                {t('Plans.save', 'Save')}
              </Button>
            </HStack>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default PlanFormDrawer;
