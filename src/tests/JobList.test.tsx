import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobList from '@/components/JobList';
import { Job } from '@/types/Job';
import { createMockJobs } from '@/utils/mock';

// Mock window.matchMedia for Ant Design or any library relying on it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('JobList', () => {
  const jobs: Job[] = createMockJobs('api', 10); // Dynamically generate 10 jobs

  const mockLoadMoreJobs = jest.fn();
  const mockOnFavoriteToggle = jest.fn();

  const defaultProps = {
    jobs: jobs,
    hasMore: true,
    loadMoreJobs: mockLoadMoreJobs,
    onFavoriteToggle: mockOnFavoriteToggle,
    favorites: [],
  };

  test('calls loadMoreJobs when scrolling down', async () => {
    render(<JobList {...defaultProps} />);

    // Simulate scrolling down to load more jobs
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    window.dispatchEvent(new Event('scroll'));

    // Check that loadMoreJobs was called
    await waitFor(() => {
      expect(mockLoadMoreJobs).toHaveBeenCalled();
    });
  });

  test('displays "No more jobs to display" message when no more jobs are available', () => {
    render(<JobList {...defaultProps} hasMore={false} />);

    // Simulate scrolling to the bottom
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    window.dispatchEvent(new Event('scroll'));

    // Check if the end message is displayed
    expect(screen.getByText('No more jobs to display')).toBeInTheDocument();
  });

  test('displays "Remove from Favorites" button for favorited jobs', () => {
    const favorites = [jobs[0]]; // The first job is a favorite

    render(<JobList {...defaultProps} favorites={favorites} />);

    // Check if the "Remove from Favorites" button is shown for the first job
    const removeFromFavoritesButton = screen.getAllByText('Remove from Favorites')[0];
    expect(removeFromFavoritesButton).toBeInTheDocument();

    // Check if "Add to Favorites" is still displayed for non-favorited jobs
    const addToFavoritesButton = screen.getAllByText('Add to Favorites')[1]; // Check for the second job
    expect(addToFavoritesButton).toBeInTheDocument();
  });
});
