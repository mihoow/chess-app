import * as Dialog from '@radix-ui/react-dialog';

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  isClosable = true,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  isClosable?: boolean;
}) {
  const handleOpenChange = (value: boolean) => {
    if (isClosable) {
      onOpenChange(value);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className='fixed z-40 inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out' />
        <Dialog.Content
          className='
            fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[90vw] max-w-sm rounded-lg
            bg-slate-900 text-slate-100 shadow-xl border border-slate-700
            p-6
            data-[state=open]:animate-scale-in
            data-[state=closed]:animate-scale-out
          '
          onEscapeKeyDown={isClosable ? undefined : (e) => e.preventDefault()}
          onPointerDownOutside={isClosable ? undefined : (e) => e.preventDefault()}
          onInteractOutside={isClosable ? undefined : (e) => e.preventDefault()}
        >
          {title && <Dialog.Title className='text-lg font-semibold mb-2'>{title}</Dialog.Title>}
          {description && (
            <Dialog.Description className='text-sm text-slate-300 mb-4'>{description}</Dialog.Description>
          )}

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
