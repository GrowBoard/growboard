import React from 'react';

/**
 * Properties for the DialogContainer component.
 */
export interface DialogContainerProps {
  /** Controlling state showing if the dialog is open */
  isOpen: boolean;
  /** Triggered when the dialog open/close state is altered */
  onOpenChange: (details: { open: boolean }) => void;
  /** Optional title content to display in the header */
  title?: React.ReactNode;
  /** Main body markup rendering inside the dialog */
  children: React.ReactNode;
  /** Optional footer content or actions buttons row */
  footer?: React.ReactNode;
  /** Modal accessibility role, defaults to 'dialog' */
  role?: 'dialog' | 'alertdialog';
  /** Max width sizing specification, defaults to 'lg' */
  maxW?: string;
}
