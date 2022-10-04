import * as Phaser from 'phaser';

export default class Chest extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, coins, id) {
    super(scene, x, y, key, frame);
    this.scene = scene; // refrence to the scene object eill be added to
    this.coins = coins; // amount of coins held by Chest
    this.id = id;

    // enable physics
    this.scene.physics.world.enable(this);
    // add player to scene
    this.scene.add.existing(this);
    // scale the chest game object
    this.setScale(2);
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  }

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }
}
