"use client";

import { IProtectedHomeLayoutComponent } from "@/lib/utils/interfaces";
import PaddingContainer from "@/lib/ui/useable-components/containers/padding";

export default function HomeLayout({
  children,
}: IProtectedHomeLayoutComponent) {
  return (
    <div className="w-screen h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <PaddingContainer>{children}</PaddingContainer>
      </div>
    </div>
  );
}
