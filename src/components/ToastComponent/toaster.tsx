'use client';

import type { ComponentProps, ComponentType, ReactNode } from 'react';
import {
  Toaster as OrgChakraToaster,
  Portal,
  Spinner,
  Stack,
  ToastRoot,
  ToastIndicator,
  ToastTitle as OrgToastTitle,
  ToastDescription as OrgToastDescription,
  ToastActionTrigger as OrgToastActionTrigger,
  ToastCloseTrigger,
  createToaster,
  type ToastOptions,
} from '@chakra-ui/react';

const ChakraToaster = OrgChakraToaster as ComponentType<
  Omit<ComponentProps<typeof OrgChakraToaster>, 'children' | 'toaster'> & {
    children: (toast: ToastOptions) => ReactNode;
    toaster: any;
    insetInline?: any;
  }
>;

const ToastTitle = OrgToastTitle as ComponentType<{ children?: ReactNode }>;
const ToastDescription = OrgToastDescription as ComponentType<{
  children?: ReactNode;
}>;
const ToastActionTrigger = OrgToastActionTrigger as ComponentType<{
  children?: ReactNode;
}>;

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast: ToastOptions) => (
          <ToastRoot width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <ToastIndicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </Stack>
            {toast.action && (
              <ToastActionTrigger>{toast.action.label}</ToastActionTrigger>
            )}
            <ToastCloseTrigger />
          </ToastRoot>
        )}
      </ChakraToaster>
    </Portal>
  );
};
