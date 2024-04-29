import { Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import './App.css';
import GameCanvas from './components/GameCanvas';
import InfoPanel from './components/InfoPanel';
import Leaderboard from './components/Leaderboard';

const Item = styled(Paper)(() => ({
  backgroundColor: 'transparent',
  padding: '1rem',
  textAlign: 'left',
  height: '100%',
  alignItems: 'center',
  display: 'flex',
}));

function App() {
  const [sound, setSound] = useState('teams');
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const handleUnload = () => {
      const endTime = Date.now();
      const timeSpent = endTime - startTime;
      const totalTimeSpent = parseInt(localStorage.getItem('totalTime')) || 0;
      const totalTime = totalTimeSpent + timeSpent;
      localStorage.setItem('totalTime', totalTime.toString());
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 6rem)',
        padding: { md: '2rem 1rem', xs: '1.5rem 0.5rem' },
      }}
    >
      <Grid container spacing={4} sx={{ maxWidth: '900px' }}>
        <Grid item xs={12} md={6}>
          <Item>
            <InfoPanel
              sound={sound}
              setSound={setSound}
              board={board}
              setBoard={setBoard}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item sx={{ justifyContent: 'center' }}>
            <GameCanvas
              sound={sound}
              score={score}
              setScore={setScore}
              board={board}
              setBoard={setBoard}
            />
          </Item>
        </Grid>
        {board ? (
          <Grid item xs={12} md={12}>
            <Item>
              <Leaderboard score={score} />
            </Item>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}

export default App;
