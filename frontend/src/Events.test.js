import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Events from './components/Events';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

const mockAxios = new MockAdapter(axios);

const setup = () => {
  const token = 'mockToken';
  const { container } = render(
    <MemoryRouter> {/* Wrap with MemoryRouter */}
      <Events state={{ token }} />
    </MemoryRouter>
  );
  return { container };
};

describe('Events Component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    // Optional: Cleanup any necessary mocks if needed
    mockAxios.restore();
  });

  // Nominal Cases

  test('renders Events component successfully with events', async () => {
    mockAxios.onGet('/events').reply(200, [
      {
        title: 'Yoga Class',
        description: 'A relaxing yoga class.',
        imageUrl: 'yoga.jpg',
        eventInfo: 'Join us for a yoga session.',
        eventLocation: 'Park',
        eventDate: '2024-10-30',
        eventTime: '10:00 AM',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    ]);

    setup();

    expect(await screen.findByText(/Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Yoga Class/i)).toBeInTheDocument();
  });

  test('search functionality works correctly', async () => {
    mockAxios.onGet('/events').reply(200, [
      { title: 'Yoga Class', description: 'A relaxing yoga class.', imageUrl: 'yoga.jpg' },
      { title: 'Swimming Class', description: 'Learn to swim.', imageUrl: 'swimming.jpg' },
    ]);

    setup();

    expect(await screen.findByText(/Events/i)).toBeInTheDocument();

    // Search for "Yoga"
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(searchInput, { target: { value: 'Yoga' } });

    expect(screen.getByText(/Yoga Class/i)).toBeInTheDocument();
    expect(screen.queryByText(/Swimming Class/i)).not.toBeInTheDocument();
  });

  test('modals open and close correctly', async () => {
    mockAxios.onGet('/events').reply(200, [
      {
        title: 'Yoga Class',
        description: 'A relaxing yoga class.',
        imageUrl: 'yoga.jpg',
        eventInfo: 'Join us for a yoga session.',
        eventLocation: 'Park',
        eventDate: '2024-10-30',
        eventTime: '10:00 AM',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    ]);

    setup();

    const eventCard = await screen.findByText(/Yoga Class/i);
    fireEvent.click(eventCard);

    expect(await screen.findByText(/Join us for a yoga session/i)).toBeInTheDocument();

    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);

    expect(screen.queryByText(/Join us for a yoga session/i)).not.toBeInTheDocument();
  });

  test('enrolls and unenrolls correctly', async () => {
    mockAxios.onGet('/events').reply(200, [
      {
        title: 'Yoga Class',
        description: 'A relaxing yoga class.',
        imageUrl: 'yoga.jpg',
        eventInfo: 'Join us for a yoga session.',
        eventLocation: 'Park',
        eventDate: '2024-10-30',
        eventTime: '10:00 AM',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    ]);

    mockAxios.onPost('/is-enrolled').reply(200, { isEnrolled: false });
    mockAxios.onPost('/enroll').reply(200, { status: 'Data saved successfully' });

    setup();

    const eventCard = await screen.findByText(/Yoga Class/i);
    fireEvent.click(eventCard);

    const enrollButton = screen.getByText(/Enroll/i);
    fireEvent.click(enrollButton);

    expect(await screen.findByText(/You have successfully enrolled for the event!/i)).toBeInTheDocument();
  });

  // Off-Nominal Cases

  test('renders Events component with no events', async () => {
    mockAxios.onGet('/events').reply(200, []);

    setup();

    expect(await screen.findByText(/Events/i)).toBeInTheDocument();
    expect(screen.queryByText(/Yoga Class/i)).not.toBeInTheDocument();
  });

  test('handles network errors during fetch', async () => {
    mockAxios.onGet('/events').reply(500);

    setup();

    expect(await screen.findByText(/Events/i)).toBeInTheDocument();
    expect(await screen.findByText(/Error loading events/i)).toBeInTheDocument(); // Adjust based on your error handling
  });

  test('handles errors when opening modals', async () => {
    mockAxios.onGet('/events').reply(200, [
      {
        title: 'Yoga Class',
        description: 'A relaxing yoga class.',
        imageUrl: 'yoga.jpg',
        eventInfo: 'Join us for a yoga session.',
        eventLocation: 'Park',
        eventDate: '2024-10-30',
        eventTime: '10:00 AM',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    ]);

    mockAxios.onPost('/is-enrolled').reply(200, { isEnrolled: false });
    mockAxios.onPost('/enroll').reply(500); // Simulate an error on enrollment

    setup();

    const eventCard = await screen.findByText(/Yoga Class/i);
    fireEvent.click(eventCard);

    const enrollButton = screen.getByText(/Enroll/i);
    fireEvent.click(enrollButton);

    expect(await screen.findByText(/Error enrolling for the event/i)).toBeInTheDocument(); // Adjust based on your error handling
  });
});
