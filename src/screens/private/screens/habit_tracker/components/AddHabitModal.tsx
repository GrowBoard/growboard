import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Field, HStack, Input, VStack, Text } from '@chakra-ui/react';
import { DialogContainer } from '@components';
import { AddHabitModalProps } from '../types';
import { formatLocalDate } from '../util';

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

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
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

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
        setSelectedDays(editItem.days || [0, 1, 2, 3, 4, 5, 6]);
      } else {
        setName('');
        setStartDate(formatLocalDate(new Date()));
        setEndDate('');
        setTargetPercentage(100);
        setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
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
    if (selectedDays.length === 0) {
      setErrorMsg(
        t(
          'HabitTracker.errorAtLeastOneDayRequired',
          'At least one repeat day must be selected.',
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
        days: selectedDays,
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

  const handleToggleAll = () => {
    const isAllSelected = selectedDays.length === 7;
    if (isAllSelected) {
      setSelectedDays([]);
    } else {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleToggleDay = (value: number) => {
    if (selectedDays.includes(value)) {
      setSelectedDays(selectedDays.filter((d) => d !== value));
    } else {
      setSelectedDays([...selectedDays, value].sort());
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
      maxW="xl"
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

          {/* Repeat Days Field */}
          <Field.Root invalid={!!errorMsg && selectedDays.length === 0}>
            <Field.Label
              fontWeight="semibold"
              fontSize="xs"
              color="text.primary"
            >
              {t('HabitTracker.repeatDaysLabel', 'Repeat On')}
            </Field.Label>
            <HStack gap={2} wrap="wrap" mt={1}>
              {/* All Days chip — selected when all 7 days active */}
              {(() => {
                const isAllSelected = selectedDays.length === 7;
                return (
                  <Button
                    type="button"
                    size="sm"
                    border="1.5px solid"
                    bg={isAllSelected ? 'rgba(0, 216, 255, 0.18)' : 'transparent'}
                    color={isAllSelected ? '#00D8FF' : 'text.secondary'}
                    borderColor={isAllSelected ? '#00D8FF' : 'border.subtle'}
                    onClick={handleToggleAll}
                    borderRadius="full"
                    px={3}
                    py={1}
                    h="8"
                    fontSize="xs"
                    fontWeight={isAllSelected ? 'semibold' : 'medium'}
                    boxShadow={isAllSelected ? '0 0 10px rgba(0, 216, 255, 0.4)' : 'none'}
                    _hover={{
                      bg: isAllSelected ? 'rgba(0, 216, 255, 0.28)' : 'rgba(255,255,255,0.05)',
                      borderColor: '#00D8FF',
                      color: '#00D8FF',
                    }}
                  >
                    {t('HabitTracker.allDaysChip', 'All days')}
                  </Button>
                );
              })()}

              {/* Individual day chips — locked when "All Days" is active */}
              {DAYS_OF_WEEK.map((day) => {
                const isAllSelected = selectedDays.length === 7;
                const isSelected = !isAllSelected && selectedDays.includes(day.value);
                return (
                  <Button
                    key={day.value}
                    type="button"
                    size="xs"
                    border="1.5px solid"
                    bg={isSelected ? 'rgba(0, 216, 255, 0.18)' : 'transparent'}
                    color={isSelected ? '#00D8FF' : 'text.secondary'}
                    borderColor={isSelected ? '#00D8FF' : 'border.subtle'}
                    onClick={() => handleToggleDay(day.value)}
                    borderRadius="full"
                    px={3}
                    py={1}
                    h="8"
                    fontSize="xs"
                    fontWeight={isSelected ? 'semibold' : 'medium'}
                    opacity={isAllSelected ? 0.35 : 1}
                    cursor={isAllSelected ? 'not-allowed' : 'pointer'}
                    boxShadow={isSelected ? '0 0 10px rgba(0, 216, 255, 0.4)' : 'none'}
                    _hover={{
                      bg: isAllSelected
                        ? 'transparent'
                        : isSelected
                          ? 'rgba(0, 216, 255, 0.28)'
                          : 'rgba(255,255,255,0.05)',
                      borderColor: isAllSelected ? 'border.subtle' : '#00D8FF',
                      color: isAllSelected ? 'text.secondary' : '#00D8FF',
                    }}
                  >
                    {t(`HabitTracker.day_${day.label}`, day.label)}
                  </Button>
                );
              })}
            </HStack>
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
