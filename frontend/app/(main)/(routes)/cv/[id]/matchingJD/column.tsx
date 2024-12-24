import { ColumnsType } from "antd/es/table";

export const columns = (
  onOpen?: () => void
): ColumnsType<API.JdItem> => {
  return [
    {
      title: "#",
      key: "#",
      align: "center",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "JD Name",
      dataIndex: "name",
      key: "name",
      align: "center",
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
      title: "Language",
      dataIndex: "languages",
      key: "languages",
      align: "center",
    },
    {
      title: "Techstack",
      dataIndex: "technical_skill",
      key: "technical_skill",
      align: "center",
    },
    {
      title: "Job Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      width: 600,
      render: (_, original) => (
        <div style={{
          textAlign: "left"
        }}>{original.description}</div>
      )
    },
  ];
};
