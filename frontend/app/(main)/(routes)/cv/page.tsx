"use client";

import { Button, ConfigProvider, Modal } from "antd";

import SimpleTable from "./simple-table";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const TablePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          motion: true,
        },
      }}
    >
      <div className="flex justify-between items-center my-5">
        <div className="font-bold text-2xl">List of CVs</div>
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size={"middle"}
          onClick={showModal}
        >
          New CVs
        </Button>
      </div>

      <SimpleTable />

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </ConfigProvider>
  );
};

export default TablePage;
