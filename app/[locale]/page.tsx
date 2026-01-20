"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { Improvements } from "@/components/Improvements";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { TweetInput } from "@/components/TweetInput";

import styles from "./page.module.css";

import type { AnalysisResult, AnalyzeResponse } from "@/lib/types";

const PROGRESS_STEPS = [
  { progress: 10, key: "step1" },
  { progress: 30, key: "step2" },
  { progress: 50, key: "step3" },
  { progress: 70, key: "step4" },
  { progress: 90, key: "step5" },
];

export default function HomePage(): React.ReactNode {
  const t = useTranslations("header");
  const tInput = useTranslations("input");
  const tError = useTranslations("error");
  const tProgress = useTranslations("progress");
  const locale = useLocale();

  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isPending) {
      return;
    }

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < PROGRESS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPending]);

  const handleAnalyze = (): void => {
    setError(null);
    setProgressStep(0);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    startTransition(async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, locale }),
          signal,
        });

        const data: AnalyzeResponse = await response.json();

        if (data.success && data.data) {
          setResult(data.data);
        } else {
          setError(data.error ?? tError("apiError"));
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // ユーザーがキャンセルした場合は何もしない
          return;
        }
        setError(tError("apiError"));
      }
    });
  };

  const handleCancel = (): void => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setProgressStep(0);
  };

  return (
    <Box className={styles.page}>
      <Container size="md" py="xl">
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Box>
              <Title order={1} className={styles.title}>{t("title")}</Title>
              <Text c="dimmed" size="lg">
                {t("subtitle")}
              </Text>
              <Text
                component="a"
                href="https://github.com/xai-org/x-algorithm"
                target="_blank"
                rel="noopener noreferrer"
                c="blue"
                td="underline"
                size="sm"
                mt="xs"
              >
                X Recommendation Algorithm
              </Text>
            </Box>
            <LanguageSwitcher />
          </Group>

          <Divider />

          <TweetInput
            value={text}
            onChange={setText}
            onAnalyze={handleAnalyze}
            isLoading={isPending}
          />

          {error !== null && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          {isPending && (
            <Box className={styles.loading}>
              <Stack align="center" gap="md" w="100%">
                <Loader size="lg" />
                <Progress
                  value={PROGRESS_STEPS[progressStep].progress}
                  size="lg"
                  radius="xl"
                  animated={true}
                  w="100%"
                  maw={400}
                />
                <Text size="sm" c="dimmed">
                  {tProgress(PROGRESS_STEPS[progressStep].key)}
                </Text>
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  onClick={handleCancel}
                >
                  {tInput("cancel")}
                </Button>
              </Stack>
            </Box>
          )}

          {result !== null && !isPending && (
            <Stack gap="xl">
              <ScoreDisplay totalScore={result.totalScore} grade={result.grade} />

              <ScoreBreakdown
                breakdown={result.breakdown}
                penalties={result.penalties}
              />

              <Improvements
                improvements={result.improvements}
                improvedVersions={result.improvedVersions}
              />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
