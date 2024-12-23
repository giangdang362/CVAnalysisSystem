"use client";

import React, { useState } from "react";
import { Button, Input, message, Table } from "antd";
import ModalResult from "../ModalResult";
import { columns } from "./column";
import { getAnalyzeResultCvToJds } from "@/src/services";
import { SearchOutlined } from "@ant-design/icons";
import { useModalResult } from "@/src/hooks/use-modal-store";

const MatchingJD = ({ data, cv_id, jd_ids }: {
  data: API.JdItem[],
  cv_id: number;
  jd_ids: number[];
}) => {
  const { onOpen } = useModalResult();
  const [res, setRes] = useState<API.ResponseResultAnalyze>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    setLoading(true);
    getAnalyzeResultCvToJds({ cv_id, jd_ids })
      .then((res) => {
        if (res.data.length) {
          message.success("Analyzed success!")
        }
        setRes(res);
        if (res.data.length) {
          setTimeout(() => {
            onOpen();
          }, 800);
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
        columns={columns()}
        dataSource={data}
      />
      <ModalResult data={res?.data ?? []} />
    </div>
  );
};

export default MatchingJD;
