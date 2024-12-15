"use client";

import { Button, ConfigProvider, message, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { getJDList } from "@/src/services/jd";
import { PlusOutlined } from "@ant-design/icons";

import { columns } from "./column";
import { useModal } from "@/hooks/use-modal-store";
import ModalComponent from "./modal";

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John dog",
    age: 42,
    address: "10 Downing Street",
  },
];

const TablePage = () => {
  const [jdRes, setJDRes] = useState<API.ResponseGetListJD>();
  const [loading, setLoading] = useState<boolean>(false);

  const { onOpen } = useModal();

  const showModal = () => {
    onOpen();
  };

  useEffect(() => {
    // Fetch JD list on component mount
    const fetchJDs = async () => {
      setLoading(true);
      try {
        const res = await getJDList();
        setJDRes(res);
      } catch (error) {
        message.error("Failed to fetch JD List.");
      }
      setLoading(false);
    };
    fetchJDs();
  }, []);

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

      <Table
        loading={loading}
        columns={columns()}
        // dataSource={jdRes?.data}
        dataSource={dataSource}
      />

      <ModalComponent />
    </ConfigProvider>
  );
};

export default TablePage;
