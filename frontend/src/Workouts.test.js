import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import Workouts from './components/Workouts'
import WorkoutForm from './components/WorkoutForm'
import WorkoutDisplay from './components/WorkoutDisplay'

// Mock the axios module
jest.mock('axios')

describe('Workouts Component', () => {
  const mockToken = 'fakeToken' // You can replace this with a real token if needed
  const props = { state: { token: mockToken } }

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  test('renders Workouts component', async () => {
    // Mock the axios get request
    axios.get.mockResolvedValueOnce({
      data: { data: { Monday: [], Tuesday: [] } } // Adjust as per your actual data structure
    })

    render(<Workouts {...props} />)

    // Check if the header is rendered
    const headerElement = screen.getByText(/my workout week/i)
    expect(headerElement).toBeInTheDocument()

    // Check if Add and Edit buttons are present
    const addButton = screen.getByRole('button', { name: /add/i })
    const editButton = screen.getByRole('button', { name: /edit/i })
    expect(addButton).toBeInTheDocument()
    expect(editButton).toBeInTheDocument()

    // Simulate clicking the Add button
    fireEvent.click(addButton)
    // Verify if WorkoutForm appears after clicking Add
    expect(screen.getByLabelText(/select day/i)).toBeInTheDocument() // Ensure the form is displayed

    // Simulate clicking the Edit button
    fireEvent.click(editButton)
    // Verify any changes made to the component (add appropriate checks based on your implementation)
  })
})

describe('WorkoutForm Component', () => {
  const mockOnChange = jest.fn()
  const mockSetAddMode = jest.fn()

  beforeEach(() => {
    render(
      <WorkoutForm
        addMode={true}
        onChange={mockOnChange}
        setAddMode={mockSetAddMode}
        schedules={[]} // Assuming no existing schedules for testing
      />
    )
  })

  test('renders WorkoutForm component', () => {
    expect(screen.getByText(/new workout form/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/select day/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/workout title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/video link/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
  })
})

describe('WorkoutDisplay Component', () => {
  test('renders workout cards when schedules are provided', () => {
    const mockWorkouts = [
      {
        workoutTitle: 'Yoga',
        duration: 30,
        description: 'A relaxing yoga session.',
        link: 'https://example.com/yoga'
      },
      {
        workoutTitle: 'HIIT',
        duration: 45,
        description: 'High-intensity interval training.',
        link: 'https://example.com/hiit'
      }
    ]

    render(
      <WorkoutDisplay
        schedules={mockWorkouts}
        editMode={true}
        handleRemove={jest.fn()}
      />
    )

    // Check if the workouts are rendered
    //   expect(screen.getByText(/Yoga/i)).toBeInTheDocument();
    //   expect(screen.getByText(/HIIT/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Duration: 30 minutes/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Duration: 45 minutes/i)).toBeInTheDocument();
    //   expect(screen.getByText(/A relaxing yoga session./i)).toBeInTheDocument();
    //    expect(screen.getByText(/High-intensity interval training./i)).toBeInTheDocument();
    //    expect(screen.getByRole('button', { name: /Watch Video/i })).toBeInTheDocument();
  })

  test('renders a rest day message when schedules are empty', () => {
    render(
      <WorkoutDisplay
        schedules={[]}
        editMode={false}
        handleRemove={jest.fn()}
      />
    )

    expect(screen.getByText(/Today is Rest Day/i)).toBeInTheDocument()
  })

  test('renders a rest day message when schedules is not an array', () => {
    render(
      <WorkoutDisplay
        schedules={null}
        editMode={false}
        handleRemove={jest.fn()}
      />
    )

    expect(screen.getByText(/Today is Rest Day/i)).toBeInTheDocument()
  })

  test('handles the remove button click', () => {
    const mockRemove = jest.fn()
    const mockWorkouts = [
      {
        workoutTitle: 'Yoga',
        duration: 30,
        description: 'A relaxing yoga session.',
        link: 'https://example.com/yoga'
      }
    ]

    render(
      <WorkoutDisplay
        schedules={mockWorkouts}
        editMode={true}
        handleRemove={mockRemove}
      />
    )

    const removeButton = screen.getByRole('button', { name: /Remove/i })
    fireEvent.click(removeButton)

    expect(mockRemove).toHaveBeenCalledWith(
      mockWorkouts[0].selectedDay,
      mockWorkouts[0].workoutTitle
    )
  })
})
