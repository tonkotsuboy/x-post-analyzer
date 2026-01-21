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

import { Improvements } from "../../components/Improvements";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { SamplePosts } from "../../components/SamplePosts/SamplePosts";
import { ScoreBreakdown } from "../../components/ScoreBreakdown";
import { ScoreDisplay } from "../../components/ScoreDisplay";
import { ShareResultButton } from "../../components/ShareResultButton";
import { TweetInput } from "../../components/TweetInput";

import styles from "./page.module.css";

import type { AnalysisResult, AnalyzeResponse } from "../../lib/types";

const PROGRESS_STEPS = [
  { progress: 10, key: "step1" },
  { progress: 30, key: "step2" },
  { progress: 50, key: "step3" },
  { progress: 70, key: "step4" },
  { progress: 90, key: "step5" },
];

// エラーコードを翻訳キーに変換
function getErrorTranslationKey(errorCode: string): string {
  const errorMap: Record<string, string> = {
    API_KEY_NOT_CONFIGURED: "apiKeyNotConfigured",
    API_KEY_INVALID: "apiKeyInvalid",
    RATE_LIMIT_EXCEEDED: "rateLimitExceeded",
    NETWORK_ERROR: "networkError",
    ANALYSIS_FAILED: "analysisFailed",
    CUSTOM_API_KEY_INVALID: "customApiKeyInvalid",
    CUSTOM_API_KEY_REQUIRES_HTTPS: "customApiKeyRequiresHttps",
  };

  return errorMap[errorCode] ?? "apiError";
}

export default function HomePage(): React.ReactNode {
  const t = useTranslations("header");
  const tInput = useTranslations("input");
  const tError = useTranslations("error");
  const tProgress = useTranslations("progress");
  const locale = useLocale();

  const [text, setText] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
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
          body: JSON.stringify({ text, locale, customApiKey }),
          signal,
        });

        const data: AnalyzeResponse = await response.json();

        if (data.success && data.data) {
          setResult(data.data);
        } else {
          // エラーコードを翻訳キーに変換
          const errorCode = data.error ?? "ANALYSIS_FAILED";
          const errorKey = getErrorTranslationKey(errorCode);
          setError(tError(errorKey));
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
            customApiKey={customApiKey}
            onCustomApiKeyChange={setCustomApiKey}
          />

          {result === null && !isPending && <SamplePosts />}

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

              <Box className={styles.shareButtonWrapper}>
                <ShareResultButton
                  score={result.totalScore}
                  grade={result.grade}
                />
              </Box>
            </Stack>
          )}
        </Stack>
      </Container>
      <a
        href="https://github.com/tonkotsuboy/x-post-analyzer"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubLink}
        aria-label="View source on GitHub"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </a>
    </Box>
  );
}
