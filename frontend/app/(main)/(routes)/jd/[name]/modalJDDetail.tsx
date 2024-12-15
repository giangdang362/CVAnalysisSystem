"use client";

import { Modal, Table, TableProps } from "antd";

import { useModalJDDetail } from "@/hooks/use-modal-store";

interface DataType {
  key: string;
  name: string;
  age: number;
  tel: string;
  phone: number;
  address: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "CV",
    dataIndex: "key",
  },
  {
    title: "Overall Match Score",
    dataIndex: "name",
  },
  {
    title: "Tech Stack (30%)",
    dataIndex: "age",
  },
  {
    title: "Experience (30%)",
    dataIndex: "tel",
  },
  {
    title: "Language (30%)",
    dataIndex: "phone",
  },
  {
    title: "Leadership (10%)",
    dataIndex: "address",
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    tel: "0571-22098909",
    phone: 18889898989,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    tel: "0571-22098333",
    phone: 18889898888,
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    tel: "0575-22098909",
    phone: 18900010002,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 18,
    tel: "0575-22098909",
    phone: 18900010002,
    address: "London No. 2 Lake Park",
  },
  {
    key: "5",
    name: "Jake White",
    age: 18,
    tel: "0575-22098909",
    phone: 18900010002,
    address: "Dublin No. 2 Lake Park",
  },
];

const ModalJDDetail = () => {
  const { isOpen, onClose } = useModalJDDetail();

  return (
    <Modal
      title="JD Detail"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      className="w-full"
      width={1000}
    >
      <Table<DataType>
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: 900 }}
      />
    </Modal>
  );
};

export default ModalJDDetail;
