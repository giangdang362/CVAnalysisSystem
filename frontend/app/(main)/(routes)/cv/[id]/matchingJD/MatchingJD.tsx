"use client";

import React from "react";
import { Table } from "antd";

import { useModalDetail } from "@/hooks/use-modal-store";
import ModalJDDetail from "../modalJDDetail";
import { columns } from "./column";

const MatchingJD = ({data}: {data: API.JdItem[]}) => {
  const { onOpen } = useModalDetail();

  return (
    <div>
      <Table
        columns={columns(onOpen)}
        dataSource={data}
      />

      <ModalJDDetail />
    </div>
  );
};

export default MatchingJD;
