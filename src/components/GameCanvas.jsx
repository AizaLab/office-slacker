/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import backgroundImg from '../assets/bg.svg';
import bladeImg from '../assets/blade.svg';
import message from '../assets/notification2.svg';
import characterImg from '../assets/slacker2.svg';
import splashImg from '../assets/splash2.svg';
import { playSound } from '../utils/makeSound.js';

const GameCanvas = ({ sound, score, setScore, setBoard }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [characterPosition, setCharacterPosition] = useState(0);
  const [trashPosition] = useState(0);
  const [obstaclePosition, setObstaclePosition] = useState(330);
  const [endMessage, setEndMessage] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [difficulty, setDifficulty] = useState(8);
  const [splash, setSplash] = useState(false);
  const [, setSlackingNumbers] = useState(0);
  const [, setPersonalHigh] = useState(0);
  const [, setTallyHours] = useState(() => {
    const storedTime = localStorage.getItem('tallyHours');
    return storedTime ? parseFloat(storedTime) : 0;
  });
  const [, setNotification] = useState(() => {
    const storedNotifications = localStorage.getItem('fakeNotification');
    return storedNotifications ? parseInt(storedNotifications, 10) : 0;
  });

  const gameAreaRef = useRef(null);

  useEffect(() => {
    let gameLoop;

    if (isRunning) {
      gameLoop = setInterval(moveObstacle, difficulty);

      return () => {
        clearInterval(gameLoop);
      };
    } else {
      clearInterval(gameLoop);
    }
  }, [isRunning, difficulty]);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const timePassed = currentTime - startTime;

        setElapsedTime(timePassed);

        const score = Math.floor((timePassed / 10) * 2);
        setScore(score);

        if (score > 30000) {
          setDifficulty(6);
        } else if (score >= 15000) {
          setDifficulty(6.5);
        } else if (score >= 10000) {
          setDifficulty(7);
        } else if (score >= 5000) {
          setDifficulty(7.5);
        } else {
          setDifficulty(8);
        }
      }, 10);

      return () => clearInterval(timer);
    }
  }, [isRunning]);

  useEffect(() => {
    if (obstaclePosition <= 0) {
      setObstaclePosition(330);
    }

    if (obstaclePosition < 80) {
      const characterHeight = gameAreaRef.current.clientHeight;
      const characterBottomY = characterPosition + characterHeight;

      if (characterBottomY < 301) {
        setIsRunning(false);
        setEndMessage(true);
        setCharacterPosition(0);
        setObstaclePosition(330);
        setTallyHours((prevTallyHours) => {
          const newTallyHours = prevTallyHours + elapsedTime;
          localStorage.setItem('tallyHours', newTallyHours.toFixed());
          return newTallyHours;
        });

        updatePersonalHighScore(score);
      }
    }
  }, [obstaclePosition, characterPosition, elapsedTime, score, gameAreaRef]);

  const startGame = () => {
    setIsRunning(true);
    setObstaclePosition(330);
    setScore(0);
    setElapsedTime(0);
    setDifficulty(8);
    setEndMessage(false);
    setBoard(false);
    setSlackingNumbers((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem('slackingNumbers', newCount.toString());
      return newCount;
    });
  };

  const jump = useCallback(() => {
    if (!isJumping) {
      playSound(sound);
      setIsJumping(true);
      setNotification((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem('fakeNotification', newCount.toString());
        return newCount;
      });
      let peakReached = false;

      const jumpInterval = setInterval(() => {
        setCharacterPosition((prevPosition) => {
          if (!peakReached) {
            if (prevPosition + 6 >= 180) {
              peakReached = true;
              return 180;
            }
            const newHeight = prevPosition + 6;
            return newHeight;
          } else {
            if (prevPosition - 6 <= 0) {
              clearInterval(jumpInterval);
              setIsJumping(false);
              return 0;
            }
            const newHeight = prevPosition - 6;
            return newHeight;
          }
        });
      }, 10);
    }
  }, [isJumping, setIsJumping, setCharacterPosition, sound]);

  const moveObstacle = () => {
    setObstaclePosition((prevPosition) => {
      if (prevPosition <= 25) {
        setSplash(true);
        setTimeout(() => {
          setSplash(false);
        }, 150);

        const positions = [415, 375, 330, 300, 270, 240, 230];
        const randomIndex = Math.floor(Math.random() * positions.length);
        return positions[randomIndex];
      }
      return prevPosition - 2;
    });
  };

  const updatePersonalHighScore = (score) => {
    const storedHighScore = localStorage.getItem('phigh')
      ? parseFloat(localStorage.getItem('phigh'))
      : 0;

    if (score > storedHighScore) {
      // eslint-disable-next-line react/prop-types
      localStorage.setItem('phigh', score.toFixed());
      setPersonalHigh(score);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        (event.code === 'Space' || event.code === 'ArrowUp') &&
        !isJumping &&
        isRunning
      ) {
        event.preventDefault();
        jump();
      }
    };

    const handleClickOrTouchStart = (event) => {
      if (
        !isJumping &&
        gameAreaRef.current &&
        gameAreaRef.current.contains(event.target) &&
        isRunning
      ) {
        jump();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    gameAreaRef.current.addEventListener('click', handleClickOrTouchStart);
    gameAreaRef.current.addEventListener('touchstart', handleClickOrTouchStart);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (gameAreaRef.current) {
        gameAreaRef.current.removeEventListener(
          'click',
          handleClickOrTouchStart
        );
        gameAreaRef.current.removeEventListener(
          'touchstart',
          handleClickOrTouchStart
        );
      }
    };
  }, [isJumping, jump, gameAreaRef, isRunning]);

  useEffect(() => {
    const savedCount = localStorage.getItem('slackingNumbers');
    if (savedCount) {
      setSlackingNumbers(parseInt(savedCount, 10));
    }
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          ref={gameAreaRef}
          sx={{
            width: '360px',
            height: '300px',
            borderBottom: '3px solid #222',
            position: 'relative',
            backgroundImage: `url('${backgroundImg}')`,
          }}
        >
          <Box
            src={bladeImg}
            component='img'
            sx={{
              height: '29px',
              position: 'absolute',
              bottom: `${trashPosition}px`,
              '@keyframes rotating': {
                from: {
                  transform: 'rotate(0deg)',
                },
                to: {
                  transform: 'rotate(360deg)',
                },
              },
              animation: isRunning ? 'rotating 1s linear infinite' : null,
            }}
          />
          <Box
            src={splashImg}
            component='img'
            sx={{
              height: '29px',
              position: 'absolute',
              bottom: `${trashPosition + 8}px`,
              display: isRunning && splash ? 'block' : 'none',
              left: '16px',
              '@keyframes move': {
                from: {
                  transform: 'translateY(0px)',
                },
                to: {
                  transform: 'translateY(-12px)',
                },
              },
              animation: isRunning && splash ? 'move 0.5s linear' : null,
            }}
          />
          <Box
            src={characterImg}
            component='img'
            sx={{
              height: '34px',
              position: 'absolute',
              left: '50px',
              bottom: `${characterPosition}px`,
            }}
          />
          <Box
            src={message}
            component='img'
            sx={{
              width: '32px',
              position: 'absolute',
              bottom: '0px',
              opacity: 1,
              left: `${obstaclePosition}px`,
            }}
          />
          {!isRunning && endMessage ? (
            <>
              <Typography
                sx={{
                  color: '#fff',
                  fontFamily: 'Courier',
                  textAlign: 'center',
                  maxWidth: '300px',
                  margin: 'auto',
                  paddingTop: '2.75rem',
                }}
              >
                You got caught. You may go back to work...
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  fontFamily: 'Courier',
                  textAlign: 'center',
                  margin: '0.25rem',
                }}
              >
                - or -
              </Typography>
            </>
          ) : null}
          {!isRunning && (
            <Button
              sx={{
                fontWeight: '400',
                fontFamily: 'Courier',
                color: '#40C8CB',
                fontSize: '1rem',
                border: '1px solid #40c8cb',
                minWidth: '84px',
                padding: '0.6rem',
                marginTop: '2rem',
                position: 'absolute',
                lineHeight: 1.125,
                textTransform: 'initial',
                left: '50%',
                top: '40.5%',
                transform: 'translate(-50%, -50%)',
                '&:hover': {
                  border: '1px solid #40c8cb',
                  opacity: 1,
                },
                borderRadius: '0px',
              }}
              onClick={startGame}
            >
              {!endMessage ? 'Start Slacking' : 'Keep Slacking'}
            </Button>
          )}
        </Box>
        <Typography
          sx={{
            color: '#fff',
            fontFamily: 'Courier',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          {score}
        </Typography>
      </Box>
    </>
  );
};

export default GameCanvas;
