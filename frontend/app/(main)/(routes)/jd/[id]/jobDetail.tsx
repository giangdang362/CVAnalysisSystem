"use client";

import React from "react";
import { convertString } from "@/src/util/convertString";

interface Props {
  item: API.JdItem;
}

const JobDetail = ({ item }: Props) => {
  return (
    <div>
      <div className="text-3xl font-bold mb-5 border-b pb-2">{item.name}</div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-14 flex-[2]">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">Description</p>
            <p>
              {item?.description}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">Requirements</p>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  convertString(item?.requirement ?? ""),
              }}
            />
          </div>
        </div>
        <div className="border-white border-2 border-solid rounded-xl p-5 flex-1 flex flex-col gap-5">
          <div>
            <p className="font-bold text-xl">Role</p>
            <p className="text-lg">{item?.role}</p>
          </div>
          <div>
            <p className="font-bold text-xl">Level</p>
            <p className="text-lg">{item?.level}</p>
          </div>
          <div>
            <p className="font-bold text-xl">language</p>
            <p className="text-lg">{item?.languages}</p>
          </div>
          <div>
            <p className="font-bold text-xl">Domain</p>
            <p className="text-lg">{item?.technical_skill}</p>
          </div>
          <div>
            <p className="font-bold text-xl">Tech satck</p>
            <p className="text-lg">{item?.technical_skill}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
