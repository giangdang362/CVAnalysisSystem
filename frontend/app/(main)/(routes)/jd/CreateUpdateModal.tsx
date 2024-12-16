"use client";

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
} from "antd";

import { useModal } from "@/hooks/use-modal-store";

const { Option } = Select;
const { TextArea } = Input;

const CreateUpdateModal = () => {
  const { isOpen, onClose } = useModal();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const customizeRequiredMark: (
    labelNode: React.ReactNode,
    info: {
      required: boolean;
    }
  ) => React.ReactNode = (label, { required }) => (
    <>
      {label}
      {required ? (
        <div className="flex items-center justify-center px-1 text-[#dc4c2c]">
          *
        </div>
      ) : null}
    </>
  );

  return (
    <Modal
      title="Add new JD"
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
        requiredMark={customizeRequiredMark}
      >
        <div className="flex gap-5">
          <div className="w-full">
            <Form.Item
              label="Job name"
              name="jobname"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="input Job name" />
            </Form.Item>
            <Form.Item
              label="Company name"
              name="company_name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="input Company name" />
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
                placeholder="Select a option and change input text above"
                allowClear
                showSearch
              >
                <Option value="Developer">Developer</Option>
                <Option value="UIUX">UIUX</Option>
                <Option value="BA">BA</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Level (Seniority)"
              name="level"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="Input Level" />
            </Form.Item>
            <Form.Item
              label="Language"
              name="language"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="Input Language" />
            </Form.Item>
          </div>
          <div className="w-full">
            <Form.Item
              label="Technical skills"
              name="technical_skills"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear placeholder="Input Technical skills" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea allowClear placeholder="Input Description" rows={5} />
            </Form.Item>
            <Form.Item
              label="Requirements"
              name="requirements"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea allowClear placeholder="Input Requirements" rows={5} />
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

export default CreateUpdateModal;
