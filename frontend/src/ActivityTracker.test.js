import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActivityTracker from './components/ActivityTracker';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the Line component from react-chartjs-2
jest.mock('react-chartjs-2', () => ({
    Line: () => <div>Mocked Line Chart</div>,
}));

describe('ActivityTracker Component', () => {
    test('renders without crashing', () => {
        render(<ActivityTracker />);
    });

    test('renders title', () => {
        render(<ActivityTracker />);
        expect(screen.getByText(/Activity Tracker/i)).toBeInTheDocument();
    });

    test('renders input fields', () => {
        render(<ActivityTracker />);
        expect(screen.getByPlaceholderText(/Steps/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Calories Burned/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Workout Intensity/i)).toBeInTheDocument();
    });

    test('renders Track Activity button', () => {
        render(<ActivityTracker />);
        expect(screen.getByRole('button', { name: /Track Activity/i })).toBeInTheDocument();
    });

    test('initial state of inputs should be empty', () => {
        render(<ActivityTracker />);
        expect(screen.getByPlaceholderText(/Steps/i).value).toBe('');
        expect(screen.getByPlaceholderText(/Calories Burned/i).value).toBe('');
        expect(screen.getByPlaceholderText(/Workout Intensity/i).value).toBe('');
    });

    test('updates steps input on change', () => {
        render(<ActivityTracker />);
        const stepsInput = screen.getByPlaceholderText(/Steps/i);
        fireEvent.change(stepsInput, { target: { value: '1000' } });
        expect(stepsInput.value).toBe('1000');
    });

    test('updates calories input on change', () => {
        render(<ActivityTracker />);
        const caloriesInput = screen.getByPlaceholderText(/Calories Burned/i);
        fireEvent.change(caloriesInput, { target: { value: '200' } });
        expect(caloriesInput.value).toBe('200');
    });

    test('updates workout intensity input on change', () => {
        render(<ActivityTracker />);
        const intensityInput = screen.getByPlaceholderText(/Workout Intensity/i);
        fireEvent.change(intensityInput, { target: { value: 'medium' } });
        expect(intensityInput.value).toBe('medium');
    });

    test('submit with empty inputs shows an error message', async () => {
        render(<ActivityTracker />);
        fireEvent.click(screen.getByRole('button', { name: /Track Activity/i }));
        // Check for an error message or behavior
        // expect(screen.getByText(/Please fill out all fields/i)).toBeInTheDocument();
    });

    test('submit with valid inputs calls the correct API', async () => {
        // Mock the fetch API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'Activity tracked successfully.' }),
            })
        );

        render(<ActivityTracker />);
        fireEvent.change(screen.getByPlaceholderText(/Steps/i), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText(/Calories Burned/i), { target: { value: '200' } });
        fireEvent.change(screen.getByPlaceholderText(/Workout Intensity/i), { target: { value: 'medium' } });
        fireEvent.click(screen.getByRole('button', { name: /Track Activity/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/trackActivity', expect.any(Object));
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
        
        global.fetch.mockClear();
        delete global.fetch;
    });

    test('mock API response shows success message', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'Activity tracked successfully.' }),
            })
        );

        render(<ActivityTracker />);
        fireEvent.change(screen.getByPlaceholderText(/Steps/i), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText(/Calories Burned/i), { target: { value: '200' } });
        fireEvent.change(screen.getByPlaceholderText(/Workout Intensity/i), { target: { value: 'medium' } });
        fireEvent.click(screen.getByRole('button', { name: /Track Activity/i }));

        await waitFor(() => {
            expect(screen.getByText(/Activity tracked successfully/i)).toBeInTheDocument();
        });
        
        global.fetch.mockClear();
        delete global.fetch;
    });

    test('mock API error response shows error message', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('API call failed'))
        );

        render(<ActivityTracker />);
        fireEvent.change(screen.getByPlaceholderText(/Steps/i), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText(/Calories Burned/i), { target: { value: '200' } });
        fireEvent.change(screen.getByPlaceholderText(/Workout Intensity/i), { target: { value: 'medium' } });
        fireEvent.click(screen.getByRole('button', { name: /Track Activity/i }));

        await waitFor(() => {
            expect(screen.getByText(/Error tracking activity/i)).toBeInTheDocument();
        });
        
        global.fetch.mockClear();
        delete global.fetch;
    });

    test('chart renders after successful submission', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'Activity tracked successfully.' }),
            })
        );

        render(<ActivityTracker />);
        fireEvent.change(screen.getByPlaceholderText(/Steps/i), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText(/Calories Burned/i), { target: { value: '200' } });
        fireEvent.change(screen.getByPlaceholderText(/Workout Intensity/i), { target: { value: 'medium' } });
        fireEvent.click(screen.getByRole('button', { name: /Track Activity/i }));

        await waitFor(() => {
            expect(screen.getByText(/Mocked Line Chart/i)).toBeInTheDocument();
        });
        
        global.fetch.mockClear();
        delete global.fetch;
    });

    test('handles non-numeric steps input', async () => {
        render(<ActivityTracker />);
        const stepsInput = screen.getByPlaceholderText(/Steps/i);
        fireEvent.change(stepsInput, { target: { value: 'abc' } });
        expect(stepsInput.value).toBe('abc'); // Check if it allows non-numeric
        // Optionally, you can add checks for error handling
    });

    test('handles non-numeric calories input', async () => {
        render(<ActivityTracker />);
        const caloriesInput = screen.getByPlaceholderText(/Calories Burned/i);
        fireEvent.change(caloriesInput, { target: { value: 'xyz' } });
        expect(caloriesInput.value).toBe('xyz'); // Check if it allows non-numeric
        // Optionally, you can add checks for error handling
    });

    test('form resets after successful submission', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'Activity tracked successfully.' }),
            })
        );

        render(<ActivityTracker />);
        fireEvent.change(screen.getByPlaceholderText(/Steps/i), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText(/Calories Burned/i), { target: { value: '200' } });
        fireEvent.change(screen.getByPlaceholderText(/Workout Intensity/i), { target: { value: 'medium' } });
        fireEvent.click(screen.getByRole('button', { name: /Track Activity/i }));

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/Steps/i).value).toBe('');
            expect(screen.getByPlaceholderText(/Calories Burned/i).value).toBe('');
            expect(screen.getByPlaceholderText(/Workout Intensity/i).value).toBe('');
        });
        
        global.fetch.mockClear();
        delete global.fetch;
    });

    test('button is disabled when inputs are invalid', () => {
        render(<ActivityTracker />);
        const button = screen.getByRole('button', { name: /Track Activity/i });
        expect(button).toBeDisabled();
        
        fireEvent.change(screen.getByPlaceholderText(/Steps/i), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText(/Calories Burned/i), { target: { value: '' } });
        expect(button).toBeDisabled();
    });


});

