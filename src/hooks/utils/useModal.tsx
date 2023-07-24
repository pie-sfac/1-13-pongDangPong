import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return [isOpen, setIsOpen] as const;
};
