import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid
} from '@mui/material'

/**
 * Display the schedule
 * @param {*} props
 * @returns
 */
const WorkoutDisplay = props => {
  const [workoutsData, setWorkoutsData] = useState([])

  // If props.schedules changes, update workoutsData
  useEffect(() => {
    setWorkoutsData(Array.isArray(props.schedules) ? props.schedules : [])
  }, [props.schedules])

  return (
    <Container sx={{ marginTop: '20px' }}>
      {workoutsData.length > 0 ? (
        <Grid container spacing={3}>
          {workoutsData.map((workout, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: '8px',
                  height: '100%',
                  backgroundColor: 'rgba(255, 165, 0, 0.1)',
                  borderBlockColor: 'orange'
                }}
              >
                <CardContent>
                  <Typography variant='h5' component='div' gutterBottom>
                    {workout.workoutTitle}
                  </Typography>
                  <Typography color='text.secondary'>
                    Duration: <strong> {workout.duration} minutes</strong>
                  </Typography>
                  <Typography color='text.secondary'>
                    Description: {workout.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  {workout.link && (
                    <Button
                      type='submit'
                      variant='contained'
                      size='small'
                      href={workout.link}
                      style={{ backgroundColor: 'orange', color: 'white' }}
                    >
                      Watch Video
                    </Button>
                  )}
                  {props.editMode && (
                    <Button
                      size='small'
                      variant='outlined'
                      color='error'
                      onClick={() =>
                        props.handleRemove(
                          workout.selectedDay,
                          workout.workoutTitle
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant='h4' align='center' gutterBottom>
          Today is Rest Day !
        </Typography>
      )}
    </Container>
  )
}
export default WorkoutDisplay
