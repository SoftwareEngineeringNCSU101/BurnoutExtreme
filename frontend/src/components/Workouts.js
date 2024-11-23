import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  Button,
  Divider,
  Box,
  Tab,
  Tabs
} from '@mui/material'
import Footer from './Footer'
import WorkoutDisplay from './WorkoutDisplay'
import WorkoutForm from './WorkoutForm'
import { DAYSOFWEEK, workoutTitles } from '../constants/DaysOfWeek'
import headerImage from '../images/header.webp'
import { useTheme } from './ThemeContext';

const commonContainerStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },// Center horizontally
  justifyContent: 'center',
  alignItems: 'center', // Center vertically
  padding: { xs: '1rem', sm: '2rem' },
  gap: { xs: '1rem', sm: '2rem' },
}

const commonBoxStyles = {
  border: '1px solid organe',
  borderRadius: '4px',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  margin: '16px',
  width: '100%',
  backgroundColor: 'rgba(255, 165, 0, 0.1)'
}

const Workouts = props => {
  const { theme } = useTheme();
  const [day, setDay] = useState('Monday')
  const [editMode, setEditMode] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [schedules, setSchedules] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  })

  const handleAddSchedule = (selectedDay, workoutData) => {
    setSchedules(prevSchedules => {
      const updatedSchedules = {
        ...prevSchedules,
        [selectedDay]: [...(prevSchedules[selectedDay] || []), workoutData]
      }

      axios
        .post(
          '/createSchedule',
          {
            weekSchedule: updatedSchedules
          },
          {
            headers: {
              Authorization: 'Bearer ' + props.state.token
            }
          }
        )
        .then(response => console.log(response.data))
        .catch(error =>
          console.error('Error:', error.response || error.message)
        )

      return updatedSchedules
    })
  }

  const handleRemoveSchedule = (selectedDay, workoutTitle) => {
    setSchedules(prevSchedules => {
      const updatedSchedules = {
        ...prevSchedules,
        [selectedDay]: prevSchedules[selectedDay].filter(
          workout => workout.workoutTitle !== workoutTitle
        )
      }

      axios
        .delete(`/deleteSchedule/${selectedDay}/${workoutTitle}`, {
          headers: {
            Authorization: 'Bearer ' + props.state.token
          }
        })
        .then(response => {
          console.log('Schedule updated successfully:', response.data)
        })
        .catch(error =>
          console.error('Error:', error.response || error.message)
        )

      return updatedSchedules
    })
  }

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('/mySchedule', {
          headers: {
            Authorization: 'Bearer ' + props.state.token
          }
        })
        setSchedules(response.data.data)
      } catch (error) {
        console.error(
          'Error fetching schedule:',
          error.response || error.message
        )
      }
    }
    fetchSchedules()
  }, [props.state.token])

  return (
    <Container maxWidth={false} sx={{ width: '90%', padding: { xs: '10px', sm: '20px' } }}>
      <Box
        sx={{
          marginTop: '10px',
          backgroundImage: `url(${headerImage})`,
          backgroundSize: { xs: '100%', sm: '55%' },
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: { xs: '20px', sm: '40px' },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <WorkOutHeader />
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'center', sm: 'space-between' },
              gap: '10px',
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
              padding: { xs: '0 20px', sm: '0' }
            }}
          >
            <Button
              type='submit'
              variant='contained'
              fullWidth
              onClick={() => {
                setAddMode(!addMode)
              }}
              sx={{
                backgroundColor: theme.headerColor,
                color: 'white',
                minHeight: '48px',
                '&:hover': {
        backgroundColor: '#FF8C00'
      }
              }}
            >
              Add
            </Button>
            <Button
              type='submit'
              variant='contained'
              fullWidth
              onClick={() => setEditMode(!editMode)}
              sx={{
                backgroundColor: theme.headerColor,
                color: 'white',
                minHeight: '48px',
                '&:hover': {
        backgroundColor: '#FF8C00'
      }
              }}
            >
              Edit
            </Button>
          </Box>
        </Container>
      </Box>

      {addMode && (
      <Container>
          <WorkoutForm
            addMode={addMode}
            setAddMode={setAddMode}
            onChange={handleAddSchedule}
            schedules={schedules[day]}
          />
        </Container>
      )}
      <Container
        sx={{
          ...commonContainerStyles,
          mt: { xs: 2, sm: 3 }
        }}
        disableGutters
        maxWidth={false}
      >
        <Box sx={{
              ...commonBoxStyles,
              backgroundColor: 'rgba(255, 248, 240, 0.9)',
              borderRadius: '8px',
              padding: { xs: '12px', sm: '24px' },
              margin: { xs: '8px 0', sm: '16px 0' }
            }}>
            <Tabs
              value={day}
              onChange={(e, newValue) => {
              setDay(newValue)
            }}
            TabIndicatorProps={{
              sx: { backgroundColor: theme.headerColor, height: '2px' }
            }}
            sx={{
              '& .MuiTab-root': {
                color: '#666',
                minWidth: { xs: '100px', sm: '140px' },
                flex: { xs: 'none', sm: 1 },
                padding: { xs: '6px 4px', sm: '12px 16px' },
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                textTransform: 'uppercase',
                '&.Mui-selected': {
                  color: 'orange',
                  fontWeight: 500
                }
              },
              '& .MuiTabs-flexContainer': {
      justifyContent: { xs: 'flex-start', sm: 'space-between' }, // Start alignment in mobile, space-between in desktop
      width: '100%',
      gap: { xs: '8px', sm: 0 } // Add gap only in mobile view
    },
    '& .MuiTabs-scroller': {
      overflowX: { xs: 'auto !important', sm: 'hidden' }, // Enable scroll only in mobile
      '::-webkit-scrollbar': { height: '0px' },
      scrollBehavior: 'smooth'
    }
  }}
  variant={{ xs: 'scrollable', sm: 'fullWidth' }} // Scrollable in mobile, fullWidth in desktop
  scrollButtons={false}
          >
            {DAYSOFWEEK.map(day => (
              <Tab key={day.value} label={day.label} value={day.value} />
            ))}
          </Tabs>
          <Divider sx={{ 
            width: '100%', 
            height: '1px',
            margin: '0',  
            backgroundColor: theme.headerColor ,
             position: 'relative',
            top: '-1px'
            }}  />
          {schedules && day && (
            <WorkoutDisplay
              schedules={schedules[day]}
              editMode={editMode}
              handleRemove={handleRemoveSchedule}
            />
          )}
        </Box>
      </Container>
      <Footer />
    </Container>
  )
}

const WorkOutHeader = () => {
  return (
    <Container maxWidth='sm' style={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography
        component='h1'
        variant='h2'
        align='center'
        color='text.primary'
        gutterBottom
        sx={{ color: 'Black' }}
      >
        <strong>My Workout Week</strong>
      </Typography>
    </Container>
  )
}

export default Workouts
