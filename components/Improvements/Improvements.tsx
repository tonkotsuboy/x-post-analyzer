"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import styles from "./Improvements.module.css";

import type { Improvement } from "@/lib/types";

interface ImprovementsProps {
  improvements: Improvement[];
  optimizedVersion: string;
  onApplyOptimized: (text: string) => void;
}

export function Improvements({
  improvements,
  optimizedVersion,
  onApplyOptimized,
}: ImprovementsProps): React.ReactNode {
  const t = useTranslations("improvements");

  return (
    <Box className={styles.container}>
      <Title order={3} mb="md">
        {t("title")}
      </Title>

      <Stack gap="md">
        {improvements.map((improvement, index) => (
          <Card key={index} padding="md" radius="md" withBorder={true}>
            <Group justify="space-between" mb="xs">
              <Badge color="blue" variant="light">
                {t("priority")} {improvement.priority}
              </Badge>
              <Badge color="green" variant="light">
                +{improvement.expectedGain} pts
              </Badge>
            </Group>
            <Text size="sm">{improvement.suggestion}</Text>
          </Card>
        ))}

        {optimizedVersion.length > 0 && (
          <>
            <Divider my="md" />
            <Box>
              <Text size="sm" fw={500} mb="xs">
                {t("optimizedVersion")}
              </Text>
              <Card padding="md" radius="md" withBorder={true}>
                <Text size="sm" className={styles.optimizedText}>
                  {optimizedVersion}
                </Text>
              </Card>
              <Button
                mt="sm"
                variant="light"
                onClick={() => onApplyOptimized(optimizedVersion)}
              >
                {t("apply")}
              </Button>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
