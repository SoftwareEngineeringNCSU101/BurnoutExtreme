
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Footer from './Footer';

const FAQ = () => {
  const faqData = [
    {
      question: 'What is TDEE?',
      answer: 'Total daily energy expenditure (TDEE) estimates how many calories your body burns daily by accounting for three major contributing factors: your basal metabolic rate (BMR), your activity level and the thermic effect of food metabolism.',
    },
    {
      question: 'What is BMI?',
      answer: 'Body Mass Index (BMI) is a calcualtion based on height and weight. It is an approximate measure of body fat.',
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
    <div>
      {faqData.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
