"use client";

import { IconAlertTriangle, IconEye, IconEyeOff, IconSettings } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import styles from "./SettingsPopover.module.css";

import type { FC } from "react";

interface SettingsPopoverProps {
  customApiKey: string;
  onCustomApiKeyChange: (value: string) => void;
}

export const SettingsPopover: FC<SettingsPopoverProps> = ({
  customApiKey,
  onCustomApiKeyChange,
}) => {
  const t = useTranslations("customApiKey");
  const popoverId = useId();
  const inputId = useId();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";

  return (
    <>
      <button
        type="button"
        className={styles.iconButton}
        popoverTarget={popoverId}
        aria-label={t("settingsTitle")}
      >
        <IconSettings size={20} />
      </button>

      <div id={popoverId} popover="auto" className={styles.popover}>
        <h3 className={styles.title}>{t("settingsTitle")}</h3>

        <div className={styles.warning}>
          <IconAlertTriangle size={20} className={styles.warningIcon} />
          <div>
            {t("warning")}
            {!isHttps && (
              <p className={styles.httpsWarning}>{t("httpsRequired")}</p>
            )}
          </div>
        </div>

        <label htmlFor={inputId} className={styles.label}>
          {t("label")}
        </label>
        <div className={styles.inputWrapper}>
          <input
            id={inputId}
            type={isPasswordVisible ? "text" : "password"}
            className={styles.input}
            placeholder={t("placeholder")}
            value={customApiKey}
            onChange={(e) => onCustomApiKeyChange(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setPasswordVisible(!isPasswordVisible)}
            aria-label={isPasswordVisible ? t("hidePassword") : t("showPassword")}
          >
            {isPasswordVisible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        </div>
        <p className={styles.helpText}>{t("helpText")}</p>
      </div>
    </>
  );
};
