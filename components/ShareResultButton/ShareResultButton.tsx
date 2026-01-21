"use client";

import { Button } from "@mantine/core";
import { IconBrandX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";


import styles from "./ShareResultButton.module.css";

import type { Grade } from "../../lib/types";
import type { FC } from "react";

interface ShareResultButtonProps {
  score: number;
  grade: Grade;
}

export const ShareResultButton: FC<ShareResultButtonProps> = ({
  score,
  grade,
}) => {
  const t = useTranslations("share");

  const handleShare = (): void => {
    const shareText = t("text", { score, grade });
    const encodedText = encodeURIComponent(shareText);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      size="md"
      onClick={handleShare}
      leftSection={<IconBrandX size={18} />}
      className={styles.button}
    >
      {t("button")}
    </Button>
  );
};
