"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, message, Tabs, TabsProps } from "antd";
import JobDetail from "./jobDetail";
import MatchingCV from "./matchingCV/MatchingCV";
import { getJdDetail } from "@/src/services/jd";
import { getMatchingJdToCvs } from "@/src/services/matching";

interface Props {
  params: {
    id: number;
  };
}

const Page = ({ params }: Props) => {
  const { id } = params;
  const [resJdDetail, setResJdDetail] = useState<API.ResponseJdDetail>();
  const [loading, setLoading] = useState<boolean>(true);

  const [resMatching, setResMatching] = useState<API.ResponseMatchingCvToJds>();

  useEffect(() => {
    getJdDetail(id)
      .then((res) => {
        setResJdDetail(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        message.error("Error fetching data!");
        setLoading(false);
      });
    getMatchingJdToCvs(id).then((res) => {
      setResMatching(res);
      setLoading(false);
    })
      .catch((error) => {
        console.error("API Error:", error);
        message.error("Error fetching data!");
        setLoading(false);
      });
  }, [id]);


  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Job detail",
      children: !resJdDetail ? null :  <JobDetail item={ resJdDetail?.data  ?? {}} />,
    },
    {
      key: "2",
      label: "List of applicant",
      children: !resMatching ? null : <MatchingCV data={resMatching.data ?? []} />,
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
