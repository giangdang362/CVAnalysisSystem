import React, { useState, useEffect } from "react";
import { Upload, Button, List, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { analyzeJD } from "@/services/analyze";
import ResultDisplay from "@/components/ResultDisplay";
import { getCVList } from "@/services/cv";

interface Props {
  onBack: () => void;
}

const AnalyzeJD: React.FC<Props> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [cvRes, setCVRes] = useState<API.ResponseGetListCV>();
  const [result, setResult] = useState<API.ResponseAnalyze | null>(null);

  useEffect(() => {
    // Fetch CV list on component mount
    const fetchCVs = async () => {
      try {
        const res = await getCVList();
        setCVRes(res);
      } catch (error) {
        message.error("Failed to fetch CV List.");
      }
    };
    fetchCVs();
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      message.warning("Please upload a JD first!");
      return;
    }
    try {
      const data = await analyzeJD(file);
      setResult(data);
      message.success("Analysis completed successfully!");
    } catch (error) {
      message.error("Failed to analyze JD. Please try again.");
    }
  };

  return (
    <div>
      <Button onClick={onBack} style={{ marginBottom: "20px" }}>
        Back
      </Button>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3>Upload JD</h3>
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
          <h3>Available CVs</h3>
          <List
            bordered
            dataSource={cvRes?.data}
            renderItem={(cv) => <List.Item>{cv.cv_name}</List.Item>}
          />
        </div>
      </div>
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default AnalyzeJD;
