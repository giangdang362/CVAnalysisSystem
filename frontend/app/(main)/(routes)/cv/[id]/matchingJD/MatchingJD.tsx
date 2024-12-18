"use client";

import React, { useState } from "react";
import { Button, Input, message, Table } from "antd";
import ModalResult from "../ModalResult";
import { columns } from "./column";
import { getAnalyzeResult } from "@/src/services/matching";
import { SearchOutlined } from "@ant-design/icons";
import { useModalResult } from "@/hooks/use-modal-store";

const dataTable: API.ResultAnalyzeItem[] = [
  {
    "name": "AI Researcher 7y",
    "overall_score": 75,
    "tech_stack": 80,
    "experience": 40,
    "language": 100,
    "leadership": 90
  },
  {
    "name": "QA Tester 1y",
    "overall_score": 65,
    "tech_stack": 50,
    "experience": 70,
    "language": 90,
    "leadership": 20
  },
  {
    "name": "DevOps Engineer 5y",
    "overall_score": 58,
    "tech_stack": 50,
    "experience": 100,
    "language": 30,
    "leadership": 40
  },
  {
    "name": "Mobile Developer 3y",
    "overall_score": 46,
    "tech_stack": 80,
    "experience": 20,
    "language": 50,
    "leadership": 10
  },
  {
    "name": "UX Designer 2y",
    "overall_score": 42,
    "tech_stack": 50,
    "experience": 0,
    "language": 70,
    "leadership": 60
  },
  {
    "name": "Senior Frontend 2y",
    "overall_score": 40,
    "tech_stack": 10,
    "experience": 10,
    "language": 100,
    "leadership": 40
  },
  {
    "name": "Fullstack Developer 6y",
    "overall_score": 40,
    "tech_stack": 50,
    "experience": 10,
    "language": 40,
    "leadership": 100
  },
  {
    "name": "Data Scientist 4y",
    "overall_score": 38,
    "tech_stack": 10,
    "experience": 60,
    "language": 50,
    "leadership": 20
  },
  {
    "name": "Junior Backend 1y",
    "overall_score": 24,
    "tech_stack": 10,
    "experience": 50,
    "language": 10,
    "leadership": 30
  },
  {
    "name": "Product Manager 3y",
    "overall_score": 15,
    "tech_stack": 30,
    "experience": 0,
    "language": 0,
    "leadership": 60
  }
]


const MatchingJD = ({ data, cv_id, jd_ids }: {
  data: API.JdItem[],
  cv_id: number;
  jd_ids: number[];
}) => {
  const { onOpen } = useModalResult();
  const [res, setRes] = useState<API.ResponseResultAnalyze>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAnalyzeResult({ cv_id, jd_ids });
      setRes(res);
    } catch (error) {
      message.error("Error. Please try again!");
    }
    setLoading(false);
  };

  const handleAnalyze = () => {
    fetchData();
    !loading && onOpen();
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
      <ModalResult data={res?.data ?? dataTable} />
    </div>
  );
};

export default MatchingJD;
