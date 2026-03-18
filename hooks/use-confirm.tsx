import { JSX, useState } from "react";
import { Button } from '@/components/ui/button';
import ResponsiveDialog from '@/components/responsive-dialog';

export const useConfirm = (
  title: string,
  description: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveDialog
      open={!!promise}
      onOpenChange={handleClose}
      title={title}
      description={description}
    >
      <div className='flex items-center gap-x-2 gap-y-2 flex-col-reverse pt-4 w-full lg:flex-row justify-end'>
        <Button className="w-full lg:w-auto" variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button className="w-full lg:w-auto" variant="destructive" onClick={handleConfirm}>Delete</Button>
      </div>
    </ResponsiveDialog>
  );

  return [ConfirmationDialog, confirm];
};