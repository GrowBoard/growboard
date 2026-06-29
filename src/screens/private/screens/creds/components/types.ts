import { CredentialItem } from '@store';

/**
 * Props for the CredentialCard component.
 */
export interface CredentialCardProps {
  /** The credential item details to render. */
  item: CredentialItem;
  /** The index of this credential card in the list. */
  credIdx: number;
  /** Callback triggered when the edit action is clicked. */
  onEdit: (index: number) => void;
  /** Callback triggered when the delete action is clicked. */
  onDelete: (index: number) => void;
  /** Callback triggered when copying the card as env format. */
  onCopyAsEnv: (item: CredentialItem, index: number) => void;
  /** The display layout mode of the card. */
  viewMode?: 'card' | 'list';
}

/**
 * Props for the CredentialFormDialog component.
 */
export interface CredentialFormDialogProps {
  /** Indicates whether the dialog is open. */
  isOpen: boolean;
  /** Callback triggered when the dialog open state changes. */
  onOpenChange: (details: { open: boolean }) => void;
  /** The credential item being edited, or null if creating a new one. */
  editItem: CredentialItem | null;
  /** Callback triggered to save the credential item. */
  onSave: (newItem: CredentialItem) => Promise<void>;
  /** Indicates if the save mutation is currently pending. */
  isSaving: boolean;
}

/**
 * Props for the DeleteConfirmDialog component.
 */
export interface DeleteConfirmDialogProps {
  /** Indicates whether the dialog is open. */
  isOpen: boolean;
  /** Callback triggered when the dialog open state changes. */
  onOpenChange: (details: { open: boolean }) => void;
  /** The title of the credential item to delete (used for validation). */
  targetTitle: string;
  /** Callback triggered when the deletion is confirmed. */
  onConfirm: () => Promise<void>;
  /** Indicates if the delete mutation is currently pending. */
  isSaving: boolean;
}
