import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EditCustomerForm from './EditCustomerForm';

interface EditCustomerDialogProps {
  customerId: string;
  buttonText?: string;
  onSuccess?: () => void;
}

const EditCustomerDialog: React.FC<EditCustomerDialogProps> = ({ 
  customerId, 
  buttonText = 'Editar', 
  onSuccess 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setTimeout(() => {
      setIsOpen(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize os dados do cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EditCustomerForm customerId={customerId} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;