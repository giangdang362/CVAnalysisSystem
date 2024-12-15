import { ColumnsType } from "antd/es/table";

export const columns = (): ColumnsType<API.CvItem> => {
  return [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'applicant_name',
      dataIndex: 'applicant_name',
      key: 'applicant_name',
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
      title: 'recruiter',
      dataIndex: 'recruiter',
      key: 'recruiter',
      width: '20%',
      render: (_, original) => (
        <div>{original.recruiter}</div>
      )
    },
  ]
}