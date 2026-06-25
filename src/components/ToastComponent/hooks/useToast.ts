import { toaster } from '../toaster';
import type { ToastOptions } from '@chakra-ui/react';

const useToast = () => {
  const toast = (options: ToastOptions) => toaster.create(options);

  toast.success = (options: Omit<ToastOptions, 'type'> | string) => {
    if (typeof options === 'string') {
      return toaster.create({ title: options, type: 'success' });
    }
    return toaster.create({ ...options, type: 'success' });
  };

  toast.error = (options: Omit<ToastOptions, 'type'> | string) => {
    if (typeof options === 'string') {
      return toaster.create({ title: options, type: 'error' });
    }
    return toaster.create({ ...options, type: 'error' });
  };

  toast.info = (options: Omit<ToastOptions, 'type'> | string) => {
    if (typeof options === 'string') {
      return toaster.create({ title: options, type: 'info' });
    }
    return toaster.create({ ...options, type: 'info' });
  };

  toast.warning = (options: Omit<ToastOptions, 'type'> | string) => {
    if (typeof options === 'string') {
      return toaster.create({ title: options, type: 'warning' });
    }
    return toaster.create({ ...options, type: 'warning' });
  };

  toast.loading = (options: Omit<ToastOptions, 'type'> | string) => {
    if (typeof options === 'string') {
      return toaster.create({ title: options, type: 'loading' });
    }
    return toaster.create({ ...options, type: 'loading' });
  };

  toast.dismiss = (id?: string) => toaster.dismiss(id);

  toast.promise = <T>(promise: Promise<T>, options: any) =>
    toaster.promise(promise, options);

  return toast;
};

export default useToast;
