import * as React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Footer from "./Footer";
import { CardActionArea } from "@mui/material";
import Map from "./mapevents";
import headerImage from '../images/e.jpg';
import { useTheme } from './ThemeContext';

const SearchBar = ({ setSearchQuery }) => (
  <form style={{ paddingTop: '20px' }}>
    <TextField
      id="search-bar"
      className="text"
      onChange={(e) => {
        const query = e.target.value;
        setSearchQuery(query);
      }}
      label="Enter an event"
      variant="outlined"
      placeholder="Search..."
      size="small"
      sx={{
        backgroundColor: 'white',
        borderRadius: '5px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#588157',
          },
          '&:hover fieldset': {
            borderColor: '#a3b18a',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#588157',
          },
        },
      }}
    />
  </form>
);

const defaultTheme = createTheme();

export default function Events(props) {
  const { theme } = useTheme();
  const [enrollmentStatus, setEnrollmentStatus] = useState({});
  const [eventModals, setEventModals] = useState({});
  const [mapLocation, setMapLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();

  const [events, setEvents] = useState([]); // Events state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Enhanced filterData function
  const filterData = (query, cards) => {
    console.log("Total events:", cards.length);
    console.log("Search query:", query);

    // Trim the query and convert to lowercase
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return cards;
    } else {
      const filtered = cards.filter((e) =>
        e.title.toLowerCase().includes(trimmedQuery) 
      );
    
      console.log("Filtered events count:", filtered.length);
      console.log("Filtered event titles:", filtered.map(e => e.title));
    
      return filtered;
    }
  };

  // Keep existing eventsFiltered logic
  const eventsFiltered = filterData(searchQuery, events);

  useEffect(() => {
    axios.get("/events")
      .then((response) => {
        setEvents(response.data); // Ensure data is in the correct format
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const handleOpenModal = (eventTitle) => {
    axios
      .post("/is-enrolled", { eventTitle }, {
        headers: { Authorization: "Bearer " + props.state.token },
      })
      .then((response) => {
        setEnrollmentStatus((prevStatus) => ({
          ...prevStatus,
          [eventTitle]: response.data.isEnrolled,
        }));
        const event = events.find((e) => e.title === eventTitle);
        console.log("Hello")
        console.log(events);
        console.log(event);
        console.log(event.latitude);
        console.log(event.longitude);
        // const latitude = "35.7822";
        // const longitude = "-78.6713";
        if (event) {
          setMapLocation({ lat: Number(event.latitude), lng: Number(event.longitude) });
        }
        setEventModals({ ...eventModals, [eventTitle]: true });
      })
      .catch((error) => {
        console.error("An error occurred while checking enrollment status: ", error);
        setErrorMessage("Error checking enrollment status.");
      });
  };

  const handleCloseModal = (eventTitle) => {
    setEventModals({ ...eventModals, [eventTitle]: false });
    setMapLocation(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleEnrollUnenroll = (eventTitle) => {
    const userEmail = props.state.userEmail;
    const event = events.find((e) => e.title === eventTitle);
    const eventDate = event ? event.eventDate : null;

    if (new Date(eventDate) && new Date(eventDate) < new Date()) {
      console.log("Cannot enroll/unenroll in past events:", eventTitle);
      setErrorMessage("You cannot enroll in events with a past date.");
      return;
    }
    
    console.log("Enrolling/unenrolling user:", userEmail, "for event:", eventTitle, "on date:", eventDate);
    axios.post("/is-enrolled", { eventTitle }, {
      headers: { Authorization: "Bearer " + props.state.token },
    })
    .then((response) => {
      const action = response.data.isEnrolled ? "unenroll" : "enroll";
      axios.post(`/${action}`, { email: userEmail, eventTitle, eventDate }, {
        headers: { Authorization: "Bearer " + props.state.token },
      })
      .then((response) => {
        if (response.data.status === "Data saved successfully") {
          setEnrollmentStatus((prevStatus) => ({
            ...prevStatus,
            [eventTitle]: action === "enroll",
          }));
          setSuccessMessage(`Successfully ${action === "enroll" ? "enrolled in" : "unenrolled from"} ${eventTitle}`);
          setErrorMessage("");
        } else {
          throw new Error("Failed to update enrollment status.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while sending the data: ", error);
        setErrorMessage("Error during enrollment action. Please try again.");
      });
    })
    .catch((error) => {
      console.error("An error occurred while checking enrollment status: ", error);
      setErrorMessage("Error checking enrollment status.");
    });
  };

  const handleMapClick = () => {
    if (mapLocation) {
      const { lat, lng } = mapLocation;
      const googleMapsUrl = `https://www.google.com/maps/@${lat},${lng},15z`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Header Section */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            backgroundImage: `url(${headerImage})`,
            backgroundSize: '45%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Events
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Start your wellness journey with us today! Discover yoga, swimming, gym, and more. 
              Click "More Information" for event details, and enroll into events that motivate you.
            </Typography>
            <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
              <SearchBar setSearchQuery={setSearchQuery} />
            </Stack>
          </Container>
        </Box>

        {/* Events Grid Section */}
        <Container sx={{ py: 8 }} maxWidth="md">

          <Grid container spacing={4}>
            {eventsFiltered.map((event) => (
              <Grid item key={event.title} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0px 40px 50px rgba(0,0,0,0.4)',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleOpenModal(event.title)}>
                    <CardMedia
                      component="div"
                      sx={{ pt: '56.25%' }}
                      image={event.imageUrl}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {event.title}
                      </Typography>
                      <Typography>
                        {event.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

                {/* Modal for Event Details */}
                <Modal
                  open={eventModals[event.title]}
                  onClose={() => handleCloseModal(event.title)}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '50%',
                      bgcolor: 'background.paper',
                      border: '2px solid #000',
                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <Typography variant="h6" component="div">
                      <strong>{event.title}</strong>
                    </Typography>
                    <Typography sx={{ mt: 2 }}>{event.eventInfo}</Typography>
                    <Typography sx={{ mt: 2 }}>
                      <strong>Location:</strong> {event.eventLocation}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      <strong>Date:</strong> {event.eventDate}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      <strong>Time:</strong> {event.eventTime}
                    </Typography>
                    {mapLocation && (
                      <div className="testkam" onClick={handleMapClick}>
                        <Map location={mapLocation} />
                      </div>
                    )}
                    {errorMessage && (
                      <Typography color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                      </Typography>
                    )}
                    {successMessage && (
                      <Typography color="primary" sx={{ mt: 2 }}>
                        {successMessage}
                      </Typography>
                    )}
                    <Stack
                      spacing={2}
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mt: 2 }}
                    >
                      <Button
                        style={{ backgroundColor: theme.headerColor, color: 'white' }}
                        variant="contained"
                        onClick={() => handleEnrollUnenroll(event.title)}
                      >
                        {enrollmentStatus[event.title] ? 'Unenroll' : 'Enroll'}
                      </Button>
                      <Button
                        style={{ backgroundColor: 'white', color: theme.headerColor }}
                        variant="outlined"
                        onClick={() => handleCloseModal(event.title)}
                      >
                        Close
                      </Button>
                    </Stack>
                  </Box>
                </Modal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer />
    </ThemeProvider>
  );
}