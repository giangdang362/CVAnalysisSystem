"use client";

import React from "react";

interface Props {
  item: API.CvItem;
}

const CvDetail = ({ item }: Props) => {
  console.log("🚀 ~ CvDetail ~ item:", item)
  return (
    <div>
      <div className="text-5xl font-bold mb-5">{item.applicant_name}</div>
      <div className="flex flex-col gap-2">
        <p>
          <span className="font-bold">Role:</span> {item.role}
        </p>
        <p>
          <span className="font-bold">Recruiter:</span> {item.recruiter}
        </p>
      </div>
      <embed src={item.path_file} className="w-full h-[calc(60dvh)]" />
    </div>
  );
};

export default CvDetail;
