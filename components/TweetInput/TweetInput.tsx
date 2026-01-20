"use client";

import { Box, Button, Group, Text, Textarea } from "@mantine/core";
import { useTranslations } from "next-intl";

import styles from "./TweetInput.module.css";

interface TweetInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const MAX_CHARS = 280;

export function TweetInput({
  value,
  onChange,
  onAnalyze,
  isLoading,
}: TweetInputProps): React.ReactNode {
  const t = useTranslations("input");
  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = charCount === 0;

  return (
    <Box className={styles.container}>
      <Textarea
        className={styles.textarea}
        placeholder={t("placeholder")}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        minRows={4}
        maxRows={8}
        autosize={true}
        size="lg"
        error={isOverLimit}
      />
      <Group justify="space-between" mt="sm">
        <Text
          size="sm"
          c={isOverLimit ? "red" : charCount > MAX_CHARS * 0.9 ? "yellow" : "dimmed"}
        >
          {t("charCount", { count: charCount })}
        </Text>
        <Button
          onClick={onAnalyze}
          loading={isLoading}
          disabled={isEmpty || isOverLimit}
          size="md"
        >
          {isLoading ? t("analyzing") : t("analyzeButton")}
        </Button>
      </Group>
    </Box>
  );
}
