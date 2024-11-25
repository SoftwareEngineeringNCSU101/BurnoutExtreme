import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'; // Updated to use @mui/material
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Updated to use @mui/icons-material
import Footer from './Footer';
import { useTheme } from './ThemeContext'; // Import the theme context

const FAQ = () => {
  const theme = useTheme(); // Access the current theme

  const faqData = [
    {
      question: 'What is TDEE?',
      answer: 'Total daily energy expenditure (TDEE) estimates how many calories your body burns daily by accounting for three major contributing factors: your basal metabolic rate (BMR), your activity level and the thermic effect of food metabolism.',
    },
    {
      question: 'What is BMI?',
      answer: 'Body Mass Index (BMI) is a calculation based on height and weight. It is an approximate measure of body fat.',
    },
    {
      question: 'What should I do if I encounter technical issues with the app?',
      answer: 'If you experience technical difficulties, please contact our support team through the app or visit our support page on the website.',
    },
    {
      question: 'What is the recommended workout duration for beginners?',
      answer: 'For beginners, we recommend starting with 20-30 minute workouts and gradually increasing the duration as your fitness level improves.',
    },
    {
      question: 'Is it okay to eat before a workout?',
      answer: 'Eating a small, balanced meal or snack before a workout can provide energy. The app offers pre-workout nutrition tips and suggestions for suitable pre-exercise meals.',
    },
    {
      question: 'How do I calculate my daily calorie needs?',
      answer: 'The app provides a built-in calorie calculator based on your age, gender, weight, height, and activity level. It helps you determine your daily calorie requirements for weight maintenance or specific fitness goals.',
    },
    {
      question: 'How often should I exercise?',
      answer: 'It is generally recommended to exercise at least 3-5 times a week, depending on your fitness goals and level.',
    },
    {
      question: 'What are the benefits of regular exercise?',
      answer: 'Regular exercise can help improve cardiovascular health, strengthen muscles, enhance flexibility, boost mental health, and aid in weight management.',
    },
    {
      question: 'What should I eat before a workout?',
      answer: 'It is recommended to eat a balanced meal containing carbohydrates, protein, and healthy fats 2-3 hours before a workout. A small snack like a banana or a protein bar can be consumed 30-60 minutes before exercising.',
    },
    {
      question: 'How can I track my progress?',
      answer: 'You can track your progress by keeping a workout journal, using fitness apps, or wearing fitness trackers that monitor your activity levels, heart rate, and other metrics.',
    },
    {
      question: 'What is the best time of day to exercise?',
      answer: 'The best time to exercise varies for each individual. Some people prefer morning workouts to start their day with energy, while others find evening workouts more convenient. Choose a time that fits your schedule and allows you to be consistent.',
    },
    {
      question: 'How can I stay motivated to exercise regularly?',
      answer: 'Setting realistic goals, finding a workout buddy, varying your exercise routine, and rewarding yourself for milestones can help you stay motivated to exercise regularly.',
    },
    {
      question: 'What should I do if I miss a workout?',
      answer: 'If you miss a workout, don’t stress. Simply get back on track with your next scheduled workout. Consistency over time is more important than any single workout.',
    },
    {
      question: 'Can I exercise if I have a medical condition?',
      answer: 'If you have a medical condition, it is important to consult with your healthcare provider before starting any new exercise program to ensure it is safe for you.',
    },
    {
      question: 'What type of exercise is best for weight loss?',
      answer: 'A combination of cardiovascular exercises (like running, cycling, or swimming) and strength training exercises (like weight lifting or bodyweight exercises) is effective for weight loss.',
    },
    {
      question: 'How important is rest and recovery?',
      answer: 'Rest and recovery are crucial for allowing your muscles to repair and grow stronger. It also helps prevent injury and burnout. Make sure to include rest days in your exercise routine.',
    },
    {
      question: 'How can I improve my flexibility?',
      answer: 'Incorporating stretching exercises and yoga into your routine can help improve flexibility. The app provides guided stretching routines and yoga sessions.',
    },
    {
      question: 'What is the importance of hydration during exercise?',
      answer: 'Staying hydrated is crucial for maintaining performance and preventing dehydration. Drink water before, during, and after your workouts. The app includes hydration reminders and tips.',
    },
    {
      question: 'Can I customize my workout plan?',
      answer: 'Yes, the app allows you to customize your workout plan based on your fitness goals, preferences, and schedule. You can choose from various exercises and routines.',
    },
    {
      question: 'What should I do if I feel pain during a workout?',
      answer: 'If you experience pain during a workout, stop immediately and assess the situation. It is important to differentiate between discomfort and pain. Consult a healthcare professional if necessary.',
    },
    {
      question: 'How can I prevent injuries during exercise?',
      answer: 'To prevent injuries, ensure you warm up before exercising, use proper form and technique, and avoid overtraining. The app provides warm-up routines and exercise tutorials.',
    },
    {
      question: 'What are some effective ways to manage stress?',
      answer: 'Regular exercise, mindfulness practices, adequate sleep, and a balanced diet can help manage stress. The app offers stress management tips and guided meditation sessions.',
    },
    {
      question: 'How can I improve my sleep quality?',
      answer: 'Establishing a regular sleep schedule, creating a relaxing bedtime routine, and avoiding screens before bed can improve sleep quality. The app includes sleep tracking and tips for better sleep.',
    },
    {
      question: 'What is the role of protein in muscle building?',
      answer: 'Protein is essential for muscle repair and growth. Consuming adequate protein through diet or supplements can support muscle building. The app provides nutrition guidance and protein-rich meal ideas.',
    },
    {
      question: 'How can I stay consistent with my fitness routine?',
      answer: 'Setting realistic goals, tracking your progress, and finding enjoyable activities can help you stay consistent. The app offers goal-setting features and progress tracking tools.',
    },
    {
      question: 'What are some healthy post-workout snacks?',
      answer: 'Healthy post-workout snacks include options like a protein shake, Greek yogurt with fruit, or a handful of nuts. The app provides post-workout nutrition tips and snack ideas.',
    },
    {
      question: 'How can I balance exercise with a busy schedule?',
      answer: 'Prioritize short, effective workouts and incorporate physical activity into your daily routine. The app offers quick workout options and time management tips for staying active.',
    },
  ];

  return (
    <div style={{ backgroundColor: theme.background, color: theme.color, padding: '20px' }}>
      {faqData.map((faq, index) => (
        <Accordion key={index} sx={{ backgroundColor: theme.accordionBackground, color: theme.accordionColor }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.iconColor }} />}>
            <Typography variant="h6">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
      <Footer />
    </div>
  );
};

export default FAQ;
