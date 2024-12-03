"use client";

import React, { useState } from "react";
import AnalyzeCV from "@/components/AnalyzeCV";
import AnalyzeJD from "@/components/AnalyzeJD";
import { Button, Layout, Row, Col } from "antd";

const { Header, Content, Footer } = Layout;

export default function Home() {
  const [mode, setMode] = useState<"cv" | "jd" | null>(null);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529" }}>
        <h1 style={{ color: "white", textAlign: "center", margin: 0 }}>
          CV-JD Analysis System
        </h1>
      </Header>
      <Content style={{ padding: "24px", background: "#f0f2f5"}}>
        <Row justify="center" align="middle" style={{ minHeight: "70vh" }}>
          <Col xs={24} sm={24} md={18} lg={16}>
            {!mode && (
              <div style={{ textAlign: "center" }}>
                <h2>Welcome to CV-JD Analysis System</h2>
                <p>Select the type of analysis you want to perform:</p>
                <div style={{ marginTop: "20px" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setMode("cv")}
                    style={{ marginRight: "20px" }}
                  >
                    Analyze CV
                  </Button>
                  <Button type="primary" size="large" onClick={() => setMode("jd")}>
                    Analyze JD
                  </Button>
                </div>
              </div>
            )}
            {mode === "cv" && <AnalyzeCV onBack={() => setMode(null)} />}
            {mode === "jd" && <AnalyzeJD onBack={() => setMode(null)} />}
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        CV Analysis System ©2024 Created with Ant Design
      </Footer>
    </Layout>
  );
}
