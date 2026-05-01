import { describe, expect, it } from "vitest";
import {
  getTranslations,
  defaultLocale,
  locales,
} from "../../src/modules/i18n/get-dictionary";

describe("i18n locale support", () => {
  it("defaultLocale is ru", () => {
    expect(defaultLocale).toBe("ru");
  });

  it("locales list contains ru and en", () => {
    expect(locales).toContain("ru");
    expect(locales).toContain("en");
  });

  it("getTranslations returns Russian strings by default", () => {
    const common = getTranslations("common");
    expect(common.nav.login).toBe("Войти");
    expect(common.nav.logout).toBe("Выйти");
    expect(common.footer.privacy).toBe("Политика конфиденциальности");
  });

  it("getTranslations returns English strings when locale is en", () => {
    const common = getTranslations("common", "en");
    expect(common.nav.login).toBe("Log in");
    expect(common.nav.logout).toBe("Log out");
    expect(common.footer.privacy).toBe("Privacy Policy");
  });

  it("Russian and English app dictionaries have the same top-level keys", () => {
    const ruApp = getTranslations("app", "ru");
    const enApp = getTranslations("app", "en");
    expect(Object.keys(enApp).sort()).toEqual(Object.keys(ruApp).sort());
  });

  it("Russian and English common dictionaries have the same top-level keys", () => {
    const ruCommon = getTranslations("common", "ru");
    const enCommon = getTranslations("common", "en");
    expect(Object.keys(enCommon).sort()).toEqual(Object.keys(ruCommon).sort());
  });

  it("Russian and English metadata dictionaries have the same keys", () => {
    const ruMeta = getTranslations("metadata", "ru");
    const enMeta = getTranslations("metadata", "en");
    expect(Object.keys(enMeta).sort()).toEqual(Object.keys(ruMeta).sort());
  });

  it("English app dictionary has translated home hero title", () => {
    const app = getTranslations("app", "en");
    expect(app.home.heroTitle).toBe("Share your wishes — get the gift you actually want");
  });

  it("English app dictionary has correct roadmap milestone count", () => {
    const ruApp = getTranslations("app", "ru");
    const enApp = getTranslations("app", "en");
    expect(enApp.roadmap.milestones.length).toBe(ruApp.roadmap.milestones.length);
  });

  it("English app dictionary has correct features count", () => {
    const ruApp = getTranslations("app", "ru");
    const enApp = getTranslations("app", "en");
    expect(enApp.home.features.length).toBe(ruApp.home.features.length);
  });

  it("both locales have itemCountForms as a 3-tuple", () => {
    const ruApp = getTranslations("app", "ru");
    const enApp = getTranslations("app", "en");
    expect(ruApp.dashboard.itemCountForms).toHaveLength(3);
    expect(enApp.dashboard.itemCountForms).toHaveLength(3);
  });

  it("English nav has locale switcher keys", () => {
    const enCommon = getTranslations("common", "en");
    expect(enCommon.nav.localeRu).toBe("RU");
    expect(enCommon.nav.localeEn).toBe("EN");
    expect(enCommon.nav.localeSwitcherLabel).toBeTruthy();
  });

  it("both locales have priceInput hints", () => {
    const ruCommon = getTranslations("common", "ru");
    const enCommon = getTranslations("common", "en");
    expect(ruCommon.priceInput.nonNumericHint).toBeTruthy();
    expect(enCommon.priceInput.nonNumericHint).toBeTruthy();
    expect(ruCommon.priceInput.tooLargeHint).toBeTruthy();
    expect(enCommon.priceInput.tooLargeHint).toBeTruthy();
  });
});
