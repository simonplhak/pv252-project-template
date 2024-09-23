import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

test("find-watman", async ({ page }) => {  
  await page.goto("/");
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});


test('navigate to SITE A', async ({ page }) => {  
  await page.goto('/');
  await page.getByText('Factorial value 5! is').click();
  await expect(page).toHaveURL('http://127.0.0.1:8080/site_a.html')
  await page.goto('/');
  await page.getByRole('link', { name: 'Site A' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:8080/site_a.html')
});

test('navigate to SITE B', async ({ page }) => {
  await page.goto('/');
  await page.getByText('5th fibonacci number is').click();
  await expect(page).toHaveURL('http://127.0.0.1:8080/site_b.html')
  await page.goto('/');
  await page.getByRole('link', { name: 'Site B' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:8080/site_b.html')
});

test('locate HOME', async ({ page }) => {  
  await page.goto('/site_a.html');
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page.getByText('This image is a static')).toBeInViewport();
  await expect(page.getByText('5th fibonacci number is')).toBeInViewport();
  await expect(page.getByText('Factorial value 5! is')).toBeInViewport();
  await expect(page).toHaveURL('http://127.0.0.1:8080/')
});

test('locate alert', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('alert').click();
  await expect(page.getByRole('alert')).not.toBeVisible();
});