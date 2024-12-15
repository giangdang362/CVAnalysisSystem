import { ColumnsType } from "antd/es/table";

export const columns = (): ColumnsType<API.JdItem> => {
  return [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'company_name',
      dataIndex: 'company_name',
      key: 'company_name',
      width: '20%',
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'role',
      width: '20%',
      render: (_, original) => (
        <div>{original.role}</div>
      )
    },
    {
      title: 'level',
      dataIndex: 'level',
      key: 'level',
      width: '20%',
      render: (_, original) => (
        <div>{original.level}</div>
      )
    },
  ]
}