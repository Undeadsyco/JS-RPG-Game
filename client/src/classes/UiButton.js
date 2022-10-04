import * as Phaser from 'phaser';

export default class UiButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, hoverKey, text, targetCallback) {
    super(scene, x, y);

    this.scene = scene; // the scene this container will be added to
    this.x = x; // x position of the container
    this.y = y; // y position of the container
    this.key = key; // the backgroung image of button
    this.hoverKey = hoverKey; // background when hovered
    this.text = text; // displayed text on button
    this.targetCallback = targetCallback; // callback function when button is clicked

    this.createButton(); // create ui button
    this.scene.add.existing(this); // add container to scene
  }

  createButton() {
    // create play button
    this.button = this.scene.add.image(0, 0, 'button1');
    // make button interactive
    this.button.setInteractive();
    // scale button
    this.button.setScale(1.4);

    // create button text
    this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '26px', fill: '#fff' });
    // center text within button
    Phaser.Display.Align.In.Center(this.buttonText, this.button);

    // add objects to container
    this.add(this.button);
    this.add(this.buttonText);

    // listen for events
    this.button.on('pointerdown', () => {
      this.targetCallback();
    });

    this.button.on('pointerover', () => {
      this.button.setTexture(this.hoverKey);
    });

    this.button.on('pointerout', () => {
      this.button.setTexture(this.key);
    });
  }
}
