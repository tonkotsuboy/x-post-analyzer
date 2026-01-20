"use client";

import {
  Accordion,
  Badge,
  Box,
  Group,
  Progress,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import styles from "./ScoreBreakdown.module.css";

import type { Penalties, ScoreBreakdown as ScoreBreakdownType, ScoreItem } from "../../lib/types";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
  penalties: Penalties;
}

interface TierConfig {
  titleKey: string;
  items: { key: keyof ScoreBreakdownType; labelKey: string }[];
  color: string;
}

const tiers: TierConfig[] = [
  {
    titleKey: "tier1",
    color: "blue",
    items: [
      { key: "replyPotential", labelKey: "replyPotential" },
      { key: "retweetPotential", labelKey: "retweetPotential" },
      { key: "favoritePotential", labelKey: "favoritePotential" },
      { key: "quotePotential", labelKey: "quotePotential" },
    ],
  },
  {
    titleKey: "tier2",
    color: "green",
    items: [
      { key: "dwellTime", labelKey: "dwellTime" },
      { key: "continuousDwellTime", labelKey: "continuousDwellTime" },
      { key: "clickPotential", labelKey: "clickPotential" },
      { key: "photoExpand", labelKey: "photoExpand" },
      { key: "videoView", labelKey: "videoView" },
      { key: "quotedClick", labelKey: "quotedClick" },
    ],
  },
  {
    titleKey: "tier3",
    color: "violet",
    items: [
      { key: "profileClick", labelKey: "profileClick" },
      { key: "followPotential", labelKey: "followPotential" },
      { key: "sharePotential", labelKey: "sharePotential" },
      { key: "shareViaDM", labelKey: "shareViaDM" },
      { key: "shareViaCopyLink", labelKey: "shareViaCopyLink" },
    ],
  },
];

function ScoreRow({ item, label }: { item: ScoreItem; label: string }): React.ReactNode {
  const percentage = (item.score / item.max) * 100;
  const color =
    percentage >= 80 ? "green" : percentage >= 50 ? "yellow" : "red";

  return (
    <Table.Tr>
      <Table.Td>
        <Text size="sm">{label}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Progress value={percentage} color={color} size="sm" className={styles.progressBar} />
          <Text size="sm" fw={500} className={styles.scoreText}>
            {item.score}/{item.max}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          {item.reason}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}

export function ScoreBreakdown({
  breakdown,
  penalties,
}: ScoreBreakdownProps): React.ReactNode {
  const t = useTranslations("score");
  const tBreakdown = useTranslations("breakdown");

  const totalPenalty =
    penalties.notInterested.score +
    penalties.muteRisk.score +
    penalties.blockRisk.score +
    penalties.reportRisk.score;

  return (
    <Box className={styles.container}>
      <Title order={3} mb="md">
        {t("breakdown")}
      </Title>

      <Accordion variant="separated" multiple={true} defaultValue={["tier1"]}>
        {tiers.map((tier) => {
          const tierScore = tier.items.reduce(
            (sum, item) => sum + breakdown[item.key].score,
            0
          );
          const tierMax = tier.items.reduce(
            (sum, item) => sum + breakdown[item.key].max,
            0
          );

          return (
            <Accordion.Item key={tier.titleKey} value={tier.titleKey}>
              <Accordion.Control>
                <Group justify="space-between">
                  <Text fw={500}>{t(tier.titleKey)}</Text>
                  <Badge color={tier.color} variant="light">
                    {tierScore}/{tierMax}
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className={styles.thItem}>Item</Table.Th>
                      <Table.Th className={styles.thScore}>Score</Table.Th>
                      <Table.Th className={styles.thReason}>Reason</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {tier.items.map((item) => (
                      <ScoreRow
                        key={item.key}
                        item={breakdown[item.key]}
                        label={tBreakdown(item.labelKey)}
                      />
                    ))}
                  </Table.Tbody>
                </Table>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}

        {totalPenalty < 0 && (
          <Accordion.Item value="penalties">
            <Accordion.Control>
              <Group justify="space-between">
                <Text fw={500}>{t("penalties")}</Text>
                <Badge color="red" variant="light">
                  {totalPenalty}
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {Object.entries(penalties).map(([key, penalty]) => {
                  if (penalty.score >= 0) {
                    return null;
                  }
                  return (
                    <Group key={key} justify="space-between">
                      <Text size="sm">{tBreakdown(key)}</Text>
                      <Group gap="xs">
                        <Badge color="red" variant="light">
                          {penalty.score}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {penalty.reason}
                        </Text>
                      </Group>
                    </Group>
                  );
                })}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        )}
      </Accordion>
    </Box>
  );
}
