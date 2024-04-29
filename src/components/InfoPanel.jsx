/* eslint-disable react/prop-types */
import { Box, Link, Stack, Typography } from '@mui/material';
import discord from '../assets/discord.svg';
import googleChat from '../assets/googleChat.svg';
import slack from '../assets/slack.svg';
import teams from '../assets/teams.svg';
import zoom from '../assets/zoom.svg';
import { playSound } from '../utils/makeSound.js';

const InfoPanel = ({ sound, setSound, board, setBoard }) => {
  const sounds = [
    { name: 'teams', src: teams },
    { name: 'googleChat', src: googleChat },
    { name: 'discord', src: discord },
    { name: 'slack', src: slack, extraStyles: { width: '16px' } },
    { name: 'zoom', src: zoom },
  ];

  return (
    <Box>
      <Link
        href='/officeslacker'
        sx={{
          textDecoration: 'none',
          '&:hover > * ': { textDecoration: 'none' },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Courier',
            color: '#fff',
            fontSize: '1.85rem',
            fontWeight: '600',
            marginBottom: '1rem',
          }}
        >
          Office Slacker
        </Typography>
      </Link>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          gap: 3,
          marginBottom: '1.25rem',
        }}
      >
        <Typography
          sx={{ fontFamily: 'Courier', color: '#fff', minWidth: '60px' }}
        >
          Sound:
        </Typography>
        <Stack direction='row' sx={{ gap: 3 }}>
          {sounds.map((soundItem) => (
            <Box
              key={soundItem.name}
              component='img'
              src={soundItem.src}
              sx={{
                opacity: sound === soundItem.name ? 1 : 0.25,
                cursor: 'pointer',
                ...soundItem.extraStyles,
              }}
              onClick={() => {
                setSound(soundItem.name);
                playSound(soundItem.name);
              }}
            />
          ))}
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          gap: 3,
          marginBottom: '1.25rem',
        }}
      >
        <Typography
          sx={{ fontFamily: 'Courier', color: '#fff', minWidth: '60px' }}
        >
          Leaderboard:
        </Typography>
        <Stack direction='row' sx={{ gap: 2 }}>
          <Typography
            onClick={() => setBoard(false)}
            sx={{
              fontFamily: 'Courier',
              color: !board ? '#40C8CB' : '#333',
              cursor: 'pointer',
            }}
          >
            Hide
          </Typography>
          <Typography sx={{ fontFamily: 'Courier', color: '#40C8CB' }}>
            {!board ? '>' : '<'}
          </Typography>
          <Typography
            onClick={() => setBoard(true)}
            sx={{
              fontFamily: 'Courier',
              color: !board ? '#333' : '#40C8CB',
              cursor: 'pointer',
            }}
          >
            Show
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default InfoPanel;
