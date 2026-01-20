"use client";

import { Badge, Box, Group, RingProgress, Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

import styles from "./ScoreDisplay.module.css";

import type { Grade } from "../../lib/types";

interface ScoreDisplayProps {
  totalScore: number;
  grade: Grade;
}

const gradeColors: Record<Grade, string> = {
  S: "violet",
  A: "blue",
  B: "green",
  C: "yellow",
  D: "orange",
  F: "red",
};

export function ScoreDisplay({ totalScore, grade }: ScoreDisplayProps): React.ReactNode {
  const t = useTranslations("score");

  const scoreColor =
    totalScore >= 80
      ? "blue"
      : totalScore >= 60
        ? "green"
        : totalScore >= 40
          ? "yellow"
          : "red";

  return (
    <Box className={styles.container}>
      <Stack align="center" gap="md">
        <Title order={3}>{t("title")}</Title>
        <RingProgress
          size={180}
          thickness={16}
          roundCaps={true}
          sections={[{ value: totalScore, color: scoreColor }]}
          label={
            <Stack align="center" gap={0}>
              <Text size="2rem" fw={700} className={styles.scoreText}>
                {totalScore}
              </Text>
              <Text size="sm" c="dimmed">
                / 100
              </Text>
            </Stack>
          }
        />
        <Group gap="sm">
          <Text size="lg" fw={500}>
            {t("grade")}:
          </Text>
          <Badge size="xl" color={gradeColors[grade]} variant="filled">
            {grade}
          </Badge>
        </Group>
      </Stack>
    </Box>
  );
}
