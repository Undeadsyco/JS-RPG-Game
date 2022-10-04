import { v4 } from 'uuid';

export default class PlayerModel {
  constructor(spwanLocations) {
    this.id = `player-${v4()}`;
    this.health = 10;
    this.maxhealth = 10;
    this.gold = 0;
    this.spwanLocations = spwanLocations;

    const location = this.spwanLocations[Math.floor(Math.random() * this.spwanLocations.length)];
    [this.x, this.y] = location;
  }

  updateGold(gold) {
    this.gold += gold;
  }

  updateHealth(health) {
    this.health += health;
    if (this.health > 10) this.health = 10;
  }

  respawn() {
    this.health = this.maxhealth;

    const location = this.spwanLocations[Math.floor(Math.random() * this.spwanLocations.length)];
    this.x = location[0] * 2;
    this.y = location[1] * 2;
  }
}
