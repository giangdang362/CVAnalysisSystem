"use client";

import { Form, message, Modal, UploadFile } from "antd";
import { FC, useEffect, useState } from "react";
import { postNewCv, putCv } from "@/src/services/cv";
import { getRoles, uploadFile } from "@/src/services";
import { ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton } from "@ant-design/pro-components";
import { formItemRule } from "@/src/util/ruleForm";

interface CreateUpdateFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curItem?: API.CvItem;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setCurItem: React.Dispatch<React.SetStateAction<API.CvItem>>;
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
  const handleSave = async (formItem: API.CvItem) => {
    setLoading(true);
    let path_file = null;
    if (selectedFile) {
      try {
        path_file = await uploadFile(selectedFile, "cv");
      } catch (error) {
        console.error("Error uploading file:", error);
        message.error("File upload failed. Please try again!");
        return;
      }
    }

    const payload: API.CvItem = {
      id: curItem.id,
      name: formItem.name,
      recruiter: formItem.recruiter,
      role: roleSelected ? roleSelected : curItem.role,
      education: formItem.education,
      expect_salary: formItem.expect_salary,
      experience_summary: formItem.experience_summary,
      path_file: path_file,
    };

    try {
      if (!curItem?.id) {
        await postNewCv(payload);
        message.success("Create successfully!");
      } else {
        const {  path_file ,...rest } = payload;
        await putCv(selectedFile ? payload : {
          ...rest,
          path_file: curItem.path_file
        });
        message.success("Update successfully!");
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      message.error("Failed. Please try again!");
    } finally {
      setLoading(false);
      setReload((pre) => !pre);
      handleCloseModal();
    }
  };


  useEffect(() => {
    form.setFieldValue('recruiter', curItem?.recruiter);
    form.setFieldValue('name', curItem?.name);
    form.setFieldValue('role', curItem.role);
    form.setFieldValue('education', curItem?.education);
    form.setFieldValue('expect_salary', curItem?.expect_salary);
    form.setFieldValue('experience_summary', curItem?.experience_summary);
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
  }, [curItem]);

  return (
    <Modal
      title={!curItem.id ? "Add new CV" : "Edit CV"}
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
              label="Recruiter"
              placeholder={''}
              name={'recruiter'}
              rules={[formItemRule.required()]}
              allowClear
            />
            <ProFormText
              label="CV Name"
              placeholder={''}
              name={'name'}
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
              label="Education"
              placeholder={''}
              name={'education'}
              rules={[formItemRule.required()]}
              allowClear
            />
            <ProFormText
              label="Expected Salary"
              placeholder={''}
              name={'expect_salary'}
              rules={[formItemRule.required()]}
              allowClear
            />
          </div>
          <div className="w-full">
            <ProFormTextArea
              label="Experience Summary"
              placeholder={''}
              name={'experience_summary'}
              rules={[formItemRule.required()]}
              allowClear
              fieldProps={{ rows: 5 }}
            />
            <ProFormUploadButton
              label="Upload CV"
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
