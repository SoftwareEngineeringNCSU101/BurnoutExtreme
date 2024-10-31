import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Events from "./components/Events"; 
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

// Mocking axios
jest.mock("axios");

const mockEvents = [
  {
    title: "Yoga Class",
    description: "Join us for a relaxing yoga class.",
    imageUrl: "yoga.jpg",
    eventInfo: "A great yoga class.",
    eventLocation: "Studio A",
    eventDate: "2024-10-31",
    eventTime: "10:00 AM",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    title: "Swimming Lessons",
    description: "Learn to swim with us!",
    imageUrl: "swim.jpg",
    eventInfo: "Swimming classes for all ages.",
    eventLocation: "Pool Area",
    eventDate: "2024-11-01",
    eventTime: "11:00 AM",
    latitude: 40.7128,
    longitude: -74.0060,
  },
];

describe("Events Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    axios.post.mockResolvedValue({ data: { isEnrolled: false } });
  });

  test("renders without crashing", () => {
    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  test("fetches and displays events", async () => {
    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    expect(screen.getByText("Yoga Class")).toBeInTheDocument();
    expect(screen.getByText("Swimming Lessons")).toBeInTheDocument();
  });

  test("displays filtered events based on search query", async () => {
    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.change(screen.getByLabelText(/Enter an event/i), {
      target: { value: "Yoga" },
    });
    expect(screen.getByText("Yoga Class")).toBeInTheDocument();
    expect(screen.queryByText("Swimming Lessons")).not.toBeInTheDocument();
  });

  test("opens the modal on event click", async () => {
    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    expect(screen.getByText("A great yoga class.")).toBeInTheDocument();
    expect(screen.getByText("Location: Studio A")).toBeInTheDocument();
  });

  test("closes the modal on close button click", async () => {
    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText("A great yoga class.")).not.toBeInTheDocument();
  });

  test("handles enrollment action", async () => {
    axios.post.mockResolvedValueOnce({ data: { status: "Data saved successfully" } });

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    fireEvent.click(screen.getByText("Enroll"));
    
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith("/enroll", expect.anything()));
    expect(screen.getByText("Unenroll")).toBeInTheDocument();
  });

  test("handles unenrollment action", async () => {
    axios.post.mockResolvedValueOnce({ data: { status: "Data saved successfully" } });
    axios.post.mockResolvedValueOnce({ data: { isEnrolled: true } });

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    fireEvent.click(screen.getByText("Enroll"));

    fireEvent.click(screen.getByText("Unenroll"));
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith("/unenroll", expect.anything()));
    expect(screen.getByText("Enroll")).toBeInTheDocument();
  });

  test("shows error message on failed enrollment", async () => {
    axios.post.mockRejectedValueOnce(new Error("Enrollment failed"));

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    fireEvent.click(screen.getByText("Enroll"));

    await waitFor(() => expect(screen.getByText("Enrollment failed")).toBeInTheDocument());
  });

  test("checks map click opens Google Maps", async () => {
    global.open = jest.fn(); // Mock window.open
    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    fireEvent.click(screen.getByText("Location: Studio A"));

    await waitFor(() => expect(global.open).toHaveBeenCalledWith(
      "https://www.google.com/maps/@40.7128,-74.006,15z",
      "_blank"
    ));
  });

  test("handles no events case gracefully", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    expect(screen.getByText("No events found")).toBeInTheDocument(); // Assuming you have a message for no events
  });

  test("handles fetch error gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Fetch failed"));

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    expect(screen.getByText("Error fetching events")).toBeInTheDocument(); // Assuming you have an error message
  });

  test("handles invalid event title for enrollment", async () => {
    axios.post.mockResolvedValueOnce({ data: { isEnrolled: false } });

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    fireEvent.click(screen.getByText("Enroll"));

    await waitFor(() => expect(screen.getByText("Enrollment failed for invalid title")).toBeInTheDocument());
  });

  test("displays correct event details in modal", async () => {
    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Swimming Lessons"));
    
    expect(screen.getByText("Swimming classes for all ages.")).toBeInTheDocument();
    expect(screen.getByText("Location: Pool Area")).toBeInTheDocument();
  });

  test("validates search input correctly", async () => {
    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.change(screen.getByLabelText(/Enter an event/i), {
      target: { value: "   " }, // Invalid search query
    });
    expect(screen.getByText("Yoga Class")).toBeInTheDocument();
    expect(screen.getByText("Swimming Lessons")).toBeInTheDocument();
  });

  test("validates enrollment status after fetching", async () => {
    axios.post.mockResolvedValueOnce({ data: { isEnrolled: true } });

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    
    await waitFor(() => expect(screen.getByText("Unenroll")).toBeInTheDocument());
  });

  test("displays error message for unenrollment failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Unenrollment failed"));

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    fireEvent.click(screen.getByText("Unenroll"));

    await waitFor(() => expect(screen.getByText("Unenrollment failed")).toBeInTheDocument());
  });

  test("shows success message after successful enrollment", async () => {
    axios.post.mockResolvedValueOnce({ data: { status: "Successfully enrolled" } });

    render(
      <Router>
        <Events state={{ token: "test-token" }} />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/events"));
    fireEvent.click(screen.getByText("Yoga Class"));
    fireEvent.click(screen.getByText("Enroll"));

    await waitFor(() => expect(screen.getByText("Successfully enrolled")).toBeInTheDocument());
  });
});
