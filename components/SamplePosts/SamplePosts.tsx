"use client";

import { SimpleGrid, Image, Title } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { FC } from "react";
import { ImageModal } from "./ImageModal";
import styles from "./SamplePosts.module.css";

export const SamplePosts: FC = () => {
  const locale = useLocale();
  const t = useTranslations("samples");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const sampleImages = [2, 3, 4].map(
    (num) => `/samples/${locale}/${locale}_sample_${num}.png`
  );

  return (
    <>
      <Title order={3} mb="md">
        {t("title")}
      </Title>
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="sm"
        className={styles.grid}
      >
        {sampleImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Sample post ${index + 1}`}
            className={styles.thumbnail}
            onClick={() => setSelectedImage(src)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </SimpleGrid>

      <ImageModal
        imageSrc={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};
