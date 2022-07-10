import carrot from '../assets/images/carrot.png';

enum ImageKeys {
  carrot = 'carrot',
}

export class Carrot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }
}
