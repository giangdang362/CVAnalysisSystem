import { APP_ROUTES } from "@/src/configs/routes";
import { deleteCv } from "@/src/services/cv";
import { FormatDateTime } from "@/src/util/common";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

export const columns = (
  handleSetCurItem: (x: API.CvItem) => void,
  handleSetShowModalForm: () => void,
  handleReload: () => void,
): ColumnsType<API.CvItem> => {
  const handleClickEdit = (x: API.CvItem) => {
    handleSetCurItem(x);
    handleSetShowModalForm();
    handleReload();
  };
  const { confirm } = Modal;
  const showDeleteConfirm = (id: number) => {
    confirm({
      title: 'Delete this Cv',
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: 'Do you really want to delete this item? This process can not be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteCv(id).then(() => {
            message.success("Delete successfully!");
          });
          handleReload();
        } catch (error) {
          console.error('Error:', error);
        }
      },
    });
  };
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
      title: "Recruiter",
      dataIndex: "recruiter",
      key: "recruiter",
      align: "center",
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
      title: "Experience Summary",
      dataIndex: "experience_summary",
      key: "experience_summary",
      align: "center",
      width: 500,
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
    {
      title: "Action",
      key: "Action",
      align: "center",
      render: (_, original) =>
        <div
          style={{
            display: 'flex',
            justifyContent: "center",
            gap: '6px',
          }}
        >
          <Button onClick={() => {
            handleClickEdit(original);
          }} icon={<EditOutlined />} />
          <Button onClick={()=> showDeleteConfirm(original?.id ?? -1)} icon={<DeleteOutlined />} />
        </div>
    },
  ];
};
