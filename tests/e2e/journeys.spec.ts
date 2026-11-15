import { expect, test } from "@playwright/test";

test("1 root redirects to Persian", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
});

test("2 switches to English", async ({ page }) => {
  await page.goto("/fa");
  await page.getByRole("link", { name: /English/ }).first().click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("3 toggles the theme", async ({ page, isMobile }) => {
  await page.goto("/en");
  if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByTestId("theme-dark").first().click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByTestId("theme-light").first().click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("4-7 catalog: search, filter, product page", async ({ page }) => {
  await page.goto("/en/products");
  await expect(page.getByTestId("product-grid")).toBeVisible();
  await page.getByLabel("Search products").fill("fan");
  await expect(page).toHaveURL(/q=fan/);
  await expect(page.getByTestId("result-count")).toContainText("2");
  await page.goto("/en/products");
  if (await page.getByTestId("filter-category-radiators").first().isVisible()) {
    await page.getByTestId("filter-category-radiators").first().click();
    await expect(page).toHaveURL(/category=radiators/);
  }
  await page.getByRole("link", { name: /Radiator sample A/ }).first().click();
  await expect(page).toHaveURL(/\/en\/products\/radiator-sample-a/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Radiator sample A");
});

test("8-11 contact modal and links", async ({ page }) => {
  await page.goto("/en/products/radiator-sample-a");
  await page.getByRole("button", { name: "Contact to order" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByTestId("contact-phone")).toHaveAttribute("href", /^tel:\+/);
  await expect(dialog.getByTestId("contact-email")).toHaveAttribute("href", /^mailto:/);
  await expect(dialog.getByTestId("contact-whatsapp")).toHaveAttribute("href", /^https:\/\/wa\.me\//);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("12 navigates categories", async ({ page }) => {
  await page.goto("/en/categories");
  await page.getByRole("link", { name: /Cooling fans/ }).first().click();
  await expect(page).toHaveURL(/\/en\/categories\/cooling-fans/);
});

test("language switch keeps the translated product slug", async ({ page }) => {
  await page.goto("/fa/products/radiator-nemune-alef");
  await page.getByRole("link", { name: /English/ }).first().click();
  await expect(page).toHaveURL(/\/en\/products\/radiator-sample-a$/);
});

test("13 opens an FAQ answer", async ({ page }) => {
  await page.goto("/en/faq");
  const q = page.getByRole("button", { name: /How do I place an order/ });
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "true");
});

test("14-15 invalid product and unknown route return 404", async ({ page }) => {
  for (const url of ["/en/products/does-not-exist", "/fa/nothing-here"]) {
    const res = await page.goto(url);
    expect(res?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
  }
});

test("16 mobile navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "Products" }).last().click();
  await expect(page).toHaveURL(/\/en\/products/);
});

test("17 skip link is first keyboard stop", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
});

test("seo: canonical, hreflang, sitemap, robots", async ({ page, request }) => {
  await page.goto("/en/about");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/about$/);
  await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveCount(1);
  expect((await request.get("/sitemap.xml")).ok()).toBeTruthy();
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
});
