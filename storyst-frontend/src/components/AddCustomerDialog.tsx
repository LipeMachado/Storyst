import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddCustomerForm from './AddCustomerForm';

interface AddCustomerDialogProps {
  buttonText?: string;
}

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({ buttonText = 'Adicionar Cliente' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um novo cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddCustomerForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;