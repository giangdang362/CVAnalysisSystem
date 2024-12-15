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
      title: "Job name",
      dataIndex: "name",
      key: "name",
      render: (_, original) => (
        <Link
          className="!text-blue-500"
          href={`${APP_ROUTES.JD.path}/${original?.name}`}
        >
          {original?.name}
        </Link>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, original) => <div>{original?.role}</div>,
    },
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (_, original) => <div>{original?.level}</div>,
    },
    {
      title: "Language",
      // dataIndex: "address",
      key: "Language",
      align: "center",
    },
    {
      title: "Technical skills",
      // dataIndex: "address",
      key: "expectedSalary",
      align: "center",
    },
    {
      title: "Job Description",
      // dataIndex: "address",
      key: "Job Description",
      width: "30%",
      align: "center",
    },
  ];
};
