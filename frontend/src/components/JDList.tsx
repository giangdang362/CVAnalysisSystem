import React, { useState, useEffect } from "react";
import { Button, message, Collapse, Spin, Typography } from "antd";
import { getJDList, syncJDList } from "../services/jd";

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

const JDList: React.FC = () => {
  const [jdList, setJDList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Fetch danh sách JD từ API
  const fetchJDs = async () => {
    setLoading(true);
    try {
      const data = await getJDList();
      setJDList(data);
    } catch (error) {
      console.error("Error fetching JDs:", error);
      message.error("Failed to fetch JD List.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đồng bộ hóa danh sách JD
  const handleSync = async () => {
    setSyncing(true); // Hiển thị trạng thái đồng bộ
    try {
      const data = await syncJDList();
      message.success(`Sync Result: ${data.message}`);
      fetchJDs(); // Tải lại danh sách sau khi đồng bộ thành công
    } catch (error) {
      console.error("Error syncing JDs:", error);
      message.error("Failed to sync JD List.");
    } finally {
      setSyncing(false); // Ẩn trạng thái đồng bộ
    }
  };

  useEffect(() => {
    fetchJDs();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <Title level={3}>JD List</Title>
      <Button
        type="primary"
        onClick={handleSync}
        loading={syncing} // Hiển thị trạng thái loading trên nút
        style={{ marginBottom: "20px" }}
      >
        Sync JDs
      </Button>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin tip="Loading JD List..."  />
        </div>
      ) : (
        <Collapse>
          {jdList?.map((jd, index) => (
            <Panel header={jd.jd_name} key={index} style={{ textTransform: "capitalize" }}>
              <Paragraph>{jd.content}</Paragraph>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default JDList;
