import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  ListSubheader,
  InputAdornment,
  MenuItem
} from '@mui/material'
import axios from 'axios'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import { Container, Typography } from '@mui/material'
import Footer from './Footer'
import headerImage from '../images/meal.webp'

import { useTheme } from './ThemeContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1
export default function Meals (props) {
  const { theme } = useTheme();
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [mealName, setMealName] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [ingredientCalories, setIngredientCalories] = useState([])
  const [searchText, setSearchText] = useState('')
  const [foodItems, setFoodItems] = useState({})
  const [meals, setMeals] = useState([])
  const [mealType, setMealType] = useState('');
  const displayedOptions = useMemo(
    () =>
      Object.keys(foodItems).filter(option => containsText(option, searchText)),
    [foodItems, searchText]
  )

  const handleCreateMeal = event => {
    event.preventDefault(); // Prevent form submission default behavior
    axios({
      method: 'post',
      url: '/createMeal',
      headers: {
        Authorization: 'Bearer ' + props.state.token,
      },
      data: {
        mealName: mealName,
        ingredients: ingredients,
        mealType: mealType, // Include meal type in the payload
      },
    })
      .then(response => {
        const res = response.data;
        console.log(res);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  const handleCreateCustomFood = event => {
    axios({
      method: 'post',
      url: '/createFood',
      headers: {
        Authorization: 'Bearer ' + props.state.token
      },
      data: {
        foodName: foodName,
        calories: calories
      }
    })
      .then(response => {
        const res = response.data
        console.log(res)
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }

  const handleIngredientSelection = event => {
    const {
      target: { value }
    } = event
    setIngredients(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: '/foodCalorieMapping',
      headers: {
        Authorization: 'Bearer ' + props.state.token
      }
    })
      .then(response => {
        const res = response.data
        setFoodItems(res)
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })

    axios({
      method: 'GET',
      url: '/myMeals',
      headers: {
        Authorization: 'Bearer ' + props.state.token
      }
    })
      .then(response => {
        const res = response.data
        setMeals(res)
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }, [props.state.token])
  return (
    <div>
      <Container
        maxWidth='lg'
        style={{ textAlign: 'center', marginTop: '20px', width: '60%' }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            backgroundImage: `url(${headerImage})`,
            backgroundSize: '65%', // Cover the entire area
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '70px', // Top padding
            width: '100%',
            height: '300px'
          }}
        >
          <Typography
            component='h1'
            variant='h2'
            align='center'
            color='text.primary'
            gutterBottom
          >
            <strong>My Meals</strong>
          </Typography>
        </Box>
      </Container>
      <Container maxWidth>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 2,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"custom-food custom-food custom-food create-meal create-meal create-meal"
                              "meal meal meal meal meal meal"`,
            paddingTop: '2rem'
          }}
        >
          <Card sx={{ gridArea: 'custom-food' }} elevation={5}>
            <CardHeader
              title={'Custom Food'}
              subheader={
                'Enter the food name and calorie information to add it to the list of foods'
              }
              avatar={<FastfoodIcon />}
            />
            <CardContent>
              <form onSubmit={handleCreateCustomFood}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ paddingBottom: '1rem' }}>
                    <FormControl fullWidth>
                      <TextField
                        label='Food Item Name'
                        id='foodName'
                        value={foodName}
                        onChange={event => {
                          setFoodName(event.target.value)
                        }}
                        type='text'
                        required
                      />
                    </FormControl>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TextField
                      label='Calories'
                      id='calories'
                      value={calories}
                      onChange={event => {
                        setCalories(event.target.value)
                      }}
                      type='number'
                      required
                    />
                    <Button
                      type='submit'
                      variant='contained'
                      size='large'
                      style={{ backgroundColor: theme.headerColor, color: 'white' }}
                    >
                      Create Food
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
          
          
          <Card sx={{ gridArea: 'create-meal' }} elevation={5}>
          <CardHeader
            title={'Create Meal'}
            subheader={
              'Enter the meal name and select the ingredients to create a meal'
            }
            avatar={<FastfoodIcon />}
          />
          <CardContent>
            <form onSubmit={handleCreateMeal}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ paddingBottom: '1rem' }}>
                  <FormControl fullWidth>
                    <TextField
                      label="Meal Name"
                      id="mealName"
                      value={mealName}
                      onChange={(event) => {
                        setMealName(event.target.value);
                      }}
                      type="text"
                      required
                    />
                  </FormControl>
                </Box>
                <Box sx={{ paddingBottom: '1rem' }}>
                  <FormControl fullWidth>
                    <InputLabel id="ingredients">Ingredient Name</InputLabel>
                    <Select
                      MenuProps={{ autoFocus: false }}
                      labelId="ingredientName"
                      id="search-select"
                      multiple
                      value={ingredients}
                      label="Ingredient Name"
                      onChange={handleIngredientSelection}
                      required
                    >
                      <ListSubheader>
                        <TextField
                          size="small"
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
                            if (e.key !== 'Escape') {
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
                {/* Added Meal Type Dropdown */}
                <Box sx={{ paddingBottom: '1rem' }}>
                  <FormControl fullWidth>
                    <InputLabel id="mealType">Meal Type</InputLabel>
                    <Select
                      labelId="mealType"
                      id="mealType-select"
                      value={mealType}
                      onChange={(event) => setMealType(event.target.value)}
                      label="Meal Type"
                      required
                    >
                      <MenuItem value="Breakfast">Breakfast</MenuItem>
                      <MenuItem value="Lunch">Lunch</MenuItem>
                      <MenuItem value="Dinner">Dinner</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  style={{ backgroundColor: theme.headerColor || 'blue', color: 'white' }}
                >
                  Create Meal
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Card sx={{ gridArea: 'meal', borderRadius: '12px', boxShadow: 5 }}>
  <CardHeader
    title="My Meals"
    subheader="Your custom created meals"
    avatar={
      <>
        <LunchDiningIcon sx={{ color: '#FFA500', fontSize: 30 }} />
        <LocalCafeIcon sx={{ color: '#FF6347', fontSize: 30 }} />
      </>
    }
    sx={{
      backgroundColor: theme.headerColor || 'blue', // Using the same background color as the button
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      padding: '20px',
    }}
  />
  <CardContent
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      padding: '20px',
    }}
  >
    {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => {
      const filteredMeals = meals.filter((meal) => meal.mealType === mealType);

      if (filteredMeals.length === 0) {
        return (
          <div key={mealType} style={{ marginBottom: '20px' }}>
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                marginBottom: '10px',
                fontWeight: 'bold',
                color: '#B0B0B0',
              }}
            >
              No meals for {mealType}
            </Typography>
          </div>
        );
      }

      return (
        <div key={mealType} style={{ marginBottom: '20px' }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            {mealType}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              padding: '10px',
              justifyContent: 'center',
            }}
          >
            {filteredMeals.map((meal, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: '280px',
                  maxWidth: '320px',
                  flexShrink: 0,
                  borderRadius: '8px',
                  boxShadow: 3,
                  overflow: 'hidden',
                  backgroundColor: '#fafafa',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 10,
                  },
                }}
              >
                <CardHeader
                  title={meal.meal_name}
                  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    backgroundColor: theme.headerColor || 'blue', // Same background color here
                    color: '#333',
                  }}
                />
                <CardContent>
                  <Typography variant="body2" sx={{ textAlign: 'center', marginBottom: '10px' }}>
                    Ingredients:
                  </Typography>
                  <List sx={{ textAlign: 'left' }}>
                    {meal.ingredients.map((item, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start', // Align left
                          padding: '5px 10px',
                        }}
                      >
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {idx + 1}. {item}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}
                  >
                    Total Calories:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#FF5722',
                      marginBottom: '20px',
                    }}
                  >
                    {meal.total_calories}
                  </Typography>
                  <div style={{ textAlign: 'center' }}>
                    {(() => {
                      const data =
                        meal?.ingredientCalories?.map((calories, idx) => ({
                          name: meal?.ingredients[idx],
                          calories,
                        })) || [];

                      return (
                        <PieChart width={200} height={200}>
                          <Pie
                            data={data}
                            dataKey="calories"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            innerRadius={30}
                            fill="#82ca9d"
                            label
                          >
                            {data.map((entry, idx) => (
                              <Cell
                                key={`cell-${idx}`}
                                fill={COLORS[idx % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </Box>
        </div>
      );
    })}
  </CardContent>
</Card>



        </Box>
      </Container>
      <Footer />
    </div>
  )
}