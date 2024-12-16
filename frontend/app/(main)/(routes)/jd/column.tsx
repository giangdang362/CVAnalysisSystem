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
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Job name",
      dataIndex: "name",
      key: "name",
      render: (_, original) => (
        <Link
          className="!text-blue-500"
          href={`${APP_ROUTES.JD.path}/${original?.id}`}
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
      dataIndex: "languages",
      key: "languages",
      align: "center",
    },
    {
      title: "Technical skills",
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
