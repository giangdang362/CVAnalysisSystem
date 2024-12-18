import { APP_ROUTES } from "@/common/routes";
import { FormatDateTime } from "@/util/common";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

export const columns = (): ColumnsType<API.CvItem> => {
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
        <Link
          className="!text-blue-500"
          href={`${APP_ROUTES.CV.path}/${original?.id}`}
        >
          {original?.name}
        </Link>
      ),
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
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
      title: "experience summary",
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
      render: (_,original) => <>{FormatDateTime(original.created_at)}</>
    },
    {
      title: "Action",
      key: "Action",
      align: "center",
      render: () => <div className="flex items-center justify-evenly">
        <Button icon={<EditOutlined />} />
        <Button icon={<DeleteOutlined />} />
      </div>
    },
  ];
};
