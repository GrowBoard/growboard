import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  VStack,
  Box,
  Text,
  Input,
  HStack,
  Button,
  Separator,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { DialogContainer, useErrorToast } from '@components';
import { CredentialItem, CredentialField } from '@store';
import { CredentialFormDialogProps } from './types';

/**
 * CredentialFormDialog component provides a dialog form to add or edit credentials,
 * with template preset options and dynamic attribute rows.
 */
const CredentialFormDialog = ({
  isOpen,
  onOpenChange,
  editItem,
  onSave,
  isSaving,
}: CredentialFormDialogProps) => {
  const { t } = useTranslation();
  const errorToast = useErrorToast();

  const [formTitle, setFormTitle] = useState('');
  const [formFields, setFormFields] = useState<CredentialField[]>([]);

  // Synchronize internal state when the dialog opens or editItem changes
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormTitle(editItem.credTitle);
        setFormFields(editItem.credData.map((f) => ({ ...f })));
      } else {
        setFormTitle('');
        setFormFields([{ name: '', value: '' }]);
      }
    }
  }, [isOpen, editItem]);

  const applyPreset = (type: 'login' | 'database' | 'apikey' | 'ssh') => {
    let fields: CredentialField[] = [];
    switch (type) {
      case 'login':
        fields = [
          { name: 'URL', value: '' },
          { name: 'Username', value: '' },
          { name: 'Password', value: '' },
        ];
        break;
      case 'database':
        fields = [
          { name: 'Host', value: '' },
          { name: 'Port', value: '' },
          { name: 'Database', value: '' },
          { name: 'Username', value: '' },
          { name: 'Password', value: '' },
        ];
        break;
      case 'apikey':
        fields = [
          { name: 'API Key', value: '' },
          { name: 'Endpoint', value: '' },
        ];
        break;
      case 'ssh':
        fields = [
          { name: 'Host', value: '' },
          { name: 'Username', value: '' },
          { name: 'Private Key', value: '' },
        ];
        break;
    }
    setFormFields(fields);
  };

  const handleAddFieldRow = () => {
    setFormFields([...formFields, { name: '', value: '' }]);
  };

  const handleRemoveFieldRow = (idx: number) => {
    setFormFields(formFields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (
    idx: number,
    key: 'name' | 'value',
    val: string,
  ) => {
    const updated = [...formFields];
    updated[idx][key] = val;
    setFormFields(updated);
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      errorToast(t('SignUpError.nameRequired', 'Title is required!'));
      return;
    }

    const validFields = formFields.filter((f) => f.name.trim() !== '');
    if (validFields.length === 0) {
      errorToast(
        t('Credentials.nameLabel', 'At least one field name is required.'),
      );
      return;
    }

    const newItem: CredentialItem = {
      credTitle: formTitle.trim(),
      credData: validFields.map((f) => ({
        name: f.name.trim(),
        value: f.value,
      })),
    };

    await onSave(newItem);
  };

  return (
    <DialogContainer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={
        editItem !== null
          ? t('Credentials.editCredential', 'Edit Credential')
          : t('Credentials.addCredential', 'Add Credential')
      }
      maxW="xl"
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            color="text.primary"
            px={4}
            borderRadius="lg"
            onClick={() => onOpenChange({ open: false })}
          >
            {t('Credentials.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleSave}
            colorPalette="blue"
            bg="blue.600"
            color="white"
            size="sm"
            fontWeight="bold"
            loading={isSaving}
            px={6}
            py={2}
            borderRadius="lg"
            shadow="md"
            transition="all 0.2s"
            _hover={{
              bg: 'blue.500',
              transform: 'translateY(-1px)',
              shadow: 'lg',
            }}
            _active={{
              transform: 'translateY(0)',
              shadow: 'md',
            }}
          >
            {t('Credentials.save', 'Save')}
          </Button>
        </>
      }
    >
      <VStack align="stretch" gap={4}>
        {/* Credential Title Input */}
        <Box>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="text.secondary"
            mb={2}
          >
            {t('Credentials.credTitleLabel', 'Credential Title')}
          </Text>
          <Input
            placeholder={t(
              'Credentials.credTitlePlaceholder',
              'e.g. Account Title',
            )}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            bg="bg.card"
            border="1px solid"
            borderColor="border.subtle"
            px={3}
            _focus={{
              borderColor: 'border.focus',
              boxShadow: 'none',
            }}
            borderRadius="md"
            color="text.primary"
          />
        </Box>

        {/* Quick Start Presets */}
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="text.muted" mb={2}>
            {t(
              'Credentials.presetsLabel',
              'Or Quick Start with a Preset Template:',
            )}
          </Text>
          <HStack gap={2} flexWrap="wrap">
            {[
              {
                type: 'login',
                label: 'Login (URL/User/Pass)',
                color: 'blue',
              },
              { type: 'database', label: 'Database Config', color: 'green' },
              {
                type: 'apikey',
                label: 'API Key / Endpoint',
                color: 'purple',
              },
              { type: 'ssh', label: 'SSH Server', color: 'yellow' },
            ].map((preset) => (
              <Button
                key={preset.type}
                size="xs"
                variant="outline"
                colorPalette={preset.color}
                borderColor="colorPalette.500/30"
                color="colorPalette.600"
                _dark={{ color: 'colorPalette.300' }}
                bg="colorPalette.500/5"
                _hover={{
                  bg: 'colorPalette.500/15',
                  borderColor: 'colorPalette.500',
                }}
                onClick={() => applyPreset(preset.type as any)}
                borderRadius="md"
                px={3}
                py={2.5}
              >
                {preset.label}
              </Button>
            ))}
          </HStack>
        </Box>

        <Separator borderColor="border.subtle" my={2} />

        <Flex justify="space-between" align="center">
          <Text fontSize="sm" fontWeight="bold" color="text.secondary">
            Attributes / Fields
          </Text>
          <Button
            onClick={handleAddFieldRow}
            variant="ghost"
            size="xs"
            color="blue.400"
            _hover={{ bg: 'bg.active' }}
            gap={1}
          >
            <LuPlus />
            {t('Credentials.addPair', 'Add Row')}
          </Button>
        </Flex>

        {/* Dynamic Fields List */}
        <Box maxH="250px" overflowY="auto" pr={1}>
          <VStack align="stretch" gap={3}>
            {formFields.map((field, idx) => (
              <HStack key={idx} align="center" gap={2}>
                <Input
                  placeholder={t('Credentials.nameLabel', 'Name')}
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(idx, 'name', e.target.value)
                  }
                  bg="bg.card"
                  border="1px solid"
                  borderColor="border.subtle"
                  px={3}
                  _focus={{ borderColor: 'border.focus', boxShadow: 'none' }}
                  borderRadius="md"
                  color="text.primary"
                  size="sm"
                  w="40%"
                />
                <Input
                  placeholder={t('Credentials.valueLabel', 'Value')}
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(idx, 'value', e.target.value)
                  }
                  bg="bg.card"
                  border="1px solid"
                  borderColor="border.subtle"
                  px={3}
                  _focus={{ borderColor: 'border.focus', boxShadow: 'none' }}
                  borderRadius="md"
                  color="text.primary"
                  size="sm"
                  w="50%"
                />
                <IconButton
                  px={2}
                  aria-label={t('Credentials.deletePair', 'Delete Row')}
                  onClick={() => handleRemoveFieldRow(idx)}
                  variant="ghost"
                  size="sm"
                  color="red.400"
                  _hover={{ bg: 'bg.active' }}
                >
                  <LuTrash2 />
                </IconButton>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </DialogContainer>
  );
};

export default CredentialFormDialog;
