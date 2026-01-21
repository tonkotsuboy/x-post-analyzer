"use client";

import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";


import { getGraphemeCount } from "../../lib/utils";

import styles from "./TweetButton.module.css";

import type { FC } from "react";

interface TweetButtonProps {
  text: string;
}

export const TweetButton: FC<TweetButtonProps> = ({ text }) => {
  const t = useTranslations("tweet");

  const handleTweet = (): void => {
    const encodedText = encodeURIComponent(text);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      size="lg"
      onClick={handleTweet}
      disabled={getGraphemeCount(text) === 0}
      fullWidth={true}
      className={styles.button}
    >
      {t("button")}
    </Button>
  );
};
