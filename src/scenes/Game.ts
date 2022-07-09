import background from '../assets/images/bg_layer1.png';
import platform from '../assets/images/ground_grass.png';
import bunnyStand from '../assets/images/bunny1_stand.png';

enum ImageKeys {
  bg = 'background',
  platform = 'platform',
  bunnyStand = 'bunnyStand',
}

export class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  preload() {
    this.load.image(ImageKeys.bg, background);
    this.load.image(ImageKeys.platform, platform);
    this.load.image(ImageKeys.bunnyStand, bunnyStand);
  }

  create() {
    this.add.image(240, 320, ImageKeys.bg);
    this.physics.add.sprite(240, 320, ImageKeys.bunnyStand).setScale(0.5);

    const platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      const platform = platforms.create(x, y, ImageKeys.platform);
      platform.scale = 0.5;

      const body = platform.body;
      body.updateFromGameObject();
    }
  }
}
