import { ProjectItem } from '@store';

export interface ProjectCardProps {
  item: ProjectItem;
  projectIdx: number;
  onEdit: (item: ProjectItem) => void;
  onDelete: (id: string) => void;
  onViewAbout: (item: ProjectItem) => void;
  viewMode: 'card' | 'list';
}

export interface ProjectFormDrawerProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  editItem: ProjectItem | null;
  onSave: (project: Omit<ProjectItem, 'Id'> & { Id?: string }) => Promise<void>;
  isSaving: boolean;
}

export interface ProjectAboutDrawerProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  item: ProjectItem | null;
}

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  title: string;
  onConfirm: () => void;
}
