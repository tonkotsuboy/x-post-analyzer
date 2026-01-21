"use client";

import { Alert, Box, Button, Collapse, Group, PasswordInput, Stack, Text, Textarea } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";


import { getGraphemeCount, MAX_TWEET_LENGTH } from "../../lib/utils";

import styles from "./TweetInput.module.css";

import type { FC } from "react";

interface TweetInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  customApiKey: string;
  onCustomApiKeyChange: (value: string) => void;
}

export const TweetInput: FC<TweetInputProps> = ({
  value,
  onChange,
  onAnalyze,
  isLoading,
  customApiKey,
  onCustomApiKeyChange,
}) => {
  const t = useTranslations("input");
  const tCustomApiKey = useTranslations("customApiKey");
  const [opened, setOpened] = useState(false);
  const charCount = getGraphemeCount(value);
  const isOverLimit = charCount > MAX_TWEET_LENGTH;
  const isEmpty = charCount === 0;
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

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
          c={isOverLimit ? "red" : charCount > MAX_TWEET_LENGTH * 0.9 ? "yellow" : "dimmed"}
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

      <Box mt="md">
        <Button
          variant="subtle"
          size="sm"
          onClick={() => setOpened(!opened)}
        >
          {tCustomApiKey('toggle')}
        </Button>

        <Collapse in={opened}>
          <Stack gap="sm" mt="md">
            <Alert icon={<IconAlertTriangle />} color="yellow">
              {tCustomApiKey('warning')}
              {!isHttps && (
                <Text c="red" fw={700} mt="xs">{tCustomApiKey('httpsRequired')}</Text>
              )}
            </Alert>

            <PasswordInput
              label={tCustomApiKey('label')}
              placeholder={tCustomApiKey('placeholder')}
              value={customApiKey}
              onChange={(e) => onCustomApiKeyChange(e.currentTarget.value)}
              description={tCustomApiKey('helpText')}
            />
          </Stack>
        </Collapse>
      </Box>
    </Box>
  );
};
