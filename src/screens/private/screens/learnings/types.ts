import { LearningItem } from '@store';

export interface LearningFormDrawerProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  editItem: LearningItem | null;
  onSave: (payload: LearningItem) => Promise<void>;
  isSaving: boolean;
  existingTitles: string[];
}

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  itemTitle: string;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export interface LearningCardProps {
  item: LearningItem;
  onEdit: (item: LearningItem) => void;
  onDelete: (title: string) => void;
  onPreview: (item: LearningItem) => void;
}

export interface LearningPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  item: LearningItem | null;
}
