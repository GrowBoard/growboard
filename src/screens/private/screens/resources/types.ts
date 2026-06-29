import { ResourceItem } from '@store';

/**
 * Props for the ResourceCard component.
 */
export interface ResourceCardProps {
  /** The resource data object */
  item: ResourceItem;
  /** Index position in grid */
  resourceIdx: number;
  /** Callback triggered when delete action is clicked */
  onDelete: (id: string) => void;
  /** Callback triggered when view about is clicked */
  onViewAbout: (item: ResourceItem) => void;
  /** Toggle view style */
  viewMode: 'card' | 'list';
}

/**
 * Props for the ResourceFormDrawer component.
 */
export interface ResourceFormDrawerProps {
  /** Visibility status of the drawer slide-out */
  isOpen: boolean;
  /** Callback to trigger visibility changes */
  onOpenChange: (details: { open: boolean }) => void;
  /** Callback to trigger upon successful form submit */
  onSave: (resource: Omit<ResourceItem, 'Id'>) => Promise<void>;
  /** Indicates whether the save action is currently processing */
  isSaving: boolean;
}

/**
 * Props for the DeleteConfirmDialog component.
 */
export interface DeleteConfirmDialogProps {
  /** Visibility status of the confirm dialog */
  isOpen: boolean;
  /** Callback to trigger visibility changes */
  onOpenChange: (details: { open: boolean }) => void;
  /** Callback triggered upon confirming deletion */
  onConfirm: () => void;
  /** The title of the resource to delete */
  title: string;
}

/**
 * Props for the ResourceAboutDrawer component.
 */
export interface ResourceAboutDrawerProps {
  /** Visibility status of the drawer */
  isOpen: boolean;
  /** Callback to trigger visibility changes */
  onOpenChange: (details: { open: boolean }) => void;
  /** The resource item to display about content for */
  item: ResourceItem | null;
}

