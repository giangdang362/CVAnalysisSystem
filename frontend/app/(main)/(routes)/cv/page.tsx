"use client";

import { ConfigProvider, message, Table } from "antd";
import { useEffect, useState } from "react";
import { getJDList } from "@/src/services/jd";
import { columns } from "./column";

const TablePage = () => {

  const [jdRes, setJDRes] = useState<API.ResponseGetListJD>();
  const [loading, setLoading] = useState<boolean>(false);  // Trạng thái loading cho button

  useEffect(() => {
    // Fetch JD list on component mount
    const fetchJDs = async () => {
      setLoading(true)
      try {
        const res = await getJDList();
        setJDRes(res);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          motion: false,
        },
      }}
    >
      <div>
        <Table
          loading={loading}
          columns={columns()}
          dataSource={jdRes?.data}
        />
      </div>
    </ConfigProvider>
  );
};

export default TablePage;
