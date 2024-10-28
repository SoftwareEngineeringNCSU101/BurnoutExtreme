import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const ActivityTracker = () => {
    const [steps, setSteps] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [workoutIntensity, setWorkoutIntensity] = useState('');
    const [activityData, setActivityData] = useState([]);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        // Fetch existing activity data from the backend (optional)
        fetch('/getActivityData')
            .then(response => response.json())
            .then(data => setActivityData(data))
            .catch(err => console.error(err));
    }, []);

    const handleTrackActivity = async () => {
        const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
        const response = await fetch('/trackActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Use the retrieved token
            },
            body: JSON.stringify({
                steps: steps,
                calories_burned: caloriesBurned,
                workout_intensity: workoutIntensity,
                activity_date: new Date().toISOString().split('T')[0] // Current date
            }),
        });

        const data = await response.json();
        console.log(data);

        // Update activity data state
        setActivityData([...activityData, data]);
        updateChartData([...activityData, data]);
    };

    const updateChartData = (data) => {
        const stepsData = data.map(activity => activity.steps);
        const dates = data.map(activity => activity.activity_date);

        setChartData({
            labels: dates,
            datasets: [
                {
                    label: 'Steps',
                    data: stepsData,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                },
            ],
        });
    };

    return (
        <div>
            <h2>Activity Tracker</h2>
            <input
                type="number"
                placeholder="Steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
            />
            <input
                type="number"
                placeholder="Calories Burned"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
            />
            <input
                type="text"
                placeholder="Workout Intensity"
                value={workoutIntensity}
                onChange={(e) => setWorkoutIntensity(e.target.value)}
            />
            <button onClick={handleTrackActivity}>Track Activity</button>

            <h3>Activity Data</h3>
            {chartData.labels && <Line data={chartData} />}
        </div>
    );
};

export default ActivityTracker;
