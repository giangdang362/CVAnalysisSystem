"use client";

import React from "react";

interface Props {
  item: API.CvItem;
}

const CvDetail = ({ item }: Props) => {
  const baseUrl = process.env.NEXT_PUBLIC_AWS_URL;

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
      <iframe
        src={`https://docs.google.com/gview?url=${baseUrl}/${item.path_file}&embedded=true`}
        className="w-full h-[calc(60dvh)]"
        frameBorder={0}
      />
    </div>
  );
};

export default CvDetail;
