"use client";

import { APP_ROUTES } from "@/src/configs/routes";
import { redirect } from "next/navigation";

const SetupPage = () => {
  return redirect(APP_ROUTES?.Dashboard?.path);
};

export default SetupPage;
