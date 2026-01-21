"use client";

import { ActionIcon, Box, Image, Modal } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useEffect } from "react";

import type { FC } from "react";

interface ImageModalProps {
  imageSrc: string | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const ImageModal: FC<ImageModalProps> = ({
  imageSrc,
  onClose,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}) => {
  useEffect(() => {
    if (imageSrc === null) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowRight" && canGoNext) {
        onNext();
      } else if (event.key === "ArrowLeft" && canGoPrevious) {
        onPrevious();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageSrc, canGoNext, canGoPrevious, onNext, onPrevious, onClose]);

  return (
    <Modal
      opened={imageSrc !== null}
      onClose={onClose}
      size="auto"
      centered={true}
      padding={0}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.9, blur: 3 }}
    >
      {imageSrc && (
        <Box style={{ position: "relative" }}>
          <Image
            src={imageSrc}
            alt="Sample post (enlarged)"
            fit="contain"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          />

          {canGoPrevious && (
            <ActionIcon
              variant="filled"
              size="lg"
              radius="xl"
              onClick={onPrevious}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <IconChevronLeft size={24} />
            </ActionIcon>
          )}

          {canGoNext && (
            <ActionIcon
              variant="filled"
              size="lg"
              radius="xl"
              onClick={onNext}
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <IconChevronRight size={24} />
            </ActionIcon>
          )}
        </Box>
      )}
    </Modal>
  );
};
