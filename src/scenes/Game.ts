import background from '../assets/images/bg_layer1.png';
import platform from '../assets/images/ground_grass.png';
import bunnyStand from '../assets/images/bunny1_stand.png';
import bunnyJump from '../assets/images/bunny1_jump.png';
import { isDev } from '../js';
import { Carrot } from '../models/Carrot';
import carrot from '../assets/images/carrot.png';
const audioJump = new URL('../assets/audio/jump.mp3', import.meta.url);

enum ImageKeys {
  bg = 'background',
  platform = 'platform',
  bunnyStand = 'bunnyStand',
  bunnyJump = 'bunnyJump',
  carrot = 'carrot',
}

enum AudioKeys {
  jump = 'jump',
}

export class Game extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private carrots!: Phaser.Physics.Arcade.Group;
  private carrotsCollected = 0;
  private carrotsCollectedText!: Phaser.GameObjects.Text;

  constructor() {
    super('Game');
  }

  init() {
    this.carrotsCollected = 0;
  }

  preload() {
    this.load.image(ImageKeys.bg, background);
    this.load.image(ImageKeys.platform, platform);
    this.load.image(ImageKeys.bunnyStand, bunnyStand);
    this.load.image(ImageKeys.carrot, carrot);
    this.load.image(ImageKeys.bunnyJump, bunnyJump);
    console.log(audioJump);
    this.load.audio(AudioKeys.jump, audioJump.href);
    this.cursors = this.input.keyboard.createCursorKeys();
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

    // set the horizontal dead zone to 1.5x game width
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.carrots = this.physics.add.group({
      classType: Carrot,
    });

    this.physics.add.collider(this.platforms, this.carrots);
    this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this);

    const style = { color: '#fff', fontSize: '40px' };
    this.carrotsCollectedText = this.add
      .text(240, 10, `Carrots: ${this.carrotsCollected}`, style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  update() {
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(isDev ? -1000 : -300);
      this.player.setTexture(ImageKeys.bunnyJump);
      this.sound.play(AudioKeys.jump);
    }

    const vy = this.player.body.velocity.y;

    if (vy > 0 && this.player.texture.key !== ImageKeys.bunnyStand) {
      // switch back to jump when falling
      this.player.setTexture(ImageKeys.bunnyStand);
    }

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-400);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(400);
    } else if (this.cursors.up.isDown && touchingDown) {
      // this.player.setVelocityY(-400);
    } else {
      // stop movement if not left or right
      this.player.setVelocityX(0);
    }

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.platforms.children.iterate((child: any) => {
      const platform: Phaser.Physics.Arcade.Sprite = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();

        this.addCarrotAbove(platform);
      }
    });

    this.horizontalWrap(this.player);
    const bottomPlatform = this.findBottomMostPlatform();
    // @ts-ignore
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start('GameOver');
    }
  }

  horizontalWrap(sprite: Phaser.Physics.Arcade.Sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }
  addCarrotAbove(sprite: Phaser.GameObjects.Sprite) {
    const y = sprite.y - sprite.displayHeight;
    const carrot = this.carrots.get(sprite.x, y, ImageKeys.carrot);

    carrot.setActive(true);
    carrot.setVisible(true);

    this.add.existing(carrot);

    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height);

    // make sure body is enabed in the physics world
    this.physics.world.enable(carrot);

    return carrot;
  }
  handleCollectCarrot(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    carrot: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    // hide from display
    this.carrots.killAndHide(carrot);

    // disable from physics world
    this.physics.world.disableBody(carrot.body);

    this.carrotsCollected += 1;
    this.carrotsCollectedText.text = `Carrots: ${this.carrotsCollected}`;
  }
  findBottomMostPlatform() {
    const platforms: Phaser.GameObjects.GameObject[] = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i];

      // discard any platforms that are above current
      // @ts-ignore
      if (platform.y < bottomPlatform.y) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }
}
