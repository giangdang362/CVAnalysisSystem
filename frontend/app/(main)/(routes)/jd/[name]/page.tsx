"use client";

import React, { useMemo, useState } from "react";
import { Button, Tabs, TabsProps } from "antd";
import ApplicantDetail from "./jobDetail";
import MatchingJD from "./listOfApplicant";

interface Props {
  params: {
    name: string;
  };
}

const Page = ({ params }: Props) => {
  const { name } = params;
  const decodeNameParam = decodeURIComponent(name);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Job detail",
      children: <ApplicantDetail name={decodeNameParam} />,
    },
    {
      key: "2",
      label: "List of applicant",
      children: <MatchingJD />,
    },
  ] as const;

  type KeySelectTabYType = (typeof items)[number]["key"];
  const [activeKey, setActiveKey] = useState<KeySelectTabYType>("1");

  const handleTabChange = (key: KeySelectTabYType) => {
    setActiveKey(key);
  };

  type PositionType = "right";
  const OperationsSlot: Record<PositionType, React.ReactNode> = {
    right: <Button>AI Analysis</Button>,
  };

  const slot = useMemo(() => {
    if (activeKey.length === 0) {
      return null;
    }
    return activeKey === "2" ? OperationsSlot : null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  return (
    <div>
      <div className="text-2xl font-bold">{decodeNameParam}</div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={handleTabChange}
        tabBarExtraContent={slot}
      />
    </div>
  );
};

export default Page;
