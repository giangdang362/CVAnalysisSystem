"use client";

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
  UploadProps,
} from "antd";

import { useModal } from "@/hooks/use-modal-store";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const ModalComponent = () => {
  const { isOpen, onClose } = useModal();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const props: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        form.setFieldValue("file_url", "this's a path file"); // handle get and set path file form response after upload
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        form.setFieldValue("file_url", "this's a path file"); // handle get and set path file form response after upload
      }
    },
  };

  return (
    <Modal
      title="Add new CV"
      open={isOpen}
      onOk={() => {
        onClose();
        onReset();
      }}
      onCancel={() => {
        onClose();
        onReset();
      }}
      footer={null}
      className="w-full"
      width={1000}
    >
      <Form
        form={form}
        layout={"vertical"}
        onFinish={onFinish}
        variant={"filled"}
        onReset={onReset}
      >
        <div className="flex gap-5">
          <div className="w-full">
            <Form.Item
              label="Recruiter"
              name="recruiter"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="Enter Recruiter" />
            </Form.Item>
            <Form.Item
              label="Applicant's name"
              name="applicant_name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="Enter Applicant's name" />
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select role"
                allowClear
                showSearch
              >
                <Option value="Developer">Developer</Option>
                <Option value="UIUX">UIUX</Option>
                <Option value="BA">BA</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Education"
              name="education"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="Enter Education" />
            </Form.Item>
            <Form.Item
              label="Expected salary"
              name="expected_salary"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="Enter Expected salary" />
            </Form.Item>
          </div>
          <div className="w-full">
            <Form.Item
              label="Experience summary"
              name="experience_summary"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea
                allowClear
                placeholder="Enter Experience summary"
                rows={8}
              />
            </Form.Item>
            <Form.Item
              label="Date added"
              name="date_added"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="date" allowClear placeholder="Enter placeholder" />
            </Form.Item>
            <Form.Item
              label="Upload CV"
              name="file_url"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalComponent;
