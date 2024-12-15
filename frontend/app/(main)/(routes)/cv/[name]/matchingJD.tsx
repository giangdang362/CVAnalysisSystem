"use client";

import React from "react";
import { Table, TableProps } from "antd";

import { useModalJDDetail } from "@/hooks/use-modal-store";
import ModalJDDetail from "./modalJDDetail";

const MatchingJD = () => {
  const { onOpen } = useModalJDDetail();

  const colums: TableProps["columns"] = [
    {
      title: "#",
      // dataIndex: "name",
      key: "#",
      align: "center",
    },
    {
      title: "Job name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (_, original) => (
        <div
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          onClick={onOpen}
        >
          {original?.name}
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      render: (_, original) => <div>{original?.role}</div>,
    },
    {
      title: "Company name",
      dataIndex: "company_name",
      key: "company_name",
      align: "center",
    },
    {
      title: "role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (_, original) => <div>{original?.role}</div>,
    },
    {
      title: "Language",
      // dataIndex: "address",
      key: "Education",
      align: "center",
    },
    {
      title: "Techstack",
      // dataIndex: "address",
      key: "expectedSalary",
      align: "center",
    },
    {
      title: "Job Description",
      // dataIndex: "address",
      key: "experience summary",
      width: "30%",
      align: "center",
    },
  ];

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

  return (
    <div>
      <Table
        // loading={loading}
        columns={colums}
        // dataSource={jdRes?.data}
        dataSource={dataSource}
      />

      <ModalJDDetail />
    </div>
  );
};

export default MatchingJD;
