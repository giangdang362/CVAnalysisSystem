import { create } from "zustand";

interface ModalData {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useModal = create<ModalData>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useModalResult = create<ModalData>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
