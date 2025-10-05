"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CustomBookButton } from "@/components/CustomBookButton";

export default function GlobalBookButton() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { t } = useTranslation();

  // Show only on allowed routes; hide on others like /room/[id]
  const allowShow = [/^\/$/, /^\/rooms$/, /^\/reviews$/].some((re) => re.test(pathname));
  if (!allowShow) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
      <CustomBookButton
        label={t("common.bookNow")}
        onClick={() => router.push("/rooms")}
      />
    </div>
  );
}
