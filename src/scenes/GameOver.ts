export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(): void {
    console.log('GameOver init');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    this.add
      .text(width * 0.5, height * 0.5, 'Game Over', {
        fontSize: '64px',
      })
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Game');
    });
  }

  update(): void {
    console.log('GameOver update');
  }
}
