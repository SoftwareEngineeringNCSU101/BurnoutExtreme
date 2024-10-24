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

const commonContainerStyles = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center', // Center horizontally
  alignItems: 'center' // Center vertically
}

const commonBoxStyles = {
  border: '1px solid gray',
  borderRadius: '4px',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  margin: '16px',
  width: '100%'
}

const Workouts = props => {
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
    <Container maxWidth={false} sx={{ width: '90%' }}>
      <Box
        sx={{
          marginTop: '10px',
          backgroundImage: `url(${headerImage})`,
          backgroundSize: '55%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '100px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <WorkOutHeader />
        <Container>
          <Box
            sx={{
              justifyContent: 'space-between',
              display: 'flex'
            }}
          >
            <Button
              type='submit'
              variant='contained'
              size='small'
              onClick={() => {
                setAddMode(!addMode)
              }}
              style={{
                backgroundColor: 'orange',
                color: 'white',
                width: '100px'
              }}
            >
              Add
            </Button>
            <Button
              type='submit'
              variant='contained'
              size='large'
              onClick={() => {
                setEditMode(!editMode)
              }}
              style={{
                backgroundColor: 'orange',
                color: 'white',
                width: '100px'
              }}
            >
              Edit
            </Button>
          </Box>
        </Container>
      </Box>
      <Container>
        {addMode && (
          <WorkoutForm
            addMode={addMode}
            setAddMode={setAddMode}
            onChange={handleAddSchedule}
            schedules={schedules[day]}
          />
        )}
      </Container>
      <Container
        sx={{
          ...commonContainerStyles
        }}
        disableGutters
        maxWidth={false}
      >
        <Box sx={{ ...commonBoxStyles }}>
          <Tabs
            value={day}
            onChange={(e, newValue) => {
              setDay(newValue)
            }}
            TabIndicatorProps={{
              sx: { backgroundColor: '#FFA000' }
            }}
            sx={{
              width: '100%',
              '& .MuiTab-root': {
                color: 'black',
                '&.Mui-selected': {
                  color: '#FFA000'
                }
              }
            }}
            centered
            variant='fullWidth'
          >
            {DAYSOFWEEK.map(day => (
              <Tab key={day.value} label={day.label} value={day.value} />
            ))}
          </Tabs>
          <Divider sx={{ width: '100%', margin: '8px 0' }} />
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
