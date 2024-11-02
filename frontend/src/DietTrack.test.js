import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Meals from './components/Meals'; // Adjust the import path as necessary

describe('Meals Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', () => {
        render(<Meals />);
        expect(screen.getByText(/Meals/i)).toBeInTheDocument(); // Adjust if your title is different
    });

    test('displays total calories correctly', () => {
        const meal = { total_calories: 600 };
        render(<Meals meal={meal} />);
        expect(screen.getByText(/Total Calories/i)).toBeInTheDocument();
        expect(screen.getByText(/600/i)).toBeInTheDocument();
    });

    test('displays pie chart when ingredient data is present', () => {
        const meal = {
            total_calories: 600,
            ingredients: ['Ingredient A', 'Ingredient B'],
            ingredientCalories: [400, 200]
        };
        render(<Meals meal={meal} />);
        expect(screen.getByText(/Total Calories/i)).toBeInTheDocument();
        expect(screen.getByText(/Ingredient A/i)).toBeInTheDocument();
    });

    test('does not render pie chart when no ingredient data is provided', () => {
        const meal = {
            total_calories: 600,
            ingredients: [],
            ingredientCalories: []
        };
        render(<Meals meal={meal} />);
        expect(screen.queryByText(/Ingredient/i)).toBeNull();
    });

    test('handles empty ingredientCalories array gracefully', () => {
        const meal = {
            total_calories: 600,
            ingredients: ['Ingredient A'],
            ingredientCalories: []
        };
        render(<Meals meal={meal} />);
        expect(screen.getByText(/Total Calories/i)).toBeInTheDocument();
        expect(screen.queryByText(/Ingredient A/i)).toBeNull();
    });

    test('correctly maps ingredient names to calories in pie chart', () => {
        const meal = {
            total_calories: 600,
            ingredients: ['Ingredient A', 'Ingredient B'],
            ingredientCalories: [400, 200]
        };
        render(<Meals meal={meal} />);
        const pieData = screen.getByText(/Ingredient A/i);
        expect(pieData).toBeInTheDocument();
    });

    test('renders tooltip on hover over pie chart slices', async () => {
        const meal = {
            total_calories: 600,
            ingredients: ['Ingredient A'],
            ingredientCalories: [400]
        };
        render(<Meals meal={meal} />);
        const pieSlice = screen.getByText(/Ingredient A/i);
        fireEvent.mouseOver(pieSlice);
        await waitFor(() => expect(screen.getByText(/400/i)).toBeInTheDocument());
    });

    test('checks that pie chart has the correct number of slices based on ingredients', () => {
        const meal = {
            total_calories: 600,
            ingredients: ['Ingredient A', 'Ingredient B'],
            ingredientCalories: [400, 200]
        };
        render(<Meals meal={meal} />);
        const pieSlices = screen.getAllByRole('presentation'); // Adjust according to your pie chart role
        expect(pieSlices.length).toBe(2);
    });

    test('checks that the colors of pie chart slices are correctly applied', () => {
        const meal = {
            total_calories: 600,
            ingredients: ['Ingredient A', 'Ingredient B'],
            ingredientCalories: [400, 200]
        };
        render(<Meals meal={meal} />);
        const pieSlices = screen.getAllByRole('presentation');
        // Check the colors of each slice if you have a way to access them.
        expect(pieSlices[0]).toHaveStyle('fill: #8884d8'); // Replace with actual expected color
    });

    test('correctly renders labels for the pie chart slices', () => {
        const meal = {
            total_calories: 600,
            ingredients: ['Ingredient A'],
            ingredientCalories: [400]
        };
        render(<Meals meal={meal} />);
        expect(screen.getByText(/Ingredient A/i)).toBeInTheDocument();
    });

    test('handles single ingredient case correctly', () => {
        const meal = {
            total_calories: 400,
            ingredients: ['Ingredient A'],
            ingredientCalories: [400]
        };
        render(<Meals meal={meal} />);
        expect(screen.getByText(/Ingredient A/i)).toBeInTheDocument();
        expect(screen.getByText(/400/i)).toBeInTheDocument();
    });

    test('does not render legend when there\'s no ingredient data', () => {
        const meal = {
            total_calories: 600,
            ingredients: [],
            ingredientCalories: []
        };
        render(<Meals meal={meal} />);
        expect(screen.queryByText(/Legend/i)).toBeNull();
    });

    test('updates pie chart when new meal data is provided', () => {
        const { rerender } = render(<Meals meal={{ total_calories: 600, ingredients: [], ingredientCalories: [] }} />);
        expect(screen.queryByText(/Ingredient/i)).toBeNull();
        rerender(<Meals meal={{ total_calories: 600, ingredients: ['Ingredient A'], ingredientCalories: [400] }} />);
        expect(screen.getByText(/Ingredient A/i)).toBeInTheDocument();
    });

    test('renders fallback message when meal data is null', () => {
        render(<Meals meal={null} />);
        expect(screen.getByText(/No meal data available/i)).toBeInTheDocument(); // Adjust as per your fallback message
    });

    test('validates that total calories are displayed as a number', () => {
        const meal = { total_calories: 600 };
        render(<Meals meal={meal} />);
        expect(screen.getByText(/Total Calories/i)).toHaveTextContent('600');
    });

    test('ensures pie chart does not render if total_calories is 0', () => {
        const meal = {
            total_calories: 0,
            ingredients: ['Ingredient 1'],
            ingredientCalories: [0]
        };
        render(<Meals meal={meal} />);
        expect(screen.queryByText(/Ingredient 1/i)).toBeNull();
    });

    test('correctly resets state when user clears inputs', () => {
        render(<Meals />);
        const ingredientInput = screen.getByPlaceholderText(/Ingredient/i);
        fireEvent.change(ingredientInput, { target: { value: 'Ingredient A' } });
        fireEvent.change(ingredientInput, { target: { value: '' } });
        expect(ingredientInput.value).toBe('');
    });

    test('correctly calls a mock function when the "Add Meal" button is clicked', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'Meal added successfully.' }),
            })
        );
        render(<Meals />);
        fireEvent.click(screen.getByRole('button', { name: /Add Meal/i }));
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });

    test('updates state when input fields are changed', () => {
        render(<Meals />);
        const ingredientInput = screen.getByPlaceholderText(/Ingredient/i);
        fireEvent.change(ingredientInput, { target: { value: 'Ingredient A' } });
        expect(ingredientInput.value).toBe('Ingredient A');
    });

    test('displays loading state while fetching meal data', () => {
        global.fetch = jest.fn(() =>
            new Promise(() => {}) // Simulate a fetch that never resolves
        );
        render(<Meals />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument(); // Adjust as necessary
    });
});
