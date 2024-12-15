"use client";

import { Modal } from "antd";

import { useModal } from "@/hooks/use-modal-store";

const ModalComponent = () => {
  const { isOpen, onClose } = useModal();

  return (
    <Modal title="Basic Modal" open={isOpen} onOk={onClose} onCancel={onClose}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

export default ModalComponent;
