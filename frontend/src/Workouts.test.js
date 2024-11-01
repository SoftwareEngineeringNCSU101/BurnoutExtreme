// Workouts.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutDisplay from "./components/WorkoutDisplay";
import Workouts from "./components/Workouts";
import { ThemeProvider } from "./components/ThemeContext";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

// Mock theme properties
const mockTheme = {
  colors: {
    primary: "#ff5722",
    secondary: "#3f51b5",
    background: "#ffffff",
    text: "#212121",
  },
  fonts: {
    body: "Arial, sans-serif",
    heading: "Georgia, serif",
  },
  spacing: (factor) => `${0.25 * factor}rem`,
};

// Utility function to render with theme
const renderWithTheme = (ui) => {
  return render(<ThemeProvider value={mockTheme}>{ui}</ThemeProvider>);
};

// Workouts Component Tests
describe("Workouts Component", () => {
  const mockToken = "fakeToken";
  const props = { state: { token: mockToken } };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get = jest.fn(); // Reset axios mock before each test
  });

  test("renders Workouts component", async () => {
    // Mock the axios get request
    axios.get.mockResolvedValueOnce({
      data: { data: { Monday: [], Tuesday: [] } },
    });

    renderWithTheme(<Workouts {...props} />);

    // Check if the header is rendered
    expect(screen.getByText(/my workout week/i)).toBeInTheDocument();

    // Check if Add and Edit buttons are present
    const addButton = screen.getByRole("button", { name: /add/i });
    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(addButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();

    // Simulate clicking the Add button
    fireEvent.click(addButton);

    // Verify if WorkoutForm appears after clicking Add
    expect(await screen.findByLabelText(/select day/i)).toBeInTheDocument();
  });
});

// WorkoutForm Component Tests
describe("WorkoutForm Component", () => {
  const mockOnChange = jest.fn();
  const mockSetAddMode = jest.fn();

  beforeEach(() => {
    renderWithTheme(
      <WorkoutForm
        addMode={true}
        onChange={mockOnChange}
        setAddMode={mockSetAddMode}
        schedules={[]} // Assuming no existing schedules for testing
      />
    );
  });

  test("renders WorkoutForm component", () => {
    expect(screen.getByText(/new workout form/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select day/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/workout title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/video link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  // test("handles form submission", async () => {
  //   const mockOnChange = jest.fn();
  //   const mockSetAddMode = jest.fn();

  //   // Render the WorkoutForm with props
  //   render(
  //     <WorkoutForm
  //       addMode={true}
  //       onChange={mockOnChange}
  //       setAddMode={mockSetAddMode}
  //       schedules={[]}
  //     />
  //   );

  //   // Check if the options are present
  //   const selectInput = screen.getByLabelText(/select day/i);
  //   expect(selectInput).toBeInTheDocument();

  //   // Now try to select the option
  //   userEvent.selectOptions(selectInput, "Monday");

  // });
});

// WorkoutDisplay Component Tests
describe("WorkoutDisplay Component", () => {
  // test("renders workout cards when schedules are provided", () => {
  //   const mockWorkouts = [
  //     {
  //       selectedDay: "Monday",
  //       workoutTitle: "Yoga",
  //       duration: 30,
  //       description: "A relaxing yoga session.",
  //       link: "https://example.com/yoga",
  //     },
  //     {
  //       selectedDay: "Monday",
  //       workoutTitle: "HIIT",
  //       duration: 45,
  //       description: "High-intensity interval training.",
  //       link: "https://example.com/hiit",
  //     },
  //   ];

  //   renderWithTheme(
  //     <WorkoutDisplay
  //       schedules={mockWorkouts}
  //       editMode={true}
  //       handleRemove={jest.fn()}
  //     />
  //   );

  //   // Check if the workouts are rendered
  //   expect(screen.getByText(/Yoga/i)).toBeInTheDocument();
  //   expect(screen.getByText(/HIIT/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Duration: 30 minutes/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Duration: 45 minutes/i)).toBeInTheDocument();
  //   expect(screen.getByText(/A relaxing yoga session./i)).toBeInTheDocument();
  //   expect(
  //     screen.getByText(/High-intensity interval training./i)
  //   ).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("button", { name: /Watch Video/i })
  //   ).toBeInTheDocument();
  // });

  test("renders a rest day message when schedules are empty", () => {
    renderWithTheme(
      <WorkoutDisplay
        schedules={[]}
        editMode={false}
        handleRemove={jest.fn()}
      />
    );

    expect(screen.getByText(/Today is Rest Day/i)).toBeInTheDocument();
  });

  test("renders a rest day message when schedules is not an array", () => {
    renderWithTheme(
      <WorkoutDisplay
        schedules={null}
        editMode={false}
        handleRemove={jest.fn()}
      />
    );

    expect(screen.getByText(/Today is Rest Day/i)).toBeInTheDocument();
  });

  test("handles the remove button click", () => {
    const mockRemove = jest.fn();
    const mockWorkouts = [
      {
        workoutTitle: "Yoga",
        selectedDay: "Monday",
        duration: 30,
        description: "A relaxing yoga session.",
        link: "https://example.com/yoga",
      },
    ];

    renderWithTheme(
      <WorkoutDisplay
        schedules={mockWorkouts}
        editMode={true}
        handleRemove={mockRemove}
      />
    );

    const removeButton = screen.getByRole("button", { name: /Remove/i });
    fireEvent.click(removeButton);

    // Update the expectation to match the function signature
    expect(mockRemove).toHaveBeenCalledWith(
      mockWorkouts[0].selectedDay, // First argument
      mockWorkouts[0].workoutTitle // Second argument
    );
  });
});
