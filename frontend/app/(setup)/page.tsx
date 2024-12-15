"use client";

import { APP_ROUTES } from "@/common/routes";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

const SetupPage = () => {
  return redirect(APP_ROUTES?.Dashboard?.path);
};

export default SetupPage;
