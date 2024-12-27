"use client";

import { Button, ConfigProvider, message, Table } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import { columns } from "./column";
import { getCVList } from "@/src/services/cv";
import CreateUpdateForm from "./CreateUpdateForm";

const TablePage = () => {
  const [res, setRes] = useState<API.ResponseGetListCV>();
  const [curItem, setCurItem] = useState<API.CvItem>();
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSetCurItem = (x: API.CvItem) => {
    setCurItem(x);
  };

  const handleGetCVList = () => {
    setLoading(true);
    getCVList()
      .then((res) => {
        setRes(res);
      })
      .catch(() => {
        message.error("Error. Please try again!");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    handleGetCVList();
  }, [reload, curItem]);

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
          onClick={() => setShowModal(true)}
        >
          Add new CV
        </Button>
      </div>

      <Table
        dataSource={res?.data}
        loading={loading}
        pagination={{
          showQuickJumper: true,
          defaultCurrent: 1,
          defaultPageSize: 10,
          total: res?.count ?? 0,
        }}
        columns={
          columns(
            handleSetCurItem,
            () => setShowModal(true),
            () => setReload((pre) => !pre)
          )
        }
      />
      <CreateUpdateForm
        curItem={curItem}
        setCurItem={setCurItem}
        setReload={setReload}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </ConfigProvider>
  );
};

export default TablePage;
