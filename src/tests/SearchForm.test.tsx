import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchForm from '@/components/SearchForm';

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

describe('SearchForm', () => {
    const mockOnSearch = jest.fn();

    const renderComponent = () => {
        render(<SearchForm onSearch={mockOnSearch} />);
    };

    beforeEach(() => {
        mockOnSearch.mockClear(); // Reset the mock before each test
    });

    test('renders form inputs and search button', () => {
        renderComponent();

        // Check if Job Title input is rendered
        expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter job title/i)).toBeInTheDocument();

        // Check if Location input is rendered
        expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter location/i)).toBeInTheDocument();

        // Check if Search button is rendered
        expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    });

});
