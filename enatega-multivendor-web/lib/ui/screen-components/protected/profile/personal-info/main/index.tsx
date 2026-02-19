"use client";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import ProfileDetailsSkeleton from "@/lib/ui/useable-components/custom-skeletons/profile.details.skelton";
import TextComponent from "@/lib/ui/useable-components/text-field";
import { getInitials } from "@/lib/utils/methods";
import { useQuery } from "@apollo/client";
import "primeicons/primeicons.css";

export default function PersonalInfoMain() {
  const { data: profileData, loading: profileLoading } = useQuery(
    GET_USER_PROFILE,
    {
      fetchPolicy: "network-only",
    }
  );

  const initials = getInitials(profileData?.profile?.name);

  if (!profileLoading) {
    return (
      <div className="p-6 w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4 mb-6 ">
          {/* Custom Avatar with Tailwind */}
          <div className="relative h-16 w-16 flex-shrink-0 bg-primary-light dark:bg-gray-800 rounded-full border-2 border-white dark:border-gray-700 shadow-sm  shadow-gray-400 dark:shadow-black/40">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-gray-500 dark:text-gray-200">
              {initials}
            </div>
          </div>
          <TextComponent
            text={profileData?.profile?.name || "N/A"}
            className="md:text-xl text-lg font-semibold text-gray-900 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <TextComponent
              text="Email"
              className="text-black dark:text-white font-semibold text-base md:text-lg"
            />
            <TextComponent
              text={profileData?.profile?.email || "N/A"}
              className="font-normal text-sm md:text-base text-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <TextComponent
              text="Role"
              className="text-black dark:text-gray-200 font-semibold text-base md:text-lg"
            />
            <TextComponent
              text={profileData?.profile?.role || "customer"}
              className="font-normal text-sm md:text-base text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <ProfileDetailsSkeleton />;
  }
}
