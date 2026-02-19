"use client";

import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";

import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";

export default function PersonalInfoScreen() {
  const t = useTranslations();
  const { data, loading, error } = useQuery(GET_USER_PROFILE);
  const profile = data?.profile;

  if (loading) {
    return <div className="p-6 text-gray-500">{t("loading")}</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error.message || "Failed to load profile"}
      </div>
    );
  }

  return (
    <PaddingContainer>
      <div className="py-10 space-y-6">
        <h1 className="text-2xl font-semibold">
          {t("ProfileSection.profile_label")}
        </h1>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{t("name_label")}</span>
            <span className="font-medium">{profile?.name || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{t("email_label")}</span>
            <span className="font-medium">{profile?.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{t("role_label")}</span>
            <span className="font-medium">{profile?.role || "customer"}</span>
          </div>
        </div>
      </div>
    </PaddingContainer>
  );
}
