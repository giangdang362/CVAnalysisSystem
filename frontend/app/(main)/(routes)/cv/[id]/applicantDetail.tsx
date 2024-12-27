"use client";

import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Image, Spin } from "antd";

interface Props {
  item: API.CvItem;
}

const CvDetail = ({ item }: Props) => {
  const baseUrl = process.env.NEXT_PUBLIC_AWS_URL;
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div>
      <div className="text-3xl font-bold mb-5 border-b pb-2">{item.name}</div>
      <div className="flex gap-8">
        {/* PDF Viewer */}
        <div className="relative w-[70%] h-[calc(100vh-226px)] rounded-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#252628] rounded-lg">
              <Spin size="default" />
            </div>
          )}
          <iframe
            src={`https://docs.google.com/gview?url=${baseUrl}/${item.path_file}&embedded=true`}
            className={`w-full h-full border rounded-lg shadow-sm ${
              isLoading ? "invisible" : "visible"
            }`}
            frameBorder={0}
            onLoad={handleIframeLoad}
          />
        </div>

        {/* Right Section */}
        <div className="w-[30%] flex flex-col gap-4 px-7">
          {/* Avatar */}
          <div className="flex justify-center items-center mb-4">
            {item.avatar_url ? (
              <Image
                src={item.avatar_url}
                alt="Applicant Avatar"
                className="w-[120px] object-cover rounded-lg shadow-md border aspect-[4/6]"
              />
            ) : (
              <Avatar
                size={120}
                icon={<UserOutlined />}
                className="flex items-center justify-center border shadow-md"
              />
            )}
          </div>

          {/* Basic Info */}
          <div className="px-16 border rounded-lg shadow-sm">
            <p>
              <span className="font-bold">Role:</span> {item.role}
            </p>
            <p className="mt-2">
              <span className="font-bold">Recruiter:</span> {item.recruiter}
            </p>
            <p className="mt-2">
              <span className="font-bold">Education:</span> {item.education}
            </p>
            <p className="mt-2">
              <span className="font-bold">Expect Salary:</span> {item.expect_salary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvDetail;
