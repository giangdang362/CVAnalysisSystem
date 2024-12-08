import React, { useState, useEffect } from "react";
import { Upload, Button, List, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getJDList } from "@/services/jd";
import ResultDisplay from "./ResultDisplay";
import { analyzeCV } from "@/services/cv";

interface Props {
  onBack: () => void;
}

const AnalyzeCV: React.FC<Props> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jdRes, setJDRes] = useState<API.ResponseGetListJD>(); // Sử dụng type API.JD
  const [result, setResult] = useState<API.ResponseAnalyze | null>(null); // Sử dụng type API.ResponseAnalyze
  const [loading, setLoading] = useState<boolean>(false);  // Trạng thái loading cho button

  // Fetch danh sách JD khi component mount
  useEffect(() => {
    const fetchJDs = async () => {
      try {
        const data = await getJDList(); // Định nghĩa type API.JD[] cho dữ liệu JD
        setJDRes(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        message.error("Failed to fetch JD List.");
      }
    };
    fetchJDs();
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      message.warning("Please upload a CV first!");
      return;
    }
    setLoading(true);  // Bật trạng thái loading
    try {
      const data: API.ResponseAnalyze = await analyzeCV(file); // Sử dụng type API.ResponseAnalyze
      setResult(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to analyze CV.");
    } finally {
      setLoading(false);  // Tắt trạng thái loading khi hoàn thành
    }
  };

  return (
    <div>
      <Button onClick={onBack} style={{ marginBottom: "20px" }}>
        Back
      </Button>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3>Upload CV</h3>
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
            accept=".pdf,.docx,.txt"
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleAnalyze}
            disabled={!file}
            loading={loading}  // Trạng thái loading cho button
            style={{ marginTop: "10px" }}
          >
            Analyze
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Available Job Descriptions</h3>
          <List
            bordered
            dataSource={jdRes?.data}
            renderItem={(jd) => <List.Item>{jd.name}</List.Item>}
          />
        </div>
      </div>
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default AnalyzeCV;
