import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Field, HStack, Input, VStack, Text } from '@chakra-ui/react';
import { DialogContainer } from '@components';
import { AddHabitModalProps } from '../types';
import { formatLocalDate } from '../util';

/**
 * AddHabitModal Component.
 * Dialog form to start a new habit or edit an existing one.
 */
export const AddHabitModal = ({
  isOpen,
  onClose,
  onSaveHabit,
  editItem = null,
}: AddHabitModalProps) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetPercentage, setTargetPercentage] = useState<number>(100);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset form states when modal opens or editItem changes
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setName(editItem.name);
        setStartDate(editItem.startDate);
        setEndDate(editItem.endDate || '');
        setTargetPercentage(editItem.targetPercentage);
      } else {
        setName('');
        setStartDate(formatLocalDate(new Date()));
        setEndDate('');
        setTargetPercentage(100);
      }
      setErrorMsg('');
      setIsSaving(false);
    }
  }, [isOpen, editItem]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(
        t('HabitTracker.errorNameRequired', 'Habit name is required.'),
      );
      return;
    }
    if (!startDate) {
      setErrorMsg(
        t('HabitTracker.errorStartDateRequired', 'Start date is required.'),
      );
      return;
    }
    if (endDate && endDate < startDate) {
      setErrorMsg(
        t(
          'HabitTracker.errorEndDateBeforeStart',
          'End date cannot be before start date.',
        ),
      );
      return;
    }
    if (
      targetPercentage < 0 ||
      targetPercentage > 100 ||
      isNaN(targetPercentage)
    ) {
      setErrorMsg(
        t(
          'HabitTracker.errorTargetPercentageRange',
          'Daily target percentage must be between 0 and 100.',
        ),
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');
      await onSaveHabit({
        ...(editItem ? { id: editItem.id } : {}),
        name: name.trim(),
        startDate,
        endDate: endDate || '',
        targetPercentage,
        createdAt: editItem ? editItem.createdAt : new Date().toISOString(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          t('HabitTracker.errorSaveFailed', 'Failed to save habit.'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (e: { open: boolean }) => {
    if (!e.open) onClose();
  };

  const isEditMode = !!editItem;

  return (
    <DialogContainer
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={
        isEditMode
          ? t('HabitTracker.editHabitTitle', 'Edit Habit')
          : t('HabitTracker.addHabitTitle', 'Start a Habit')
      }
      maxW="md"
      footer={
        <HStack gap={3} justify="flex-end" w="full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            color="text.secondary"
          >
            {t('HabitTracker.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleSave}
            loading={isSaving}
            colorPalette="cyan"
            px={6}
          >
            {t('HabitTracker.save', 'Save')}
          </Button>
        </HStack>
      }
    >
      <form onSubmit={handleSave}>
        <VStack gap={4} align="stretch" py={2}>
          {/* Habit Name Field */}
          <Field.Root invalid={!!errorMsg && !name.trim()}>
            <Field.Label
              fontWeight="semibold"
              fontSize="xs"
              color="text.primary"
            >
              {t('HabitTracker.nameLabel', 'Habit Name')}
            </Field.Label>
            <Input
              placeholder={t(
                'HabitTracker.namePlaceholder',
                'e.g. Morning Yoga, Drink Water...',
              )}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              autoFocus
              border="1px solid"
              borderColor={
                errorMsg && !name.trim() ? 'red.500' : 'border.subtle'
              }
              px={3}
              h="10"
              borderRadius="lg"
              bg="bg.card"
              fontSize="sm"
              _focus={{ borderColor: 'border.focus' }}
            />
          </Field.Root>

          {/* Start Date Field */}
          <Field.Root invalid={!!errorMsg && !startDate}>
            <Field.Label
              fontWeight="semibold"
              fontSize="xs"
              color="text.primary"
            >
              {t('HabitTracker.startDateLabel', 'Start Date')}
            </Field.Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isSaving}
              border="1px solid"
              borderColor={errorMsg && !startDate ? 'red.500' : 'border.subtle'}
              px={3}
              h="10"
              borderRadius="lg"
              bg="bg.card"
              fontSize="sm"
              _focus={{ borderColor: 'border.focus' }}
            />
          </Field.Root>

          {/* End Date (Optional) Field */}
          <Field.Root invalid={!!errorMsg && endDate && endDate < startDate}>
            <Field.Label
              fontWeight="semibold"
              fontSize="xs"
              color="text.primary"
            >
              {t('HabitTracker.endDateLabel', 'End Date (Optional)')}
            </Field.Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isSaving}
              border="1px solid"
              borderColor={
                errorMsg && endDate && endDate < startDate
                  ? 'red.500'
                  : 'border.subtle'
              }
              px={3}
              h="10"
              borderRadius="lg"
              bg="bg.card"
              fontSize="sm"
              _focus={{ borderColor: 'border.focus' }}
            />
          </Field.Root>

          {/* Target Percentage Field */}
          <Field.Root
            invalid={
              !!errorMsg &&
              (targetPercentage < 0 ||
                targetPercentage > 100 ||
                isNaN(targetPercentage))
            }
          >
            <Field.Label
              fontWeight="semibold"
              fontSize="xs"
              color="text.primary"
            >
              {t('HabitTracker.targetLabel', 'Daily Target Percentage (%)')}
            </Field.Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={targetPercentage}
              onChange={(e) =>
                setTargetPercentage(
                  e.target.value === '' ? 0 : Number(e.target.value),
                )
              }
              disabled={isSaving}
              border="1px solid"
              borderColor={
                errorMsg &&
                (targetPercentage < 0 ||
                  targetPercentage > 100 ||
                  isNaN(targetPercentage))
                  ? 'red.500'
                  : 'border.subtle'
              }
              px={3}
              h="10"
              borderRadius="lg"
              bg="bg.card"
              fontSize="sm"
              _focus={{ borderColor: 'border.focus' }}
            />
          </Field.Root>

          {errorMsg && (
            <Text color="red.500" fontSize="xs" fontWeight="semibold">
              {errorMsg}
            </Text>
          )}
        </VStack>
      </form>
    </DialogContainer>
  );
};

export default AddHabitModal;
