import React from 'react';
import { Container, Typography, Link, TextField, Button } from '@mui/material';
import Footer from './Footer';

const ContactUs = (props) => {
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('yname');
    const subject = formData.get('subject');
    const message = formData.get('message');
    // Compose the email body
    const emailBody = `Message: ${message.value}, From: ${name}`;
    // Construct the mailto link
    const mailtoLink = `mailto:contactus_burnout@​yahoo.com?subject=${subject}&body=${encodeURIComponent(emailBody)}`;
    // Open the default email client
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '60px' }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Contact Us
        </Typography>
        <Typography variant="h5" align="justify" color="text.primary" paragraph>
          Use the email below to contact the BurnOut development team. Feel free to reach out to us for any questions, feedback, or inquiries.
          <br></br><br></br>
          Fill out the form below to send us an email.
        </Typography>
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Email: <Link href="contactus_burnout@​yahoo.com">contactus_burnout@​yahoo.com</Link>
        </Typography>
        <Typography variant="h6" color="text.secondary" style={{ marginTop: '20px' }}>
          We will respond to you as soon as we can!
        </Typography>
        <form style={{ marginTop: '20px' }} onSubmit={handleFormSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="yname"
            required
          />
          <TextField
            label="Subject"
            variant="outlined"
            multiline
            rows={1}
            fullWidth
            margin="normal"
            name="subject"
          />
          <TextField
            label="Message"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            name="message"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '20px', backgroundColor: 'orange', color: 'white' }}
          >
            Submit
          </Button >
        </form>
      </Container>
      <Footer />
    </div >
  );
};

export default ContactUs;
