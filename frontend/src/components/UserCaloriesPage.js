import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  ListItem,
  List,
  CardMedia,
  InputAdornment,
  ListSubheader,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import StarIcon from "@mui/icons-material/Star";
import TimelineIcon from "@mui/icons-material/Timeline";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import TodayIcon from "@mui/icons-material/Today";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";
import Footer from "./Footer";
import { useTheme } from "./ThemeContext"; // Adjust the path as necessary
import { alpha } from "@mui/material/styles";

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function UserCaloriesPage(props) {
  const { theme } = useTheme(); // Access the theme object

  const [todayCaloriesConsumed, setTodayCaloriesConsumed] = useState(0);
  const [todayCaloriesBurned, setTodayCaloriesBurned] = useState(0);
  const [todayGoal, setTodayGoal] = useState(0);
  const [events, setEvents] = useState([]);
  const COLORS = ["#8b0e0e", "#97a3a2"];
  const [foodItems, setFoodItems] = useState({});
  const [dietHistory, setDietHistory] = useState([]);
  const [weekHistory, setWeekHistory] = useState([]);
  
  const [weightHistory, setWeightHistory] = useState([]);  // State to store all weight data
  const [weekWeightHistory, setWeekWeightHistory] = useState([]);  // State to store the weekly weight data
  const [weightHistoryWithChange, setWeightHistoryWithChange] = useState([]); // State to store weight data with changes


  const [reloadTodayData, setReloadTodayData] = useState(false);
  const toggleTodayUpdate = () => {
    setReloadTodayData(!reloadTodayData);
  };
  const randomExercise = getRandomInt(0, 7);
  const exerciseList = [
    "Bent tricep extension",
    "Front Raises",
    "Sumo bicep raises",
    "Kick backs",
    "Weighted punches",
    "Leg kicks",
    "Jump claps",
  ];
  useEffect(() => {
    // Make API call to backend to get food items and their calories from DB.
    axios({
      method: "GET",
      url: "/foodCalorieMapping",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
    })
      .then((response) => {
        const res = response.data;
        setFoodItems(res);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    // Make API call to backend to get last 7 days history from DB.
    axios({
      method: "POST",
      url: "/weekHistory",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
      data: {
        todayDate: dayjs().format("MM/DD/YYYY"),
      },
    })
      .then((response) => {
        const res = response.data;
        setDietHistory(res.sort((a, b) => b.dayIndex - a.dayIndex));
        let weekData = [];
        for (let i = -3; i <= 3; i++) {
          const date = dayjs().add(i, "day").format("YYYY-MM-DD");
          const dataForDay = res.find(
            (d) => dayjs(d.date).format("YYYY-MM-DD") === date
          );

          weekData.push({
            date: date,
            consumedCalories: dataForDay ? dataForDay.caloriesConsumed : 0,
            burntCalories: dataForDay ? dataForDay.burntCalories : 0,
          });
        }
        setTodayCaloriesConsumed(res[6]["caloriesConsumed"]);
        setTodayCaloriesBurned(res[6]["burntCalories"]);
        setWeekHistory(weekData);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    // ADDED TODAY

    // axios({
    //   method: "POST",
    //   url: "/weightHistory",
    //   headers: {
    //     Authorization: "Bearer " + props.state.token,
    //   },
    //   data: {
    //     todayDate: dayjs().format("MM/DD/YYYY"),
    //   },
    // })
    //   .then((response) => {
    //     const res = response.data;
    //     setWeightHistory(res.sort((a, b) => b.dayIndex - a.dayIndex));
    //     let weekData = [];
    //     for (let i = -3; i <= 3; i++) {
    //       const date = dayjs().add(i, "day").format("YYYY-MM-DD");
    //       const dataForDay = res.find(
    //         (d) => dayjs(d.date).format("YYYY-MM-DD") === date
    //       );
    
    //       weekData.push({
    //         date: date,
    //         weight: dataForDay ? dataForDay.weight : 0,
    //       });
    //     }
    //     setWeekWeightHistory(weekData);
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log(error.response);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     }
    //   });    

    axios({
      method: "POST",
      url: "/weightHistory",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
      data: {
        todayDate: dayjs().format("MM/DD/YYYY"),
      },
    })
      .then((response) => {
        const res = response.data;
    
        // Sort data by date in ascending order (oldest first)
        const sortedData = res.sort((a, b) => new Date(a.date) - new Date(b.date));
        setWeightHistory(sortedData);
    
        // Compute weight changes
        const historyWithChange = sortedData.map((entry, index) => {
          const previousEntry = index > 0 ? sortedData[index - 1] : null; // Get previous day data
          const weightChange = previousEntry
            ? entry.weight - previousEntry.weight
            : 0; // Calculate change if previous data exists
          return { ...entry, weightChange };
        });
    
        setWeightHistoryWithChange(historyWithChange); // Update the state
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error:", error.response);
        }
      });
    
    

    axios({
      method: "GET",
      url: "/profile",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
    })
      .then((response) => {
        const res = JSON.parse(response["data"]);
        setTodayGoal(res.target_calories);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    // Make API call to backend to get events user registered for from DB.
    axios({
      method: "GET",
      url: "/usersEvents",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
        setEvents(res);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }, [reloadTodayData, props.state.token]);
  const [searchText, setSearchText] = useState("");
  const [intakeItem, setIntakeItem] = useState("");
  const [intakeCalories, setIntakeCalories] = useState("");
  const handleIntakeItemChange = (event) => {
    setIntakeItem(event.target.value);
    setIntakeCalories(foodItems[event.target.value]);
  };
  const displayedOptions = useMemo(
    () =>
      Object.keys(foodItems).filter((option) =>
        containsText(option, searchText)
      ),
    [foodItems, searchText]
  );
  const [intakeDate, setIntakeDate] = useState(dayjs());
  const handleAddCalorieIntake = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "/caloriesConsumed",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
      data: {
        intakeFoodItem: intakeItem,
        intakeCalories: intakeCalories,
        intakeDate: intakeDate.format("MM/DD/YYYY"),
      },
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
        toggleTodayUpdate();
        setIntakeItem("");
        setIntakeCalories("");
        setIntakeDate(dayjs());
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  const [burntoutCalories, setBurntoutCalories] = useState("");
  const [burnoutDate, setBurnoutDate] = useState(dayjs());
  const handleAddCalorieBurnout = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "/caloriesBurned",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
      data: {
        burntoutCalories: burntoutCalories,
        burnoutDate: burnoutDate.format("MM/DD/YYYY"),
      },
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
        toggleTodayUpdate();
        setBurntoutCalories("");
        setBurnoutDate(dayjs());
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };
  console.log(todayCaloriesBurned);
  console.log(todayCaloriesConsumed);

  // Function to handle weight input
  const [todaysWeight, setTodaysWeight] = useState("");
  const [weightDate, setWeightDate] = useState(dayjs());

  const handleAddWeight = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "/addWeight", // Update this URL to your API endpoint for adding weight
      headers: {
        Authorization: "Bearer " + props.state.token, // Ensure `props.state.token` is passed correctly
      },
      data: {
        todaysWeight: todaysWeight,
        weightDate: weightDate.format("MM/DD/YYYY"), // Format date to desired format
      },
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
        toggleTodayUpdate(); // Replace with your logic for updating the state/UI
        setTodaysWeight(""); // Reset the weight input
        setWeightDate(dayjs()); // Reset the date picker to today
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data); // Display error message if any
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log("Error:", error.message);
        }
      });
  };


  const history = useHistory();

  const redirectToEventWithModalOpen = (eventName) => {
    history.push({
      pathname: "/Events",
      state: { openModalForEvent: eventName },
    });
  };

  const handleUnenroll = (eventName) => {
    console.log("Unenrolling from event:", eventName);
    axios
      .post(
        "/unenroll",
        {
          eventTitle: eventName,
        },
        {
          headers: {
            Authorization: "Bearer " + props.state.token,
          },
        }
      )
      .then((response) => {
        window.location.reload(false);
        console.log("Unenrollment successful:", response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("An error occurred while unenrolling: ", error);
      });
  };

  return (
    <>
      <Container maxWidth>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(7, 1fr)",
            },
            gap: 2,
            gridTemplateRows: "auto",
            gridTemplateAreas: {
              xs: `
                "today"
                "exercise"
                "intake"
                "burntout"
                "events"
                "week"
                "hist"
              `,
              sm: `
                "today today"
                "exercise intake"
                "burntout events"
                "week week"
                "hist hist"
              `,
              md: `
                "today today today"
                "exercise intake burntout"
                "week week events"
                "hist hist hist"
              `,
              lg: `
                "today today exercise exercise intake intake intake"
                "week week week week burntout burntout burntout"
                "week week week week events events events"
                "hist hist hist hist hist hist hist"
              `,
            },
            paddingTop: "2rem",
          }}
        >
          <Card sx={{ gridArea: "today" }} elevation={5}>
            <CardHeader
              title={"Todays Stats"}
              subheader={"Today's calorie intake and burnout"}
              avatar={<StarIcon />}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart width={375} height={160}>
                  <Pie
                    data={[
                      {
                        name: "Calories Consumed",
                        value: todayCaloriesConsumed,
                      },
                      {
                        name: "Calories to goal",
                        value:
                          0 > todayGoal - todayCaloriesConsumed
                            ? 0
                            : todayGoal - todayCaloriesConsumed,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={60}
                    fill="#8b0e0e"
                  >
                    {COLORS.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Pie
                    data={[
                      { name: "Calories Burned", value: todayCaloriesBurned },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    fill="#19229e"
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card sx={{ gridArea: "exercise" }} elevation={5}>
            <CardHeader
              title={"Featured Exercise"}
              subheader={exerciseList[randomExercise - 1]}
              avatar={<FitnessCenterIcon />}
              sx={{ marginBottom: 3 }}
            />
            <CardContent align="center">
              <CardMedia
                style={{ transform: "scale(1.4)" }}
                width={375}
                height={300}
                component="img"
                image={"/assets/img/featured/" + randomExercise + ".gif"}
              />
            </CardContent>
          </Card>
          <Card sx={{ gridArea: "intake" }} elevation={5}>
            <CardHeader
              title={"Calorie Intake"}
              subheader={"Enter the food and calories consumed to track it"}
              avatar={<FastfoodIcon />}
            />
            <CardContent>
              <form onSubmit={handleAddCalorieIntake}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Food Item Select - Full Width */}
                  <Box sx={{ paddingBottom: "1rem" }}>
                    <FormControl fullWidth>
                      <InputLabel id="intakeFoodName">
                        Food Item Name
                      </InputLabel>
                      <Select
                        MenuProps={{ autoFocus: false }}
                        labelId="intakeFoodName"
                        id="search-select"
                        value={intakeItem}
                        label="Food Item Name"
                        onChange={handleIntakeItemChange}
                        required
                      >
                        <ListSubheader>
                          <TextField
                            size="small"
                            // Autofocus on textfield
                            autoFocus
                            placeholder="Type to search..."
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key !== "Escape") {
                                // Prevents autoselecting item while typing (default Select behaviour)
                                e.stopPropagation();
                              }
                            }}
                          />
                        </ListSubheader>
                        {displayedOptions.map((option, i) => (
                          <MenuItem key={i} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Bottom Row - Calories, Date, and Button */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                      alignItems: { xs: "stretch", md: "center" },
                      "& .MuiTextField-root": {
                        flex: 1,
                        minWidth: { xs: "100%", md: "150px" },
                      },
                      "& .MuiButton-root": {
                        minWidth: { xs: "100%", md: "100px" },
                        height: { md: "56px" }, // Match height with other inputs
                      },
                    }}
                  >
                    <TextField
                      label="Calories"
                      id="intakeCalorieCount"
                      value={intakeCalories}
                      onChange={(event) => {
                        setIntakeCalories(event.target.value);
                      }}
                      type="number"
                      required
                    />
                    <DatePicker
                      label="Date"
                      value={intakeDate}
                      onChange={(newValue) => setIntakeDate(newValue)}
                      maxDate={dayjs()}
                      required
                      sx={{ flex: 1 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: theme.headerColor,
                        color: "white",
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
          <Card sx={{ gridArea: "events" }} elevation={5}>
            <CardHeader
              title={"Upcoming Events"}
              subheader={"These are the upcoming events you are enrolled in"}
              avatar={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <SportsMartialArtsIcon />
                  <DirectionsRunIcon />
                </Box>
              }
              sx={{
                "& .MuiCardHeader-title": {
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                },
                "& .MuiCardHeader-subheader": {
                  fontSize: { xs: "0.875rem", md: "1rem" },
                },
              }}
            />
            <CardContent>
              <List
                sx={{
                  padding: 0,
                  "& .MuiListItem-root": {
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 1 },
                    padding: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  },
                }}
              >
                {events.map((eventObj, ind) => (
                  <ListItem
                    key={`event-${ind}`}
                    sx={{
                      display: "flex",
                      alignItems: { xs: "stretch", sm: "center" },
                      justifyContent: { xs: "center", sm: "space-between" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 2 },
                        alignItems: { xs: "center", sm: "center" },
                        flex: 1,
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      <Typography
                        variant="body1"
                        component="div"
                        onClick={() =>
                          redirectToEventWithModalOpen(eventObj.eventName)
                        }
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            color: "primary.main",
                            textDecoration: "underline",
                          },
                          fontWeight: "medium",
                        }}
                      >
                        {eventObj.eventName}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          minWidth: { sm: "120px" },
                          textAlign: { xs: "center", sm: "left" },
                        }}
                      >
                        {eventObj.date}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      onClick={() => handleUnenroll(eventObj.eventName)}
                      sx={{
                        backgroundColor: theme.headerColor,
                        width: { xs: "100%", sm: "auto" },
                        minWidth: { sm: "100px" },
                        "&:hover": {
                          backgroundColor: alpha(theme.headerColor, 0.9),
                        },
                      }}
                    >
                      Unenroll
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ gridArea: "week" }} elevation={5}>
            <CardHeader
              title="Weekly Weight Stats"
              subheader="Track your performance over the last week"
              avatar={<TimelineIcon />}
              sx={{
                "& .MuiCardHeader-title": {
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                },
                "& .MuiCardHeader-subheader": {
                  fontSize: { xs: "0.875rem", md: "1rem" },
                },
              }}
            />
            <CardContent
              sx={{
                padding: { xs: 1, sm: 2 },
                "& .recharts-wrapper": {
                  maxWidth: "100%",
                  height: "auto !important",
                  minHeight: { xs: "250px", sm: "300px" },
                },
              }}
            >
              <ResponsiveContainer width="100%" height={300}> 
              <LineChart
                data={weightHistoryWithChange} // Data with weight and weightChange
                margin={{
                  top: 10,
                  right: 50, // Extra space for the secondary Y-axis labels
                  left: 20,
                  bottom: 10,
                }}
              >
                {/* Grid */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                
                {/* X-Axis */}
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    offset: -10,
                    fontSize: 14,
                  }}
                />
                
                {/* Left Y-Axis (for Weight) */}
                <YAxis
                  tick={{ fontSize: 12 }}
                  width={40}
                  label={{
                    value: "Weight (lbs)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 14,
                  }}
                />

                {/* Right Y-Axis (for Weight Change) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  width={40}
                  label={{
                    value: "Change in Weight (lbs)",
                    angle: 90,
                    position: "insideRight",
                    fontSize: 14,
                  }}
                />
                
                {/* Tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) =>
                    name === "Weight"
                      ? `${value} lbs`
                      : `${value > 0 ? "+" : ""}${value} lbs`
                  }
                />
                
                {/* Legend */}
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontSize: "12px",
                  }}
                />

                {/* Line for Weight */}
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#2196f3"
                  name="Weight"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />

                {/* Line for Weight Change (Uses Right Y-Axis) */}
                <Line
                  type="monotone"
                  dataKey="weightChange"
                  stroke="#ff5722"
                  name="Change in Weight"
                  strokeWidth={2}
                  yAxisId="right" // Bind to the right Y-axis
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>

                <LineChart
                  data={weekHistory}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} width={40} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{
                      paddingTop: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumedCalories"
                    stroke="#19229e"
                    name="Calories Consumed"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="burntCalories"
                    stroke="#8b0e0e"
                    name="Calories Burnt"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          
          <Card sx={{ gridArea: "burntout" }} elevation={5}>
            <CardHeader
              title={"Calorie Burn Out"}
              subheader={"Enter the calories burnt out"}
              avatar={<WhatshotIcon />}
            />
            <CardContent>
              <form onSubmit={handleAddCalorieBurnout}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", md: "center" },
                    "& .MuiTextField-root": {
                      flex: 1,
                      minWidth: { xs: "100%", md: "150px" },
                    },
                    "& .MuiButton-root": {
                      minWidth: { xs: "100%", md: "100px" },
                      height: { md: "56px" },
                    },
                  }}
                >
                  <TextField
                    label="Calories"
                    id="burntoutCalorieCount"
                    value={burntoutCalories}
                    onChange={(event) => {
                      setBurntoutCalories(event.target.value);
                    }}
                    type="number"
                    required
                  />
                  <DatePicker
                    label="Date"
                    value={burnoutDate}
                    onChange={(newValue) => setBurnoutDate(newValue)}
                    maxDate={dayjs()}
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{
                      backgroundColor: theme.headerColor,
                      color: "white",
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </form>
            </CardContent>

            {/* Another Field */}
            <Card sx={{ gridArea: "WeightTracker" }} elevation={5}>
            <CardHeader
              title={"Weight Tracker"}
              subheader={"Enter weight recorded on date"}
              avatar={<WhatshotIcon />}
            />
            <CardContent>
              <form onSubmit={handleAddWeight}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", md: "center" },
                    "& .MuiTextField-root": {
                      flex: 1,
                      minWidth: { xs: "100%", md: "150px" },
                    },
                    "& .MuiButton-root": {
                      minWidth: { xs: "100%", md: "100px" },
                      height: { md: "56px" },
                    },
                  }}
                >
                  <TextField
                    label="Weight(lbs)"
                    id="todaysweight"
                    value={todaysWeight}
                    onChange={(event) => {
                      setTodaysWeight(event.target.value);
                    }}
                    type="number"
                    required
                  />
                  <DatePicker
                    label="Date"
                    value={weightDate}
                    onChange={(newValue) => setWeightDate(newValue)}
                    maxDate={dayjs()}
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    style={{
                      backgroundColor: theme.headerColor,
                      color: "white",
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </form>
            </CardContent>
            </Card>

            

          

            {/* <Card sx={{ gridArea: "activity" }} elevation={5}>
              <CardHeader
                title={"Advanced Activity Monitoring"}
                subheader={
                  "Track your steps, calories burned, and workout intensity"
                }
                avatar={<FitnessCenterIcon />}
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    width={500}
                    height={300}
                    data={[
                      { day: "Mon", steps: 6000, calories: 200, intensity: 7 },
                      { day: "Tue", steps: 8000, calories: 250, intensity: 8 },
                      {
                        day: "Wed",
                        steps: 7000,
                        calories: 230,
                        intensity: 7.5,
                      },
                      { day: "Thu", steps: 9000, calories: 270, intensity: 9 },
                      {
                        day: "Fri",
                        steps: 10000,
                        calories: 300,
                        intensity: 9.5,
                      },
                      {
                        day: "Sat",
                        steps: 12000,
                        calories: 350,
                        intensity: 10,
                      },
                      { day: "Sun", steps: 11000, calories: 320, intensity: 9 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis
                      yAxisId="left"
                      label={{
                        value: "Steps",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{
                        value: "Calories Burned",
                        angle: 90,
                        position: "insideRight",
                      }}
                    />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="steps"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="calories"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}


          
          </Card>
          <Card sx={{ gridArea: "hist" }} elevation={5}>
            <CardHeader
              title={"Diet Tracker"}
              subheader={"This Week's Calories Consumed"}
              avatar={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LunchDiningIcon />
                  <LocalCafeIcon />
                </Box>
              }
            />
            <CardContent
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                overflowX: { xs: "hidden", md: "auto" },
                padding: { xs: 1, md: 2 },
                "::-webkit-scrollbar": {
                  height: "8px",
                },
                "::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                },
              }}
            >
              {dietHistory.map((day) => (
                <Card
                  key={day.dayIndex}
                  elevation={3}
                  sx={{
                    minWidth: { xs: "100%", md: "250px" },
                    flex: { md: "0 0 auto" },
                    marginBottom: { xs: 2, md: 0 },
                  }}
                >
                  <CardHeader
                    title={day.date}
                    avatar={<TodayIcon />}
                    sx={{
                      "& .MuiCardHeader-title": {
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      },
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: day.exceededDailyLimit
                          ? "error.main"
                          : "success.main",
                        textAlign: "center",
                        fontWeight: "bold",
                        paddingBottom: "10px",
                      }}
                    >
                      {`Total Calories : ${day.caloriesConsumed}`}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        borderBottom: 1,
                        borderColor: "divider",
                        paddingBottom: 1,
                        marginBottom: 1,
                      }}
                    >
                      Food Consumed
                    </Typography>

                    <List
                      sx={{
                        padding: 0,
                        "& .MuiListItem-root": {
                          padding: "4px 0",
                          minHeight: "40px",
                        },
                      }}
                    >
                      {day.foodConsumed.map((itemObj, ind) => (
                        <ListItem
                          key={`item-${ind}`}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            "& > *": {
                              fontSize: { xs: "0.875rem", md: "1rem" },
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ flex: 1, marginRight: 2 }}
                          >
                            {itemObj.item}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {itemObj.calories}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default UserCaloriesPage;
