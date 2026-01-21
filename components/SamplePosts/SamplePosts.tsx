"use client";

import { Image, SimpleGrid, Title } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { ImageModal } from "./ImageModal";
import styles from "./SamplePosts.module.css";

import type { FC } from "react";

export const SamplePosts: FC = () => {
  const locale = useLocale();
  const t = useTranslations("samples");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const sampleImages = [2, 3, 4].map(
    (num) => `/samples/${locale}/${locale}_sample_${num}.png`
  );

  const handleNext = (): void => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % sampleImages.length);
  };

  const handlePrevious = (): void => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + sampleImages.length) % sampleImages.length
    );
  };

  return (
    <>
      <Title order={3} mb="md">
        {t("title")}
      </Title>
      <SimpleGrid
        cols={{ base: 2, sm: 2, md: 3 }}
        spacing="sm"
        className={styles.grid}
      >
        {sampleImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Sample post ${index + 1}`}
            className={styles.thumbnail}
            onClick={() => setSelectedIndex(index)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </SimpleGrid>

      <ImageModal
        imageSrc={selectedIndex !== null ? sampleImages[selectedIndex] : null}
        onClose={() => setSelectedIndex(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoPrevious={selectedIndex !== null}
        canGoNext={selectedIndex !== null}
      />
    </>
  );
};
