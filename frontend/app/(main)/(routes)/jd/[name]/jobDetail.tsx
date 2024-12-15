"use client";

import React from "react";
import { convertString } from "@/util/convertString";

interface Props {
  name: string;
}

const ApplicantDetail = ({ name }: Props) => {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-14 flex-[2]">
        <div className="flex flex-col gap-3">
          <p className="font-bold text-3xl">Description</p>
          <p>
            We are seeking a highly skilled and experienced Senior iOS Developer
            to join our dynamic team. In this role, you will lead the
            development of innovative, high- quality mobile applications for our
            iOS platform. As a senior member of the team, you will collaborate
            closely with cross-functional teams to design, build, and maintain
            scalable, user-friendly applications that meet and exceed client
            expectations.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-bold text-3xl">Requirements</p>
          <div
            dangerouslySetInnerHTML={{
              __html:
                convertString(`Architect, design, and develop robust and user-centric iOS
            applications using Swift and Objective-C. 
            \nLead technical
            discussions and drive best practices in mobile app development. 
            \nCollaborate with product managers, UI/UX designers, and backend
            developers to define and implement app features and enhancements.`),
            }}
          />
        </div>
      </div>

      <div className="border-white border-2 border-solid rounded-xl p-5 flex-1 flex flex-col gap-5">
        <div>
          <p className="font-bold text-xl">Role</p>
          <p className="text-lg">Develop</p>
        </div>
        <div>
          <p className="font-bold text-xl">Level</p>
          <p className="text-lg">Develop</p>
        </div>
        <div>
          <p className="font-bold text-xl">Language</p>
          <p className="text-lg">Develop</p>
        </div>
        <div>
          <p className="font-bold text-xl">Domain</p>
          <p className="text-lg">Develop</p>
        </div>
        <div>
          <p className="font-bold text-xl">Tech satck</p>
          <p className="text-lg">Develop</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;
