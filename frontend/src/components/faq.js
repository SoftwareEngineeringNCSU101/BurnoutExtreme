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
