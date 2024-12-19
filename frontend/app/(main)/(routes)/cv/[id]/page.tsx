"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, message, Tabs, TabsProps } from "antd";
import CvDetail from "./applicantDetail";
import { getCvDetail } from "@/src/services/cv";
import { getMatchingCvToJds } from "@/src/services/matching";
import MatchingJD from "./matchingJD/MatchingJD";
import { useModalResult } from "@/src/hooks/use-modal-store";

interface Props {
  params: {
    id: number;
  };
}

const Page = ({ params }: Props) => {
  const { id } = params;
  const { onOpen } = useModalResult();

  const [resCvDetail, setResCVDetail] = useState<API.ResponseCvDetail>();
  const [loading, setLoading] = useState<boolean>(true);

  const [resMatching, setResMatching] = useState<API.ResponseMatchingCvAndJd>();

  useEffect(() => {
    getCvDetail(id)
      .then((res) => {
        setResCVDetail(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        message.error("Error fetching data!");
        setLoading(false);
      });
    getMatchingCvToJds(id).then((res) => {
      setResMatching(res);
      setLoading(false);
    })
      .catch((error) => {
        console.error("API Error:", error);
        message.error("Error fetching data!");
        setLoading(false);
      });
  }, [id]);

  type KeySelectTabYType = (typeof items)[number]["key"];
  const [activeKey, setActiveKey] = useState<KeySelectTabYType>("1");

  const handleTabChange = (key: KeySelectTabYType) => {
    setActiveKey(key);
  };

  type PositionType = "right";
  const OperationsSlot: Record<PositionType, React.ReactNode> = {
    right: <Button loading={false} type="primary" onClick={onOpen}>Analyze Score</Button>,
  };

  const slot = useMemo(() => {
    if (activeKey.length === 0) {
      return null;
    }
    return activeKey === "2" ? OperationsSlot : null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Applicant's detail",
      children: !resCvDetail ? null : <CvDetail item={resCvDetail.data ?? {}} />,
    },
    {
      key: "2",
      label: "Matching JDs",
      children: !resMatching ? null : <MatchingJD cv_id={Number(id)} jd_ids={resMatching.ids} data={resMatching.data ?? []} />,
    },
  ];

  return (
    <div>
      {loading ? null :
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={handleTabChange}
          // tabBarExtraContent={slot}
        />
      }
    </div>
  );
};

export default Page;
