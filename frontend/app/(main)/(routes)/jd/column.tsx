import { APP_ROUTES } from "@/src/configs/routes";
import { deleteJd } from "@/src/services/jd";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

export const columns = (
  handleSetCurItem: (x: API.JdItem) => void,
  handleSetShowModalForm: () => void,
  handleReload: () => void,
): ColumnsType<API.JdItem> => {
  const handleClickEdit = (x: API.JdItem) => {
    handleSetCurItem(x);
    handleSetShowModalForm();
    handleReload();
  };
  const { confirm } = Modal;
  const showDeleteConfirm = (id: number) => {
    confirm({
      title: 'Delete this Jd',
      icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
      content: 'Do you really want to delete this item? This process can not be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteJd(id).then(() => {
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
      // dataIndex: "name",
      key: "#",
      align: "center",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Job Name",
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
      title: "Technical Skills",
      dataIndex: "technical_skill",
      key: "technical_skill",
      align: "center",
    },
    {
      title: "Job Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      width: 500,
      render: (_, original) => (
        <div style={{
          textAlign: "left"
        }}>{original.description}</div>
      )
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
