import React, { useState } from "react";
import { Upload, Button, message, Spin, Card, Descriptions } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { analyzeCV } from "../services/analyze";

const UploadCV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      message.warning("Please select a file first!");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeCV(file);
      setResult(data);
      message.success("CV analyzed successfully!");
    } catch (error) {
      console.error("Error uploading CV:", error);
      message.error("Failed to analyze CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Upload Your CV"
      bordered
      style={{ maxWidth: 600, margin: "20px auto" }}
    >
      <Upload
        beforeUpload={(file) => {
          setFile(file);
          return false; // Prevent auto-upload
        }}
        maxCount={1}
        accept=".pdf,.docx"
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>

      <Button
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={handleUpload}
        disabled={!file}
      >
        Analyze CV
      </Button>

      {loading && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Spin tip="Analyzing CV..." />
        </div>
      )}

      {result && !loading && (
        <Card
          title="Analysis Result"
          bordered
          style={{ marginTop: "20px" }}
          type="inner"
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="CV Name">
              {file?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Score">{result.score}</Descriptions.Item>
            <Descriptions.Item label="Remarks">
              {result.remarks}
            </Descriptions.Item>
            <Descriptions.Item label="Suggestions">
              {result.suggestions || "No suggestions available"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Card>
  );
};

export default UploadCV;
