// lib/utils/constants/profileDefaultTabs.ts
"use client";
import { useTranslations } from "next-intl";
import { ITabItem } from "@/lib/utils/interfaces";

export const useProfileDefaultTabs = (): ITabItem[] => {
  const t = useTranslations();
  return [
    { label: t("profileDefaultTabs.tab1"), path: "/profile" },
    { label: t("profileDefaultTabs.tab3"), path: "/profile/order-history" },
  ];
};
