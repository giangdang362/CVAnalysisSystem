"use client";

import React from "react";
import { Tabs, TabsProps } from "antd";
import ApplicantDetail from "./applicantDetail";
import MatchingJD from "./matchingJD";

interface Props {
  params: {
    name: string;
  };
}

const Page = ({ params }: Props) => {
  const { name } = params;
  const decodeNameParam = decodeURIComponent(name);

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Applicant's detail",
      children: <ApplicantDetail name={decodeNameParam} />,
    },
    {
      key: "2",
      label: "Matching JDs",
      children: <MatchingJD />,
    },
  ];

  return (
    <div>
      <div className="text-2xl font-bold">{decodeNameParam}</div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default Page;
