import { Game } from '../scenes/Game';
import { GameOver } from '../scenes/GameOver';

const WIDTH_GAME = 480;
const HEIGHT_GAME = 640;

export const isDev = process.env.NODE_ENV === 'development';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH_GAME,
  height: HEIGHT_GAME,
  pixelArt: true,
  scene: [Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: isDev,
    },
  },
};

const game = new Phaser.Game(config);
