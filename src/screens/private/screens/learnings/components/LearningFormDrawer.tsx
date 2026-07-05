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
  Drawer,
} from '@chakra-ui/react';
import { LuTrash2, LuX } from 'react-icons/lu';
import { useForm } from '@tanstack/react-form';
import { LearningItem } from '@store';
import { LearningFormDrawerProps } from '../types';
import { MAX_TITLE_LENGTH, MAX_TAGS, MAX_TAG_LENGTH } from '../const';
import { renderMarkdown } from '../util';

interface LearningFormValues {
  title: string;
  subtitle: string;
  tags: string[];
  content: string;
}

const defaultValues: LearningFormValues = {
  title: '',
  subtitle: '',
  tags: [],
  content: '',
};

/**
 * LearningFormDrawer renders the drawer slide-out form for adding or editing a learning.
 * Uses TanStack Form for state management and validation.
 */
export const LearningFormDrawer = ({
  isOpen,
  onOpenChange,
  editItem,
  onSave,
  isSaving,
  existingTitles,
}: LearningFormDrawerProps) => {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Keep a stable ref to editItem so onSubmit doesn't need to close over the
  // prop directly — prevents TanStack Form from seeing new options on every
  // render and reinitialising (which caused the form-reset-on-tab-switch bug).
  const editItemRef = React.useRef(editItem);
  editItemRef.current = editItem;

  // Initialize TanStack Form with a stable onSubmit that reads editItem via ref
  const form = useForm({
    defaultValues,
    onSubmit: React.useCallback(
      async ({ value }: { value: LearningFormValues }) => {
        const now = new Date().toISOString();
        const currentEditItem = editItemRef.current;
        const payload: LearningItem = {
          title: value.title.trim(),
          subtitle: value.subtitle.trim(),
          tags: value.tags,
          content: value.content,
          createdAt: currentEditItem ? currentEditItem.createdAt : now,
          updatedAt: now,
        };

        await onSave(payload);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },
      [onSave],
    ),
  });

  // Track open state transitions to only reset when opening
  const wasOpenRef = React.useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      if (editItem) {
        // IMPORTANT: Do NOT use form.reset(editValues) here.
        // form.reset(values) mutates formApi.options.defaultValues to `values`.
        // On the next render, TanStack Form calls formApi.update(opts) with the
        // original empty defaultValues constant. It sees defaultValues changed
        // (empty → editItem) and, since isTouched=false post-reset, immediately
        // resets the form back to the empty constant — clearing all edit data.
        //
        // Using setFieldValue avoids touching options.defaultValues entirely,
        // so subsequent update() calls never trigger a spurious reset.
        form.setFieldValue('title', editItem.title);
        form.setFieldValue('subtitle', editItem.subtitle);
        form.setFieldValue('tags', [...editItem.tags]);
        form.setFieldValue('content', editItem.content);
      } else {
        // For add-mode: reset() with no args resets to options.defaultValues
        // (the empty constant), which is correct and safe.
        form.reset();
      }
      setTagInput('');
      setActiveTab('write');
    }
    wasOpenRef.current = isOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editItem]);

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

  const isEditMode = editItem !== null;

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      placement="end"
      size="full"
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
              {isEditMode
                ? t('Learnings.editLearning', 'Edit Learning')
                : t('Learnings.addLearning', 'Add Learning')}
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
                      if (!value.trim()) {
                        return t(
                          'Learnings.validationTitleRequired',
                          'Title is required.',
                        );
                      }
                      if (value.trim().length > MAX_TITLE_LENGTH) {
                        return t(
                          'Learnings.validationTitleLength',
                          'Title is too long (max 100 characters).',
                        );
                      }
                      if (
                        (!isEditMode ||
                          (editItem &&
                            editItem.title.toLowerCase() !==
                              value.trim().toLowerCase())) &&
                        existingTitles.some(
                          (t) => t.toLowerCase() === value.trim().toLowerCase(),
                        )
                      ) {
                        return t(
                          'Learnings.validationTitleUnique',
                          'A learning with this title already exists.',
                        );
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Field.Root invalid={!!field.state.meta.errors.length}>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Learnings.learningTitleLabel', 'Learning Title')}
                      </Field.Label>
                      <Input
                        placeholder={t(
                          'Learnings.learningTitlePlaceholder',
                          'e.g. Topic Title',
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
                        {t('Learnings.subtitleLabel', 'Subtitle / Short Pitch')}
                      </Field.Label>
                      <Input
                        placeholder={t(
                          'Learnings.subtitlePlaceholder',
                          'e.g. Topic Subtitle',
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

                {/* Tags */}
                <form.Field name="tags">
                  {(field) => (
                    <Field.Root>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Learnings.tagsLabel', 'Tags')}
                      </Field.Label>
                      <VStack align="stretch" gap={2}>
                        <Input
                          placeholder={t(
                            'Learnings.tagsPlaceholder',
                            'e.g. Tag1, Tag2 (Press Enter to add)',
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

                {/* Content with Custom Tabs */}
                <form.Field
                  name="content"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value.trim()) {
                        return t(
                          'Learnings.validationContentRequired',
                          'Content is required.',
                        );
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Field.Root invalid={!!field.state.meta.errors.length}>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Learnings.contentLabel', 'Content (Markdown)')}
                      </Field.Label>

                      <VStack align="stretch" gap={3} w="full">
                        {/* Tab Switcher */}
                        <HStack
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                          pb={1}
                          gap={4}
                        >
                          <Button
                            type="button"
                            variant={
                              activeTab === 'write' ? 'surface' : 'ghost'
                            }
                            size="xs"
                            py={1}
                            px={3}
                            borderRadius="md"
                            onClick={() => setActiveTab('write')}
                            color={
                              activeTab === 'write'
                                ? 'text.primary'
                                : 'text.muted'
                            }
                          >
                            Write
                          </Button>
                          <Button
                            type="button"
                            variant={
                              activeTab === 'preview' ? 'surface' : 'ghost'
                            }
                            size="xs"
                            py={1}
                            px={3}
                            borderRadius="md"
                            onClick={() => setActiveTab('preview')}
                            color={
                              activeTab === 'preview'
                                ? 'text.primary'
                                : 'text.muted'
                            }
                          >
                            Preview
                          </Button>
                        </HStack>

                        {/* Content Area */}
                        {activeTab === 'write' ? (
                          <Textarea
                            placeholder={t(
                              'Learnings.contentPlaceholder',
                              'Type your markdown content here...',
                            )}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isSaving}
                            rows={15}
                            border="1px solid"
                            borderColor="border.subtle"
                            p={3}
                            borderRadius="lg"
                            fontFamily="mono"
                            fontSize="sm"
                            _focus={{
                              borderColor: 'border.focus',
                              boxShadow: 'none',
                            }}
                          />
                        ) : (
                          <Box
                            p={4}
                            bg="bg.card"
                            border="1px solid"
                            borderColor="border.subtle"
                            borderRadius="lg"
                            minH="300px"
                            overflowY="auto"
                          >
                            {field.state.value.trim() ? (
                              renderMarkdown(field.state.value)
                            ) : (
                              <Text
                                color="text.muted"
                                fontSize="sm"
                                fontStyle="italic"
                              >
                                Nothing to preview.
                              </Text>
                            )}
                          </Box>
                        )}
                      </VStack>

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
                {t('Learnings.cancel', 'Cancel')}
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
                {t('Learnings.save', 'Save')}
              </Button>
            </HStack>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default LearningFormDrawer;
