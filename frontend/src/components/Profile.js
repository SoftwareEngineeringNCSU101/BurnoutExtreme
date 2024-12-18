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
  CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTheme } from "./ThemeContext";
import { toast, ToastContainer } from "react-toastify"

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
  const { theme } = useTheme();
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
    console.log(targetWeight, currentTargetCalories, activityLevel)
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
    } else if (event.target.value === "metric" && event.target.value !== prevSelectionUnit) {
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
  const initalDiet = "";
  var postHeight = 0;
  var postWeight = 0;
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [age, setAge] = useState(initialAge);
  const [weight, setWeight] = useState(initialWeight);
  const [height, setHeight] = useState(initialHeight);
  const [BMI, setBMI] = useState(initialBMI);
  const [sex, setSex] = useState(initialsex)
  const [profileImage, setProfileImage] = useState(null);
  const [diet, setDiet] = useState(initalDiet);
  const [fitnessPlan, setFitnessPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [planExists, setPlanExists] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };
  const activityOptions = { Minimal: "Sedentary(Office Job)", Light: "Light exercise (1-2 days/week)", Moderate: "Moderate exercise (3-5 days/week)", Heavy: "Heavy exercise (6-7 days/week)", Athlete: "Athlete (2x per day)" }
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
    console.log('height=' + height + 'weight:' + weight)
    if (units === "metric") {
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

  // Check if a fitness plan exists on component mount
  useEffect(() => {
    axios({
      method: 'GET',
      url: '/getFitnessPlan', // Assuming you create this endpoint
      headers: {
        Authorization: 'Bearer ' + props.state.token,
      },
    })
      .then((response) => {
        const res = response.data;
        if (res.status === 'Success') {
          setFitnessPlan(res.fitness_plan);
          setPlanExists(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error fetching fitness plan:', error.response);
        }
      });
  }, [props.state.token]);

  const handleGeneratePlan = () => {
    setLoading(true);
    if(age || weight || height || BMI || sex || diet)
    {
    axios({
      method: 'POST',
      url: '/generateFitnessPlan',
      headers: {
        Authorization: 'Bearer ' + props.state.token,
      },
    })
      .then((response) => {
        const res = response.data;
        if (res.status === 'Success') {
          setFitnessPlan(res.fitness_plan);
          setPlanExists(true);
          console.log({ fitnessPlan })
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error generating fitness plan:', error.response);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    }
    else 
    {
      toast.error("Please fill at least one of the following: Age, Weight, Height, Sex, or Diet", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Container maxWidth>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 2,
            gridTemplateAreas: {
              xs: `"profile" "goals" "bmi" "fitness"`,
              sm: `"profile goals" "bmi bmi" "fitness fitness"`,
              md: `"profile goals goals bmi" "profile fitness fitness fitness"`
            },
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
                <Avatar sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 } }}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <AccountCircleIcon sx={{ width: { xs: 50, sm: 70 }, height: { xs: 50, sm: 70 } }} />
                  )}
                </Avatar>
                <input
                  accept="image/*"
                  type="file"
                  style={{ display: "none" }}
                  id="upload-button"
                  onChange={handleImageUpload}
                />
                <label htmlFor="upload-button">
                  <Button variant="contained" component="span"  sx={{ 
                    marginTop: "10px", 
                    backgroundColor: theme.headerColor,
                    padding: { xs: '12px 24px', sm: '8px 16px' }
                  }}>
                    Upload Photo
                  </Button>
                </label>

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
                  sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="FirstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  fullWidth
                  sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
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
                  label={"Weight (" + weightUnit + ")"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  fullWidth
                  sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label={"Height (" + heightUnit + ")"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  fullWidth
                  sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
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
              <Button variant="contained" color="primary" style={{ backgroundColor: theme.headerColor }} onClick={handleProfileSubmit}>
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
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                gap: 2,
                gridTemplateAreas: {
                  xs: `"targetWeight" "activityLevel" "targetCalories" "saveButton"`,
                  sm: `"targetWeight activityLevel" "targetCalories ." "saveButton saveButton"`,
                  md: `"targetWeight activityLevel targetCalories" ". saveButton ."`
                },
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
                     style={{ backgroundColor: theme.headerColor }}
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
                  label={"Target weight (" + weightUnit + ")"}
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
                      style={{ backgroundColor: theme.headerColor }}
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
                      style={{ backgroundColor: theme.headerColor }}
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
                style={{ backgroundColor: theme.headerColor }}
                color="primary"
                onClick={handleSaveInput}
                maxWidth
              >
                Update
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ gridArea: "bmi", textAlign: "center"  }} elevation={5} >
            <CardHeader
              title={"Your Body Mass Index (BMI)"}
              subheader={"Measured based on height and weight"}
              titleTypography={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
              subheaderTypography={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
            />
            <CardContent>
              <Typography sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
                {BMI}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            gridArea: 'fitness',
            minHeight: { xs: '200px', sm: '250px' },
            display: 'flex',
            flexDirection: 'column'
            }} elevation={2}>
            <CardHeader
              title={"Your Fitness Plan"}
              subheader={"Customize your fitness goals"}
              sx={{
                '& .MuiCardHeader-title': {
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                  fontWeight: 600
                },
                '& .MuiCardHeader-subheader': {
                  fontSize: { xs: '0.8rem', sm: '1rem' }
                }
              }}
            />
            <CardContent sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    padding: { xs: 2, sm: 3 }
  }} >
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: 'orange' }}
                onClick={handleGeneratePlan}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Fitness Plan'}
              </Button>

              {planExists ? (
                <Box
                dangerouslySetInnerHTML={{ __html: fitnessPlan }}
                sx={{
                  width: '100%',
                  marginTop: 2,
                  padding: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 2,
                  overflowY: 'auto',
                  maxHeight: { xs: '300px', sm: '400px' }
                }}
              />
              ) : (
                <Typography variant="body2" color="textSecondary" mt={2}>
                  No fitness plan available. Click "Generate Fitness Plan" to create one!
                </Typography>
              )}
            </CardContent>
          </Card>

        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default Profile;
