import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.scene = scene; // refrence to the scene object eill be added to

    // enable physics
    this.scene.physics.world.enable(this);
    // set player immovable if collided with
    this.setImmovable(true);
    // scale player
    this.setScale(2);
    // add player to scene
    this.scene.add.existing(this);
  }
}
