import background from '../assets/images/bg_layer1.png';
import platform from '../assets/images/ground_grass.png';
import bunnyStand from '../assets/images/bunny1_stand.png';
import { isDev } from '../js';

enum ImageKeys {
  bg = 'background',
  platform = 'platform',
  bunnyStand = 'bunnyStand',
}

export class Game extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super('Game');
  }
  preload() {
    this.load.image(ImageKeys.bg, background);
    this.load.image(ImageKeys.platform, platform);
    this.load.image(ImageKeys.bunnyStand, bunnyStand);
  }

  create() {
    this.add.image(240, 320, ImageKeys.bg).setScrollFactor(1, 0);
    this.player = this.physics.add.sprite(240, 320, ImageKeys.bunnyStand).setScale(0.5);
    this.platforms = this.physics.add.staticGroup();

    this.physics.add.collider(this.player, this.platforms);

    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      const platform = this.platforms.create(x, y, ImageKeys.platform);
      platform.scale = 0.5;

      const body = platform.body;
      body.updateFromGameObject();
    }

    this.cameras.main.startFollow(this.player);
  }

  update() {
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) this.player.setVelocityY(isDev ? -1000 : -300);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.platforms.children.iterate((child: any) => {
      const platform: Phaser.Physics.Arcade.Sprite = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
      }
    });
  }
}
