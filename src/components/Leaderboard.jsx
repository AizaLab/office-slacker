import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const convertTime = (totalTime) => {
  let timeInSeconds = Math.floor(totalTime / 1000);
  let seconds = timeInSeconds % 60;
  let minutes = Math.floor(timeInSeconds / 60) % 60;
  let hours = Math.floor(timeInSeconds / 3600) % 24;
  let days = Math.floor(timeInSeconds / 86400);

  let timeString = '';
  if (days > 0) {
    timeString += `${days}d `;
  }
  if (hours > 0 || days > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    timeString += `${minutes}m `;
  }
  timeString += `${seconds}s`;
  return timeString.trim().replace(/,\s*$/, '');
};

const Leaderboard = () => {
  const [localStats, setLocalStats] = useState({
    totalTimeSpent: 0,
    slackingNumbers: 0,
    fakeNotification: 0,
    personalHigh: 0,
  });

  useEffect(() => {
    const updatedTotalTimeSpent =
      parseInt(localStorage.getItem('tallyHours'), 10) || 0;
    const updatedSlackingNumbers =
      parseInt(localStorage.getItem('slackingNumbers'), 10) || 0;
    const updatedFakeNotification =
      parseInt(localStorage.getItem('fakeNotification'), 10) || 0;
    const updatedPersonalHigh =
      parseInt(localStorage.getItem('phigh'), 10) || 0;

    setLocalStats({
      totalTimeSpent: updatedTotalTimeSpent,
      slackingNumbers: updatedSlackingNumbers,
      fakeNotification: updatedFakeNotification,
      personalHigh: updatedPersonalHigh,
    });
  }, []);

  const { totalTimeSpent, slackingNumbers, fakeNotification, personalHigh } =
    localStats;

  return (
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Box sx={{ marginBottom: '4rem' }}>
          <Typography
            sx={{
              fontFamily: 'Courier',
              color: '#fff',
              fontSize: '1.85rem',
              fontWeight: '600',
              marginBottom: '1rem',
            }}
          >
            Stats
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Courier',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '400',
              opacity: 0.5,
            }}
          >
            You&apos;ve been slacking for {convertTime(totalTimeSpent)}, playing
            this game {slackingNumbers.toLocaleString()} times, generating &
            ignoring {fakeNotification.toLocaleString()} fake notifications, all
            while achieving your highest score of {personalHigh.toLocaleString()}.
          </Typography>
        </Box>
      </Box>
  );
};

export default Leaderboard;
