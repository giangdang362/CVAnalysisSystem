"use client";

import { Button, ConfigProvider, message, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import { columns } from "./column";
import { useModal } from "@/src/hooks/use-modal-store";
import CreateUpdateModal from "./CreateUpdateModal";
import { getJDList } from "@/src/services/jd";

const TablePage = () => {
  const [res, setRes] = useState<API.ResponseGetListJD>();
  const [loading, setLoading] = useState<boolean>(false);

  const { onOpen } = useModal();

  const showModal = () => {
    onOpen();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getJDList();
        setRes(res);
      } catch (error) {
        message.error("Error. Please try again!");
      }
      setLoading(false);
    };
    fetchData();
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
        <div className="font-bold text-2xl">List of JDs</div>
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size={"middle"}
          onClick={showModal}
        >
          Add new JD
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns()}
        dataSource={res?.data}
      />
      <CreateUpdateModal />
    </ConfigProvider>
  );
};

export default TablePage;
