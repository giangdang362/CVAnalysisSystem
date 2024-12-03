import { List } from "antd";
import React from "react";

interface Props {
  result: API.ResponseAnalyze; // Dữ liệu được trả về từ API
}

const ResultDisplay: React.FC<Props> = ({ result }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Analysis Results</h3>
      <p>{result.message}</p> {/* Hiển thị thông báo từ API */}
      <p>Total Items: {result.count}</p> {/* Hiển thị số lượng kết quả */}

      <List
        bordered
        dataSource={result.data} // Lấy danh sách kết quả xếp hạng
        renderItem={(item) => (
          <List.Item>
            <div>
              <strong>{item.name}</strong>: {item.score} points {/* Tên và điểm số */}
            </div>
            <p>{item.details}</p> {/* Chi tiết đánh giá */}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ResultDisplay;
