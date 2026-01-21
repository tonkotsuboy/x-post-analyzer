"use client";

import { Modal, Image } from "@mantine/core";
import type { FC } from "react";

interface ImageModalProps {
  imageSrc: string | null;
  onClose: () => void;
}

export const ImageModal: FC<ImageModalProps> = ({ imageSrc, onClose }) => {
  return (
    <Modal
      opened={imageSrc !== null}
      onClose={onClose}
      size="auto"
      centered
      padding={0}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.9, blur: 3 }}
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="Sample post (enlarged)"
          fit="contain"
          style={{ maxWidth: "90vw", maxHeight: "90vh" }}
        />
      )}
    </Modal>
  );
};
