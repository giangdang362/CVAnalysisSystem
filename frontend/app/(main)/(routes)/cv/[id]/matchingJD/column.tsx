import { ColumnsType } from "antd/es/table";

export const columns = (
  onOpen: () => void
): ColumnsType<API.JdItem> => {
  return [
    {
      title: "#",
      key: "#",
      align: "center",
      render: (_, __, index) => <span>{index + 1}</span>,
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
      title: "language",
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
    },
  ];
};
