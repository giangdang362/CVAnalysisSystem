"use client";

import React, { useState } from "react";
import { Button, Input, message, Table } from "antd";


import { useModalResult } from "@/src/hooks/use-modal-store";
import { columns } from "./columns";
import { getAnalyzeResultJdToCvs } from "@/src/services";
import { SearchOutlined } from "@ant-design/icons";
import ModalResult from "../../../cv/[id]/ModalResult";

const MatchingCV = ({ data, jd_id, cv_ids }: {
  data: API.JdItem[],
  jd_id: number;
  cv_ids: number[];
}) => {
  const { onOpen } = useModalResult();
  const [res, setRes] = useState<API.ResponseResultAnalyze>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    setLoading(true);
    getAnalyzeResultJdToCvs({ jd_id, cv_ids })
      .then((res) => {
        if (res.data.length) {
          message.success("Analyzed success!")
        }
        setRes(res);
        if (res.data.length) {
          setTimeout(() => {
            onOpen();
          }, 500);
        }
      })
      .catch(() => {
        message.error("Error. Please try again!");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const handleAnalyze = () => {
    fetchData();
  }

  return (
    <div>
      <div className="flex justify-between">
        <Input
          style={{
            width: '300px',
            marginBottom: '24px',
          }}
          placeholder="Search by name"
          prefix={<SearchOutlined />}
          // onChange={(e) => handleNameChange(e.target.value)}
          allowClear
        />
        <div className="flex justify-between gap-3">
          <Button loading={loading} type="primary" disabled={res?.data.length ? true : false} onClick={handleAnalyze}>Analyze Score</Button>
          <Button type="primary" onClick={onOpen} disabled={res?.data.length ? false : true}>View Result</Button>
        </div>
      </div>
      <Table
        // loading={loading}
        columns={columns()}
        dataSource={data}
      />

      <ModalResult data={res?.data ?? []} />
    </div>
  );
};

export default MatchingCV;
