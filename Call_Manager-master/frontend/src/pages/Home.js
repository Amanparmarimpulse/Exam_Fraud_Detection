import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { 
  Box, 
  Button, 
  Card, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';

// Feature cards data
const features = [
  {
    title: "Meeting Recording",
    description: "Record video meetings with high-quality audio and video for future reference.",
    icon: <VideocamIcon fontSize="large" color="primary" />,
    color: "#e3f2fd"
  },
  {
    title: "Audio Transcription",
    description: "Automatically convert speech to text with AI-powered transcription.",
    icon: <RecordVoiceOverIcon fontSize="large" color="primary" />,
    color: "#e8f5e9"
  },
  {
    title: "Call History",
    description: "Access your complete call history with search and filtering options.",
    icon: <ListAltIcon fontSize="large" color="primary" />,
    color: "#fff8e1"
  },
  {
    title: "Contact Management",
    description: "Organize your contacts and quickly start meetings with them.",
    icon: <PeopleIcon fontSize="large" color="primary" />,
    color: "#f3e5f5"
  },
  {
    title: "Meeting Analytics",
    description: "Get insights into meeting duration, participation, and engagement.",
    icon: <SpeedIcon fontSize="large" color="primary" />,
    color: "#e0f7fa"
  },
  {
    title: "Secure Storage",
    description: "All recordings and transcriptions are securely stored and encrypted.",
    icon: <SecurityIcon fontSize="large" color="primary" />,
    color: "#fce4ec"
  }
];

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <div className="bg-gray-50 min-h-screen">
    <Header />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(120deg, #1976d2 0%, #2196f3 100%)',
          color: 'white',
          pt: 8,
          pb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                Call Manager
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Record, transcribe and manage your video meetings in one place.
                Take control of your communications with our powerful call management tools.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<VideocamIcon />}
                  component={Link}
                  to="/meeting"
                  sx={{ 
                    backgroundColor: 'white', 
                    color: '#1976d2',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  Start a Meeting
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  component={Link}
                  to="/calllist"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  View Call History
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <img 
                src='https://www.freepnglogos.com/uploads/zoom-logo-png/zoom-png-logo-download-transparent-20.png' 
                alt='Video Conference Illustration' 
                style={{ 
                  maxWidth: '80%',
                  maxHeight: '300px',
                  filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.2))'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Key Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" fontWeight="bold" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Everything you need to manage your meetings efficiently
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ p: 3, backgroundColor: feature.color }}>
                  {feature.icon}
                </Box>
                <Box sx={{ p: 3, flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="medium">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* How It Works Section */}
      <Box sx={{ backgroundColor: '#f5f9ff', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" fontWeight="bold" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Simple steps to get started with Call Manager
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  height: '100%',
                  backgroundColor: 'white'
                }}
              >
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: '#2196f3', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    fontSize: 24,
                    fontWeight: 'bold'
                  }}
                >
                  1
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Create a Meeting
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start a new meeting or schedule one for later with your team members.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3} textAlign="center">
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  height: '100%',
                  backgroundColor: 'white'
                }}
              >
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: '#2196f3', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    fontSize: 24,
                    fontWeight: 'bold'
                  }}
                >
                  2
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Record Your Call
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click the record button anytime during your meeting to capture video and audio.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3} textAlign="center">
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  height: '100%',
                  backgroundColor: 'white'
                }}
              >
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: '#2196f3', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    fontSize: 24,
                    fontWeight: 'bold'
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Access Recordings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visit your call history to view, download, or share your recordings and transcripts.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Join thousands of users who are improving their meeting productivity with Call Manager.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          component={Link}
          to="/meeting"
          startIcon={<VideocamIcon />}
          sx={{ 
            borderRadius: 2,
            py: 1.5,
            px: 4,
            fontSize: '1.1rem'
          }}
        >
          Start Your First Meeting
        </Button>
      </Container>
      
      {/* Footer */}
      <Box sx={{ bgcolor: '#1976d2', color: 'white', py: 3, mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Call Manager
              </Typography>
              <Typography variant="body2">
                A powerful tool for recording, transcribing, and managing your video meetings.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2" component={Link} to="/meeting" sx={{ color: 'white', display: 'block', mb: 1, textDecoration: 'none' }}>
                Start Meeting
              </Typography>
              <Typography variant="body2" component={Link} to="/calllist" sx={{ color: 'white', display: 'block', mb: 1, textDecoration: 'none' }}>
                Call History
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">
                support@callmanager.com
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" align="center" sx={{ pt: 2 }}>
            © {new Date().getFullYear()} Call Manager. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </div>
  );
}

export default Home;