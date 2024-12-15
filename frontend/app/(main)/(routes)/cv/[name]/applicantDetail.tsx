"use client";

import React from "react";
import { Tabs, TabsProps } from "antd";

interface Props {
  name: string;
}

const ApplicantDetail = ({ name }: Props) => {
  return (
    <div>
      <div className="text-5xl font-bold mb-5">{name}</div>
      <div className="flex flex-col gap-2">
        <p>
          <span className="font-bold">Role:</span> Dep
        </p>
        <p>
          <span className="font-bold">Level:</span>Level: Sen
        </p>
      </div>
      <embed src="/Angular developer(1).pdf" className="w-full h-[calc(60dvh)]" />
    </div>
  );
};

export default ApplicantDetail;
