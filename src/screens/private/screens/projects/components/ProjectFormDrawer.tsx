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
import { ProjectItem } from '@store';
import { ProjectFormDrawerProps } from './types';
import { renderMarkdown } from '../util';

const MAX_TITLE_LENGTH = 100;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;

interface ProjectFormValues {
  title: string;
  subtitle: string;
  link: string;
  tags: string[];
  about_project: string;
  remark: string;
  owner: string;
  status: 'pending' | 'ideaphase' | 'started' | 'done';
}

const defaultValues: ProjectFormValues = {
  title: '',
  subtitle: '',
  link: '',
  tags: [],
  about_project: '',
  remark: '',
  owner: '',
  status: 'pending',
};

/**
 * ProjectFormDrawer renders the drawer form for adding/editing a project.
 */
export const ProjectFormDrawer = ({
  isOpen,
  onOpenChange,
  editItem,
  onSave,
  isSaving,
}: ProjectFormDrawerProps) => {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Initialize TanStack Form
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const payload: Omit<ProjectItem, 'Id'> & { Id?: string } = {
        title: (value.title || '').trim(),
        subtitle: (value.subtitle || '').trim(),
        link: (value.link || '').trim(),
        tags: value.tags || [],
        about_project: value.about_project || '',
        remark: (value.remark || '').trim(),
        owner: (value.owner || '').trim(),
        status: value.status || 'pending',
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
          link: editItem.link || '',
          tags: editItem.tags || [],
          about_project: editItem.about_project || '',
          remark: editItem.remark || '',
          owner: editItem.owner || '',
          status: editItem.status || 'pending',
        });
      } else {
        form.reset(defaultValues);
      }
      setTagInput('');
      setActiveTab('write');
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
                ? t('Projects.editProject', 'Edit Project')
                : t('Projects.addProject', 'Add Project')}
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
                          'Projects.validationTitleRequired',
                          'Title is required.',
                        );
                      }
                      if (value.trim().length > MAX_TITLE_LENGTH) {
                        return t(
                          'Projects.validationTitleLength',
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
                        {t('Projects.projectTitleLabel', 'Project Title')}
                      </Field.Label>
                      <Input
                        placeholder={t(
                          'Projects.projectTitlePlaceholder',
                          'e.g. Growboard Portal',
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
                        {t('Projects.subtitleLabel', 'Subtitle / Short Pitch')}
                      </Field.Label>
                      <Input
                        placeholder={t(
                          'Projects.subtitlePlaceholder',
                          'e.g. Custom management dashboards',
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

                {/* Owner & Status Row */}
                <HStack gap={4} w="full">
                  <Box flex="1">
                    <form.Field name="owner">
                      {(field) => (
                        <Field.Root style={{ width: '100%' }}>
                          <Field.Label fontWeight="semibold" color="text.primary">
                            {t('Projects.ownerLabel', 'Owner')}
                          </Field.Label>
                          <Input
                            placeholder={t(
                              'Projects.ownerPlaceholder',
                              'e.g. Amit Raikwar',
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
                  </Box>

                  <Box flex="1">
                    <form.Field name="status">
                      {(field) => (
                        <Field.Root style={{ width: '100%' }}>
                          <Field.Label fontWeight="semibold" color="text.primary">
                            {t('Projects.statusLabel', 'Status')}
                          </Field.Label>
                          <select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as any)}
                            disabled={isSaving}
                            style={{
                              background: 'var(--chakra-colors-bg-card)',
                              border: '1px solid var(--chakra-colors-border-subtle)',
                              borderRadius: 'var(--chakra-radii-lg)',
                              padding: '8px 12px',
                              color: 'var(--chakra-colors-text-primary)',
                              width: '100%',
                              outline: 'none',
                            }}
                          >
                            <option value="pending" style={{ background: '#1E2023', color: '#FFF' }}>Pending</option>
                            <option value="ideaphase" style={{ background: '#1E2023', color: '#FFF' }}>IdeaPhase</option>
                            <option value="started" style={{ background: '#1E2023', color: '#FFF' }}>Started</option>
                            <option value="done" style={{ background: '#1E2023', color: '#FFF' }}>Done</option>
                          </select>
                        </Field.Root>
                      )}
                    </form.Field>
                  </Box>
                </HStack>

                {/* Link */}
                <form.Field name="link">
                  {(field) => (
                    <Field.Root>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Projects.linkLabel', 'Project Link (URL)')}
                      </Field.Label>
                      <Input
                        placeholder={t(
                          'Projects.linkPlaceholder',
                          'e.g. https://github.com/GrowBoard',
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
                        {t('Projects.tagsLabel', 'Tags')}
                      </Field.Label>
                      <VStack align="stretch" gap={2}>
                        <Input
                          placeholder={t(
                            'Projects.tagsPlaceholder',
                            'e.g. React, UI, Web (Press Enter to add)',
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

                {/* About Project (Markdown Tab Switcher) */}
                <form.Field
                  name="about_project"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || !value.trim()) {
                        return t(
                          'Projects.validationContentRequired',
                          'Project description content is required.',
                        );
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Field.Root invalid={!!field.state.meta.errors.length}>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Projects.aboutLabel', 'About Project (Markdown)')}
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
                              'Projects.contentPlaceholder',
                              'Write project details, requirements, features here...',
                            )}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isSaving}
                            rows={12}
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
                            minH="250px"
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

                {/* Remark (TextArea) */}
                <form.Field name="remark">
                  {(field) => (
                    <Field.Root>
                      <Field.Label fontWeight="semibold" color="text.primary">
                        {t('Projects.remarkLabel', 'Remarks')}
                      </Field.Label>
                      <Textarea
                        placeholder={t(
                          'Projects.remarkPlaceholder',
                          'Any additional notes, deployment links, server configurations...',
                        )}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isSaving}
                        rows={5}
                        border="1px solid"
                        borderColor="border.subtle"
                        p={3}
                        borderRadius="lg"
                        _focus={{
                          borderColor: 'border.focus',
                          boxShadow: 'none',
                        }}
                      />
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
                {t('Projects.cancel', 'Cancel')}
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
                {t('Projects.save', 'Save')}
              </Button>
            </HStack>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ProjectFormDrawer;
