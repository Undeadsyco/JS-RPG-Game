export default class GameMap {
  constructor(scene, key, tileSetName, bgLayerName, blocledLayerName) {
    this.scene = scene; // scene this map belongs to
    this.key = key; // tiled JSON file key name
    this.tileSetName = tileSetName; // tiled tileset image key name
    this.bgLayerName = bgLayerName; // name of layer created in tiled for background
    // name of the layer created in tiled for blocked areas
    this.blockedLayerName = blocledLayerName;
    this.createMap();
  }

  createMap() {
    // create tilemap
    this.tiledMap = this.scene.make.tilemap({ key: this.key });
    // add tileset image to map
    this.tiles = this.tiledMap.addTilesetImage(this.tileSetName, this.tileSetName, 32, 32, 1, 2);
    // create background layer
    this.backgroundLayer = this.tiledMap.createLayer(
      this.bgLayerName,
      this.tiles,
      0,
      0,
    ).setScale(2);
    // create blocked layer
    this.blockedLayer = this.tiledMap.createLayer(
      this.blockedLayerName,
      this.tiles,
      0,
      0,
    ).setScale(2);
    this.blockedLayer.setCollisionByExclusion([-1]);

    // update world bounds
    this.scene.physics.world.bounds.width = this.tiledMap.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.tiledMap.heightInPixels * 2;

    // limit camera to map bounds
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.tiledMap.widthInPixels * 2,
      this.tiledMap.heightInPixels * 2,
    );
  }
}
