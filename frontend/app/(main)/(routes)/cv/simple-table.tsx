"use client";

import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "#",
    // dataIndex: "name",
    key: "#",
    render: (props) => {
      return data?.indexOf(props) + 1;
    },
    align: "center",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <Link href={"#"}>{text}</Link>,
    align: "center",
  },
  {
    title: "Role",
    // dataIndex: "age",
    key: "role",
    align: "center",
  },
  {
    title: "Education",
    // dataIndex: "address",
    key: "Education",
    align: "center",
  },
  {
    title: "Expected Salary",
    // dataIndex: "address",
    key: "expectedSalary",
    align: "center",
  },
  {
    title: "Experience summary",
    // dataIndex: "address",
    key: "experience summary",
    width: "30%",
    align: "center",
  },
  {
    title: "Recruiter",
    // dataIndex: "address",
    key: "recruiter",
    align: "center",
  },
  {
    title: "Date added",
    // dataIndex: "address",
    key: "date added",
    align: "center",
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const SimpleTable = () => {
  return (
    <Table
      bordered={true}
      columns={columns}
      dataSource={data}
      scroll={{ x: 0 }}
    />
  );
};

export default SimpleTable;
