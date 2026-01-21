"use client";

import { IconWorld } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";

import styles from "./LanguageSwitcher.module.css";

import type { FC } from "react";

export const LanguageSwitcher: FC = () => {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const popoverId = useId();

  const handleSwitch = (newLocale: string): void => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <>
      <button
        type="button"
        className={styles.iconButton}
        popoverTarget={popoverId}
        aria-label={t("selectLanguage")}
      >
        <IconWorld size={20} />
      </button>

      <div id={popoverId} popover="auto" className={styles.popover}>
        <button
          type="button"
          className={`${styles.languageButton} ${locale === "ja" ? styles.languageButtonActive : ""}`}
          onClick={() => handleSwitch("ja")}
        >
          <span className={styles.flag}>🇯🇵</span>
          日本語
        </button>
        <button
          type="button"
          className={`${styles.languageButton} ${locale === "en" ? styles.languageButtonActive : ""}`}
          onClick={() => handleSwitch("en")}
        >
          <span className={styles.flag}>🇺🇸</span>
          English
        </button>
      </div>
    </>
  );
};
