import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  TextField,
  Avatar,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const weightCardStyles = {
  weightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  weightText: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
};

function Profile(props) {
  const [targetWeight, settargetWeight] = useState("");
  const [currentTargetCalories, setTargetCalories] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [editableWeight, setEditableTargetWeight] = useState(targetWeight);
  const [editableTargetCalories, setEditableTargetCalories] = useState(currentTargetCalories);
  const [editableActivityLevel, setEditableActivityLevel] = useState(activityLevel);
  const [units, setUnit] = useState("imperial");
  const [weightUnit, setWUnit] = useState("lbs");
  const [heightUnit, setHUnit] = useState("ft");
  const [prevSelectionUnit, setPrevUnit] = useState("imperial");

  const handleSaveInput = (e) => {
    console.log(editableWeight, editableTargetCalories, editableActivityLevel)
    settargetWeight(editableWeight);
    setTargetCalories(editableTargetCalories);
    setActivityLevel(editableActivityLevel);
    console.log(targetWeight,currentTargetCalories, activityLevel)
    if (units === "metric") {
      postWeight = (parseFloat(editableWeight) * 2.20462).toFixed(2);
    } else {
      postWeight = editableWeight;
    }
    axios({
      method: "POST",
      url: "/goalsUpdate",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
      data: {
        targetWeight: postWeight,
        targetCalories: editableTargetCalories,
        activityLevel: editableActivityLevel,
      },
    })
      .then((response) => {
        const res = response.data;
        console.log(res)
        window.location.reload(false)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
    if (event.target.value === "imperial" && event.target.value !== prevSelectionUnit) {
      setPrevUnit("imperial");
      setEditableTargetWeight((parseFloat(editableWeight) * 2.20462).toFixed(2));
      setWeight((parseFloat(weight) * 2.20462).toFixed(2));
      setHeight((parseFloat(height) / 30.4).toFixed(2));
      setWUnit("lbs");
      setHUnit("ft");
    } else if(event.target.value === "metric" && event.target.value !== prevSelectionUnit){
      setPrevUnit("metric");
      setEditableTargetWeight((parseFloat(editableWeight) / 2.20462).toFixed(2));
      setWeight((parseFloat(weight) / 2.20462).toFixed(2));
      setHeight((parseFloat(height) * 30.4).toFixed(2));
      setWUnit("kg");
      setHUnit("cm");
    }
  }

  const initialFirstName = "";
  const initialLastName = "";
  const initialAge = "";
  const initialWeight = "";
  const initialHeight = "";
  const initialBMI = 0;
  const initialsex = "";
  var postHeight = 0;
  var postWeight = 0;
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [age, setAge] = useState(initialAge);
  const [weight, setWeight] = useState(initialWeight);
  const [height, setHeight] = useState(initialHeight);
  const [BMI, setBMI] = useState(initialBMI);
  const [sex, setSex] = useState(initialsex)
  const activityOptions = {Minimal:"Sedentary(Office Job)",Light: "Light exercise (1-2 days/week)",Moderate: "Moderate exercise (3-5 days/week)",Heavy: "Heavy exercise (6-7 days/week)",Athlete: "Athlete (2x per day)"}
  const sexes = ["Male", "Female"]
  useEffect(() => {
    // Make API call to backend to get food items and their calories from DB.
    axios({
      method: "GET",
      url: "/profile",
      headers: {
        Authorization: "Bearer " + props.state.token,
      },
    })
      .then((response) => {
        const res = JSON.parse(response['data']);
        console.log(res)
        setFirstName(res.first_name)
        setLastName(res.last_name)
        setAge(res.age)
        setWeight(res.weight)
        setHeight(res.height)
        setSex(res.sex)
        setActivityLevel(res.activity_level)
        setTargetCalories(res.target_calories)
        settargetWeight(res.target_weight)
        setEditableActivityLevel(res.activity_level)
        setEditableTargetCalories(res.target_calories)
        setEditableTargetWeight(res.target_weight)
        setBMI(res.bmi)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    }, [props.state.token]);

    const handleProfileSubmit = (e) => {
      console.log('height=' + height + 'weight:'+ weight)
      if(units === "metric") {
        postWeight = (parseFloat(weight) * 2.20462).toFixed(2)
        postHeight = (parseFloat(height) / 30.4).toFixed(2)
      } else {
        postWeight = weight
        postHeight = height
      }
      axios({
        method: "POST",
        url: "/profileUpdate",
        headers: {
          Authorization: "Bearer " + props.state.token,
        },
        data: {
          firstName: firstName,
          lastName: lastName,
          age: age,
          height: postHeight,
          weight: postWeight,
          sex: sex,
          activityLevel: activityLevel
        },
      })
        .then((response) => {
          const res = response.data;
          console.log(res)
          window.location.reload(false)
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    };

  return (
    <>
      <Container maxWidth>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 2,
            gridTemplateRows: "auto",
            gridTemplateAreas: `"profile  goals goals goals bmi"
                                "profile  . . . ."`,
            paddingTop: "2rem",
          }}
        >
          <Card sx={{ gridArea: "profile" }} elevation={5}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "column",
                  paddingBottom: "5px",
                }}
              >
                <Avatar sx={{ width: 100, height: 100 }}>
                  <AccountCircleIcon sx={{ width: 70, height: 70 }} />
                </Avatar>
                <Typography variant="h5" mt={2}>
                  Profile
                </Typography>
              </Box>
              <Box mb={2}>
                <TextField
                  label="LastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="FirstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <ToggleButtonGroup
                  color="primary"
                  value={units}
                  exclusive
                  onChange={handleUnitChange}
                  aria-label="Platform"
                >
                  <ToggleButton value="imperial">Imperial</ToggleButton>
                  <ToggleButton value="metric">Metric</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box mb={2}>
                <TextField
                  label={"Weight ("+weightUnit+")"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label={"Height ("+heightUnit+")"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sex</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sex}
                  label="Sex"
                  onChange={(e) => setSex(e.target.value)}
                >
                  {sexes.map((item) => (
                    <MenuItem key={item} value={item}>
                    {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Box>
              <Button variant="contained" color="primary" style={{ backgroundColor: 'orange' }}onClick={handleProfileSubmit}>
                Update  
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ gridArea: "goals" }} elevation={5}>
            <CardHeader
            title={"Your Goals"}
            subheader={"Update your goals here"}
            />
            <CardContent
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                gridTemplateRows: "auto",
                gridTemplateAreas: `"targetWeight activityLevel targetCalories"
                                    ". saveButton ."`,
                paddingTop: "2rem",
              }}
            >
                <Card
                  sx={{ gridArea: "targetWeight" }}
                  elevation={2}
                >
                  <CardContent>
                    <div style={weightCardStyles.weightContainer}>
                      <IconButton
                        style={{ color: 'orange' }}
                        aria-label="weighing scale icon"
                      >
                        <FitnessCenterIcon fontSize="large" />
                      </IconButton>
                      <Typography style={weightCardStyles.weightText}>
                        {targetWeight}
                      </Typography>
                    </div>
                  </CardContent>
                  <TextField
                    label={"Target weight ("+weightUnit+")"}
                    variant="outlined"
                    fullWidth
                    value={editableWeight}
                    onChange={(e) => setEditableTargetWeight(e.target.value)}
                  />
                </Card>
                <Card
                  sx={{ gridArea: "activityLevel" }}
                  elevation={2}
                >
                  <CardContent>
                    <div style={weightCardStyles.weightContainer}>
                      <IconButton
                        style={{ color: 'orange' }}
                        aria-label="running icon"
                      >
                        <DirectionsRunIcon fontSize="large" />
                      </IconButton>
                      <Typography style={weightCardStyles.weightText}>
                        {activityLevel}
                      </Typography>
                    </div>
                  </CardContent>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Activity Level</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editableActivityLevel}
                      label="Activity Level"
                      onChange={(e) => setEditableActivityLevel(e.target.value)}
                    >
                      {Object.keys(activityOptions).map((item) => (
						<MenuItem key={activityOptions[item]} value={item}>
						{activityOptions[item]}
						</MenuItem>
						))}
                    </Select>
                  </FormControl>
                </Card>
                <Card
                  sx={{ gridArea: "targetCalories" }}
                  elevation={2}
                >
                  <CardContent>
                    <div style={weightCardStyles.weightContainer}>
                      <IconButton
                        style={{ color: 'orange' }}
                        aria-label="calories icon"
                      >
                        <WhatshotIcon fontSize="large" />
                      </IconButton>
                      <Typography style={weightCardStyles.weightText}>
                        {currentTargetCalories}
                      </Typography>
                    </div>
                  </CardContent>
                  <div>
                    <Typography align="center">
                      TDEE 
                    </Typography>
                    <Typography align="center">
                    calculated based on your personal information
                    </Typography>
                  </div>
                </Card>
              <Button
                sx={{ gridArea: "saveButton" }}
                variant="contained"
                style={{ backgroundColor: 'orange' }}
                color="primary"
                onClick={handleSaveInput}
                maxWidth
              >
                Update
              </Button>
              </CardContent>
          </Card>
          <Card sx={{ gridArea: "bmi" }} elevation={5} alignItems = "center">
            <CardHeader
              title={"Your Body Mass Index (BMI)"}
              subheader={"Measured based on height and weight"}
            />
            <CardContent
              sx={{
                gap: 2,
                paddingTop: "2rem",
                alignItems: "center",
              }}
            >
            <Typography variant="h2" mt={2}>
              {BMI}
            </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer/>
    </>
  );
}

export default Profile;
