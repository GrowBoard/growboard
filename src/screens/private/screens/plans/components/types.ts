import { PlanItem } from '@store';

export interface PlanCardProps {
  item: PlanItem;
  planIdx: number;
  onEdit: (item: PlanItem) => void;
  onDelete: (id: string) => void;
  onViewAbout: (item: PlanItem) => void;
  viewMode: 'card' | 'list';
}

export interface PlanFormDrawerProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  editItem: PlanItem | null;
  onSave: (plan: Omit<PlanItem, 'Id'> & { Id?: string }) => Promise<void>;
  isSaving: boolean;
}

export interface PlanAboutDrawerProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  item: PlanItem | null;
}

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  title: string;
  onConfirm: () => void;
}
