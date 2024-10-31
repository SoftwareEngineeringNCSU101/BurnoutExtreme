// src/Events.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Events from './components/Events';
import { MemoryRouter } from 'react-router-dom';

describe("Events Component", () => {
  // Mock fetch response
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          { title: "Yoga Class", description: "A relaxing yoga class", imageUrl: "yoga.jpg" },
          { title: "Swimming", description: "Learn swimming with experts", imageUrl: "swimming.jpg" }
        ]),
      })
    );
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  test("renders events list", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    // Wait for events to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText("Yoga Class")).toBeInTheDocument();
      expect(screen.getByText("Swimming")).toBeInTheDocument();
    });

    // Check if descriptions are displayed
    expect(screen.getByText("A relaxing yoga class")).toBeInTheDocument();
    expect(screen.getByText("Learn swimming with experts")).toBeInTheDocument();

    // Check if images are displayed
    const yogaImage = screen.getByRole('img', { name: /Yoga Class/i });
    const swimmingImage = screen.getByRole('img', { name: /Swimming/i });
    expect(yogaImage).toBeInTheDocument();
    expect(swimmingImage).toBeInTheDocument();
  });
});
