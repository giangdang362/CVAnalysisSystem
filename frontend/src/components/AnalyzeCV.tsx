import React, { useState, useEffect } from "react";
import { Upload, Button, List, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { analyzeCV } from "@/services/analyze";
import { getJDList } from "@/services/jd";
import ResultDisplay from "./ResultDisplay";

interface Props {
  onBack: () => void;
}

const AnalyzeCV: React.FC<Props> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jdRes, setJDRes] = useState<API.ResponseGetListJD>(); // Sử dụng type API.JD
  const [result, setResult] = useState<API.ResponseAnalyze | null>(null); // Sử dụng type API.ResponseAnalyze

  // Fetch danh sách JD khi component mount
  useEffect(() => {
    const fetchJDs = async () => {
      try {
        const data = await getJDList(); // Định nghĩa type API.JD[] cho dữ liệu JD
        setJDRes(data);
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
    try {
      const data: API.ResponseAnalyze = await analyzeCV(file); // Sử dụng type API.ResponseAnalyze
      setResult(data);
    } catch (error) {
      message.error("Failed to analyze CV.");
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
            renderItem={(jd) => <List.Item>{jd.jd_name}</List.Item>}
          />
        </div>
      </div>
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default AnalyzeCV;
