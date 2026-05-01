import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/i18n/server", () => ({
  getLocale: vi.fn().mockResolvedValue("ru"),
}));

describe("roadmap page", () => {
  beforeEach(() => {
    Object.assign(globalThis, { React });
  });

  it("renders the roadmap title and description", async () => {
    const { default: RoadmapPage } = await import("../../src/app/roadmap/page");
    const html = renderToStaticMarkup(await RoadmapPage());

    expect(html).toContain("Дорожная карта");
    expect(html).toContain("Что уже сделано и что ждёт впереди.");
  });

  it("renders all milestone versions", async () => {
    const { default: RoadmapPage } = await import("../../src/app/roadmap/page");
    const html = renderToStaticMarkup(await RoadmapPage());

    expect(html).toContain("v1.0");
    expect(html).toContain("v1.1");
    expect(html).toContain("v1.2");
    expect(html).toContain("v1.3");
    expect(html).toContain("v1.4");
    expect(html).toContain("v1.5");
  });

  it("renders status labels", async () => {
    const { default: RoadmapPage } = await import("../../src/app/roadmap/page");
    const html = renderToStaticMarkup(await RoadmapPage());

    expect(html).toContain("Выпущено");
    expect(html).toContain("Запланировано");
  });

  it("renders milestone titles", async () => {
    const { default: RoadmapPage } = await import("../../src/app/roadmap/page");
    const html = renderToStaticMarkup(await RoadmapPage());

    expect(html).toContain("Основы");
    expect(html).toContain("Основные улучшения");
    expect(html).toContain("Оформление");
    expect(html).toContain("Шаринг и данные");
    expect(html).toContain("Безопасность аккаунта");
    expect(html).toContain("Обогащение");
  });

  it("renders English content when locale is en", async () => {
    vi.mocked((await import("@/modules/i18n/server")).getLocale).mockResolvedValueOnce("en");
    // Re-import the module to get a fresh instance with the new mock
    const { getTranslations } = await import("@/modules/i18n/get-dictionary");
    const messages = getTranslations("app", "en");

    expect(messages.roadmap.title).toBe("Roadmap");
    expect(messages.roadmap.milestones[0].title).toBe("Foundations");
    expect(messages.roadmap.statusLabels.released).toBe("Released");
  });
});
