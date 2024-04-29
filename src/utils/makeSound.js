import * as Tone from 'tone';
import discordSound from '../assets/sound/discord.mp3';
import googleChatSound from '../assets/sound/googleChat.mp3';
import slackSound from '../assets/sound/slack.mp3';
import teamsSound from '../assets/sound/teams.mp3';
import zoomSound from '../assets/sound/zoom.mp3';

const soundMap = {
  teams: teamsSound,
  googleChat: googleChatSound,
  discord: discordSound,
  slack: slackSound,
  zoom: zoomSound
};

export const playSound = (soundName) => {
    const soundUrl = soundMap[soundName];
    if (!soundUrl) {
      console.error("Sound not found:", soundName);
      return;
    }
  
    const player = new Tone.Player({
      url: soundUrl,
      autostart: false,
    }).toDestination();
  
    Tone.loaded().then(() => {
      player.stop(); 
      player.start();
    });
  };
  