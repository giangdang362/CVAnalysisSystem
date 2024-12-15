import { ColumnsType } from "antd/es/table";

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
      render: (_, original) => <div>{original.role}</div>,
    },
    {
      title: "level",
      dataIndex: "level",
      key: "level",
      render: (_, original) => <div>{original.level}</div>,
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
