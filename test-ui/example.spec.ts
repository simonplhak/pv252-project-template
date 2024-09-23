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

// tests for nomads.com
test('pypi: search', async ({ page }) => {
  await page.goto('https://pypi.org/');
  await expect(page.getByRole('heading', { name: 'Find, install and publish' })).toBeInViewport();
  await page.getByPlaceholder('Search projects').click();
  await page.getByPlaceholder('Search projects').fill('kindwise');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('link', { name: 'kindwise-api-client 0.6.0' })).toBeInViewport();
});

test('pypi: package detail', async ({ page }) => {
  await page.goto('https://pypi.org/search/?q=kindwise');
  await expect(page.getByRole('link', { name: 'kindwise-api-client 0.6.0' })).toBeInViewport();
  await page.getByRole('link', { name: 'kindwise-api-client 0.6.0' }).click();
  await expect(page.getByRole('heading', { name: 'kindwise-api-client' })).toBeInViewport();
  await expect(page.getByText('pip install kindwise-api-')).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Project description. Focus' })).toBeInViewport();
});

test('pypi: sponsors page', async ({ page }) => {
  await page.goto('https://pypi.org/');
  await page.getByRole('link', { name: 'Sponsors', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Support PyPI and related' })).toBeInViewport();
  await page.getByRole('heading', { name: 'Support PyPI and related' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Become a sponsor ' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('heading', { name: 'Sponsor the PSF' })).toBeInViewport();
});

test('pypi: registration', async ({ page }) => {
  await page.goto('https://pypi.org/');
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page.getByRole('heading', { name: 'Create an account on PyPI' })).toBeInViewport();
  await expect(page.getByPlaceholder('Your name')).toBeInViewport();
  await expect(page.getByPlaceholder('Your email address')).toBeInViewport();
  await expect(page.getByPlaceholder('Select a username')).toBeInViewport();
  await expect(page.getByPlaceholder('Select a password')).toBeVisible();
  await expect(page.getByPlaceholder('Confirm password')).toBeVisible();
});