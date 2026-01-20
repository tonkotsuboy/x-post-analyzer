"use client";

import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";

import styles from "./TweetButton.module.css";

interface TweetButtonProps {
  text: string;
}

export function TweetButton({ text }: TweetButtonProps): React.ReactNode {
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
      disabled={text.length === 0}
      fullWidth={true}
      className={styles.button}
    >
      {t("button")}
    </Button>
  );
}
