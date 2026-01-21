"use client";

import {
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { TweetButton } from "../TweetButton";

import styles from "./Improvements.module.css";

import type { ImprovedVersion, Improvement } from "../../lib/types";

interface ImprovementsProps {
  improvements: Improvement[];
  improvedVersions: ImprovedVersion[];
}

export const Improvements: FC<ImprovementsProps> = ({
  improvements,
  improvedVersions,
}) => {
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

        {improvedVersions.length > 0 && (
          <>
            <Divider my="md" />
            <Stack gap="lg">
              {improvedVersions.map((version, index) => (
                <Card key={index} padding="lg" radius="md" withBorder={true} className={styles.versionCard}>
                  <Stack gap="md">
                    <Title order={4}>{version.title}</Title>
                    <Box>
                      <Text size="sm" fw={500} mb="xs" c="dimmed">
                        {t("improvedText")}
                      </Text>
                      <Card padding="md" radius="md" withBorder={true} className={styles.textCard}>
                        <Text size="sm" className={styles.optimizedText}>
                          {version.text}
                        </Text>
                      </Card>
                    </Box>
                    <Box>
                      <Text size="sm" fw={500} mb="xs" c="dimmed">
                        {t("improvementPoints")}
                      </Text>
                      <Stack gap="xs">
                        {version.improvements.map((imp, impIndex) => (
                          <Text key={impIndex} size="xs" c="dimmed">
                            • {imp}
                          </Text>
                        ))}
                      </Stack>
                    </Box>
                    <TweetButton text={version.text} />
                  </Stack>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};
