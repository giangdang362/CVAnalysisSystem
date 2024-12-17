import { FormatDateTime } from "@/util/common";
import { ColumnsType } from "antd/es/table";

export const columns = (
  onOpen: () => void
): ColumnsType<API.CvItem> => {
  return [
    {
      title: "#",
      key: "#",
      align: "center",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      render: (_, original) => (
        <div
          className="!text-blue-500 cursor-pointer hover:!text-blue-700"
          onClick={onOpen}
        >
          {original?.name}
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, original) => <div>{original?.role}</div>,
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
      align: "center",
    },
    {
      title: "Expected Salary",
      dataIndex: "expect_salary",
      key: "expect_salary",
      align: "center",
    },
    {
      title: "Experience summary",
      dataIndex: "experience_summary",
      key: "experience_summary",
      align: "center",
    },
    {
      title: "Recruiter",
      dataIndex: "recruiter",
      key: "recruiter",
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (_, original) => <>{FormatDateTime(original.created_at)}</>
    },
  ];
};
