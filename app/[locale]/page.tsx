"use client";

import {
  Alert,
  Box,
  Container,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Improvements } from "@/components/Improvements";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { TweetButton } from "@/components/TweetButton";
import { TweetInput } from "@/components/TweetInput";

import styles from "./page.module.css";

import type { AnalysisResult, AnalyzeResponse } from "@/lib/types";

export default function HomePage(): React.ReactNode {
  const t = useTranslations("header");
  const tError = useTranslations("error");
  const locale = useLocale();

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, locale }),
      });

      const data: AnalyzeResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error ?? tError("apiError"));
      }
    } catch {
      setError(tError("apiError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyOptimized = (optimizedText: string): void => {
    setText(optimizedText);
    setResult(null);
  };

  return (
    <Box className={styles.page}>
      <Container size="md" py="xl">
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Box>
              <Title order={1}>{t("title")}</Title>
              <Text c="dimmed" size="lg">
                {t("subtitle")}
              </Text>
            </Box>
            <LanguageSwitcher />
          </Group>

          <Divider />

          <TweetInput
            value={text}
            onChange={setText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />

          {error !== null && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          {isLoading && (
            <Box className={styles.loading}>
              <Loader size="lg" />
            </Box>
          )}

          {result && !isLoading && (
            <Stack gap="xl">
              <ScoreDisplay totalScore={result.totalScore} grade={result.grade} />

              <ScoreBreakdown
                breakdown={result.breakdown}
                penalties={result.penalties}
              />

              <Improvements
                improvements={result.improvements}
                optimizedVersion={result.optimizedVersion}
                onApplyOptimized={handleApplyOptimized}
              />

              <Divider />

              <TweetButton text={text} />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
