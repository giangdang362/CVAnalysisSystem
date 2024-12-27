"use client";

import { Form, message, Modal, UploadFile } from "antd";
import { FC, useEffect, useState } from "react";
import { ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton } from "@ant-design/pro-components";
import { formItemRule } from "@/src/util/ruleForm";
import { getRoles, uploadFile } from "@/src/services";
import { postNewJd, putJd } from "@/src/services/jd";

interface CreateUpdateFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curItem?: API.JdItem;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setCurItem: React.Dispatch<React.SetStateAction<API.JdItem>>;
}

const CreateUpdateForm: FC<CreateUpdateFormProps> = ({
  showModal,
  setShowModal,
  curItem,
  setReload,
  setCurItem,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [listRoleData, setListRoleData] = useState<string[]>([]);
  const [roleSelected, setRoleSelected] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [curFile, setCurFile] = useState<UploadFile<any>[]>([]);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurItem({});
    setCurFile([]);
    setReload((pre) => !pre);
    setLoading(false);
    form?.resetFields();
  }

  const handleGetListRole = async () => {
    const res = await getRoles();
    if (res) {
      setListRoleData(res.data ?? []);
    }
  };
  const handleFileChange = (info) => {
    const { file } = info;

    if (file.status === "done" || file.status === "uploading") {
      setSelectedFile(file.originFileObj);
      setCurFile(file.fileList)
    } else if (file.status === "removed") {
      setSelectedFile(null);
    }
  };
  const handleSave = async (formItem: API.JdItem) => {
    setLoading(true);
    let path_file = null;
    if (selectedFile) {
      try {
        path_file = await uploadFile(selectedFile, "jd");
      } catch (error) {
        console.error("Error uploading file:", error);
        message.error("File upload failed. Please try again!");
        return;
      }
    }

    const payload: API.JdItem = {
      id: curItem.id,
      name: formItem.name,
      company_name: formItem.company_name,
      role: roleSelected ? roleSelected : curItem.role,
      level: formItem.level,
      languages: formItem.languages,
      technical_skill: formItem.technical_skill,
      description: formItem.description,
      requirement: formItem.requirement,
      path_file: path_file,
    };

    try {
      if (!curItem?.id) {
        await postNewJd(payload);
        message.success("Create successfully!");
      } else {
        const { path_file, ...rest } = payload;
        await putJd(selectedFile ? payload : {
          ...rest,
          path_file: curItem.path_file
        });
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      message.error("Failed. Please try again!");
    } finally {
      handleCloseModal();
    }
  };


  useEffect(() => {
    form.setFieldValue('name', curItem?.name);
    form.setFieldValue('company_name', curItem?.company_name);
    form.setFieldValue('role', curItem.role);
    form.setFieldValue('level', curItem?.level);
    form.setFieldValue('languages', curItem?.languages);
    form.setFieldValue('technical_skill', curItem?.technical_skill);
    form.setFieldValue('description', curItem?.description);
    form.setFieldValue('requirement', curItem?.requirement);

    if (curItem?.id && curItem?.path_file) {
      const initialFileList: UploadFile<any>[] = [
        {
          uid: '-1',
          name: curItem?.path_file.substring(40) || '',
          status: 'done',
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      ];
      setCurFile(initialFileList);
      form.setFieldsValue({ path_file: initialFileList });
    } else {
      setCurFile([]);
      form.setFieldsValue({ path_file: "" });
    }

    handleGetListRole();
  }, [curItem, form]);

  return (
    <Modal
      title={!curItem.id ? "Add new JD" : "Edit JD"}
      open={showModal}
      onOk={() => form.submit()}
      onCancel={handleCloseModal}
      className="w-full"
      width={1000}
      okText="Save"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout={"vertical"}
        onFinish={handleSave}
        variant={"filled"}
        onReset={() => form.resetFields()}
        style={{
          padding: '12px 0',
        }}
      >
        <div className="flex gap-5">
          <div className="w-full">
            <ProFormText
              label="Job Name"
              placeholder={''}
              name={'name'}
              rules={[formItemRule.required()]}
              allowClear
            />
            <ProFormText
              label="Company Name"
              placeholder={''}
              name={'company_name'}
              rules={[formItemRule.required()]}
              allowClear
            />
            <ProFormSelect
              label="Role"
              name={'role'}
              rules={[formItemRule.required()]}
              placeholder={'Select role'}
              options={listRoleData?.map((item) => ({ label: item, value: item }))}
              mode="single"
              onChange={setRoleSelected}
              allowClear
            />
            <ProFormText
              label="Level"
              placeholder={''}
              name={'level'}
              rules={[formItemRule.required()]}
              allowClear
            />
            <ProFormText
              label="Languages"
              placeholder={''}
              name={'languages'}
              rules={[formItemRule.required()]}
              allowClear
            />
            <ProFormText
              label="Technical skill"
              placeholder={''}
              name={'technical_skill'}
              rules={[formItemRule.required()]}
              allowClear
            />
          </div>
          <div className="w-full">
            <ProFormTextArea
              label="Description"
              placeholder={''}
              name={'description'}
              rules={[formItemRule.required()]}
              allowClear
              fieldProps={{ rows: 6 }}
            />
            <ProFormTextArea
              label="Requirement"
              placeholder={''}
              name={'requirement'}
              rules={[formItemRule.required()]}
              allowClear
              fieldProps={{ rows: 5 }}
            />
            <ProFormUploadButton
              label="Upload JD"
              title={"Choose file"}
              name={'path_file'}
              max={1}
              fieldProps={{
                accept: ".docx,.pdf",
                onRemove: () => {
                  setCurFile([]);
                  form.setFieldsValue({ file: undefined });
                },
                onChange: handleFileChange,
              }}
              fileList={curFile}
              rules={[formItemRule.required()]}
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateForm;
