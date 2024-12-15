import { APP_ROUTES } from "@/common/routes";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

export const columns = (): ColumnsType<API.JdItem> => {
  return [
    {
      title: "#",
      // dataIndex: "name",
      key: "#",
      align: "center",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      render: (_, original) => (
        <Link
          className="!text-blue-500"
          href={`${APP_ROUTES.CV.path}/${original?.name}`}
        >
          {original?.name}
        </Link>
      ),
    },
    {
      title: "company_name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "role",
      dataIndex: "role",
      key: "role",
      render: (_, original) => <div>{original?.role}</div>,
    },
    {
      title: "level",
      dataIndex: "level",
      key: "level",
      render: (_, original) => <div>{original?.level}</div>,
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
};
