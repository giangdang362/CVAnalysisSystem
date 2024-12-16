"use client";

import React from "react";
import { Table } from "antd";

import { useModalDetail } from "@/hooks/use-modal-store";
import { columns } from "./columns";
import ModalCVDetail from "../ModalCVDetail";

const MatchingCV = ({data}: {data: API.CvItem[]}) => {
  const { onOpen } = useModalDetail();

  return (
    <div>
      <Table
        // loading={loading}
        columns={columns(onOpen)}
        dataSource={data}
      />

      <ModalCVDetail />
    </div>
  );
};

export default MatchingCV;
