"use client";

import JDList from "@/components/JDList";
import UploadCV from "@/components/UploadCV";
import { Row, Col, Layout } from "antd";

const { Header, Content, Footer } = Layout;

export default function Home() {
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ backgroundColor: "#001529" }}>
          <h1 style={{ color: "white", textAlign: "center", margin: 0 }}>
            CV Analysis System
          </h1>
        </Header>
        <Content style={{ padding: "24px", background: "#f0f2f5" }}>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={24} md={12} lg={12}>
              <UploadCV />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <JDList />
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          CV Analysis System ©2024 Created with Ant Design
        </Footer>
      </Layout>
    </div>
  );
}
