import { Game } from '../scenes/Game';

const WIDTH_GAME = 480;
const HEIGHT_GAME = 640;

const isDev = process.env.NODE_ENV === 'development';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WIDTH_GAME,
  height: HEIGHT_GAME,
  pixelArt: true,
  scene: [Game],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: isDev,
    },
  },
};

const game = new Phaser.Game(config);
