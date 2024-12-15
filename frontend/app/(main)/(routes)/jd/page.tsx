"use client";

import { ConfigProvider, message, Table } from "antd";
import { useEffect, useState } from "react";
import { getCVList } from "@/src/services/cv";
import { columns } from "./column";

const TablePage = () => {

  const [cvRes, setCVRes] = useState<API.ResponseGetListCV>();
  const [loading, setLoading] = useState<boolean>(false);  // Trạng thái loading cho button

  useEffect(() => {
    // Fetch CV list on component mount
    const fetchCVs = async () => {
      setLoading(true)
      try {
        const res = await getCVList();
        setCVRes(res);
      } catch (error) {
        message.error("Failed to fetch CV List.");
      }
      setLoading(false);
    };
    fetchCVs();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          motion: false,
        },
      }}
    >
      <div>
        <Table
          loading={loading}
          columns={columns()}
          dataSource={cvRes?.data}
        />
      </div>
    </ConfigProvider>
  );
};

export default TablePage;
