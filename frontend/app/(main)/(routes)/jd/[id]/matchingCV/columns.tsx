import { FormatDateTime } from "@/src/util/common";
import { ColumnsType } from "antd/es/table";

export const columns = (
  onOpen?: () => void
): ColumnsType<API.CvItem> => {
  return [
    {
      title: "#",
      key: "#",
      align: "center",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "CV Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Recruiter",
      dataIndex: "recruiter",
      key: "recruiter",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
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
      width: 600,
      render: (_, original) => (
        <div style={{
          textAlign: "left"
        }}>{original.experience_summary}</div>
      )
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
