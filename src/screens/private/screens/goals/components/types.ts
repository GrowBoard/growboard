import { GoalItem } from '@store';

/**
 * Props for the GoalCard component.
 */
export interface GoalCardProps {
  /** The goal item payload */
  item: GoalItem;
  /** Callback triggered when clicking edit button */
  onEdit: (title: string) => void;
  /** Callback triggered when clicking delete button */
  onDelete: (title: string) => void;
  /** Visual presentation layout viewMode: card (grid) or list (vertical list) */
  viewMode?: 'card' | 'list';
  /** Drag and Drop props */
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragOver?: boolean;
  isDragged?: boolean;
}

/**
 * Props for the GoalFormDialog component.
 */
export interface GoalFormDialogProps {
  /** Flag controlling visibility of the dialog modal overlay */
  isOpen: boolean;
  /** Change event handler to toggle open/close states */
  onOpenChange: (details: { open: boolean }) => void;
  /** Goal item to populate form values when in edit mode, or null for new additions */
  editItem: GoalItem | null;
  /** Save callback handler executing write queries */
  onSave: (goal: GoalItem) => Promise<void>;
  /** Busy flag triggering disabled inputs and saving loader indicators */
  isSaving: boolean;
  /** List of existing goal titles to validate uniqueness */
  existingTitles: string[];
}

/**
 * Props for the DeleteConfirmDialog component.
 */
export interface DeleteConfirmDialogProps {
  /** Flag controlling visibility of the dialog modal overlay */
  isOpen: boolean;
  /** Change event handler to toggle open/close states */
  onOpenChange: (details: { open: boolean }) => void;
  /** Title of the goal target being deleted */
  targetTitle: string;
  /** Destructive confirmation action callback executing delete query */
  onConfirm: () => void;
  /** Busy flag triggering disabled inputs and saving loader indicators */
  isSaving: boolean;
}
