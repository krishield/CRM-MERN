import React from 'react';
import { Container, Typography, Button, Box, Grid, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  position: 'relative',
});

const SearchBox = styled(Box)({
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: '20px',
  borderRadius: '10px',
});

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <HeroSection>
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Rajpurohit Matrimony
          </Typography>
          <Typography variant="h6" gutterBottom>
            Join the most trusted matrimony site for finding life partners.
          </Typography>
          <SearchBox>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Search by Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Age" variant="outlined" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Religion" variant="outlined" />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
              Search Now
            </Button>
          </SearchBox>
        </Box>
      </HeroSection>

      {/* Featured Profiles */}
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Featured Profiles
        </Typography>
        <Grid container spacing={4}>
          {/* Sample profiles */}
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <img
                src="https://via.placeholder.com/200"
                alt="Profile"
                style={{ borderRadius: '50%', width: '150px', height: '150px' }}
              />
              <Typography variant="h6" fontWeight="bold" mt={2}>
                John Doe
              </Typography>
              <Typography>28, Hindu, Engineer</Typography>
              <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                View Profile
              </Button>
            </Box>
          </Grid>
          {/* Add more profiles similarly */}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to Start Your Journey?
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} to="/signup">
          Join Now
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
