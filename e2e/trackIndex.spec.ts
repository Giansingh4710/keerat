import {test, expect} from '@playwright/test';

test.describe('TrackIndex Page', () => {
  test.beforeEach(async ({page}) => {
    // Navigate to the TrackIndex page before each test
    await page.goto('/TrackIndex');
  });

  test('should display the page title', async ({page}) => {
    // Check if the page title is displayed
    await expect(page.getByText('Track Index')).toBeVisible();
  });

  test('should have a search bar', async ({page}) => {
    // Check if the search input is present
    const searchInput = page.getByPlaceholder('Search: ');
    await expect(searchInput).toBeVisible();
  });

  test('should display track count', async ({page}) => {
    // Wait for the track count to be displayed
    const trackCount = page.getByText(/Tracks$/);
    await expect(trackCount).toBeVisible();
  });

  test('should have show/hide details button', async ({page}) => {
    // Check if the show/hide details button is present
    const detailsButton = page.getByText('Show Details');
    await expect(detailsButton).toBeVisible();
  });

  test('should have show oldest/newest button', async ({page}) => {
    // Check if the show oldest/newest button is present
    const sortButton = page.getByText('Show Newest');
    await expect(sortButton).toBeVisible();
  });
});
