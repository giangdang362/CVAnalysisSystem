"use client";

import { Button, Modal, Table, TableProps } from "antd";
import { useModalResult } from "@/src/hooks/use-modal-store";
import ScoreButton from "@/components/ScoreButton";

const columns: TableProps<API.ResultAnalyzeItem>["columns"] = [
  {
    title: "JD",
    dataIndex: "name",
  },
  {
    title: "Overall Match Score",
    dataIndex: "overall_score",
    render: (_, original) => (
      <div className="flex justify-center">
        <Button style={{
          fontSize: "18px",
          fontWeight: 600,
          
        }}>{original.overall_score}</Button>
      </div>
    )
  },
  {
    title: "Tech Stack (30%)",
    dataIndex: "tech_stack",
    render: (_, original) => (
      <div className="flex justify-center">
        <ScoreButton score={original.tech_stack} />
      </div>
    )
  },
  {
    title: "Experience (30%)",
    dataIndex: "experience",
    render: (_, original) => (
      <div className="flex justify-center">
        <ScoreButton score={original.experience} />
      </div>
    )
  },
  {
    title: "Language (30%)",
    dataIndex: "language",
    render: (_, original) => (
      <div className="flex justify-center">
        <ScoreButton score={original.language} />
      </div>
    )
  },
  {
    title: "Leadership (10%)",
    dataIndex: "leadership",
    render: (_, original) => (
      <div className="flex justify-center">
        <ScoreButton score={original.leadership} />
      </div>
    )
  },
];

const ModalResult = ({data}: {
  data: API.ResultAnalyzeItem[]
}) => {
  const { isOpen, onClose } = useModalResult();

  return (
    <Modal
      title="Result Analyze"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      className="w-full"
      width={1000}
    >
      <Table
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: 900 }}
      />
    </Modal>
  );
};

export default ModalResult;
