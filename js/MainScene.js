import Player from "./Player.js";
import Resource from "./Resource.js";
import Enemy from "./Enemy.js";

/**
 * Depth Guide 
 * -----------
 * Background layers (2)    -- The layout of the map and collision detection for boundaries
 * Foreground layer  (2)    -- Layer of tiles that the player can collide with
 * Overhead Layer    (4)    -- Layer that the player can walk behind 
 * - Player Depth    (3)    -- All 3 following layers depth(3) so player can interact with them
 * - Enemies         (3)
 * - Object Layer    (3)
 * Dropped Items    (2.5)
 * 
 */

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.enemies = [];
    this.cam = null;
    this.circleCollider = null;
  }

  preload() {
    Player.preload(this);
    Enemy.preload(this);
    Resource.preload(this);
    // pre load files for the tile map
    this.load.image('Mapper', 'assets/images/alltiles.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map.json');
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    this.map = map;
    // add tileset
    // create layer for background
    const tileset = map.addTilesetImage('Mapper', 'Mapper', 16, 16, 0, 0);
    const layer1 = map.createStaticLayer('background', tileset, 0, 0);
    layer1.setDepth(2);
    // again for the images that are part of the background
    // but in their own layer
    const layer2 = map.createStaticLayer('onbackground', tileset, 0, 0);
    layer2.setDepth(2);
    // create layer foreground { contains collision/boundary objects }
    const layer3 = map.createStaticLayer('foreground', tileset, 0, 0);
    layer3.setDepth(2);
    // create overhead { layer that player can walk behind }
    const layer4 = map.createStaticLayer('overhead', tileset, 0, 0);
    layer4.setDepth(4);
    // set collision to true on tiles with 'collides' property
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);
    layer3.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer3);
    //layer4.setCollisionByProperty({collides: true});
    //this.matter.world.convertTilemapLayer(layer4);
    this.map.getObjectLayer('resources').objects.forEach(resource => {
      // console.log(resource);
      new Resource({ scene: this, resource })
    });
    this.map.getObjectLayer('Enemies').objects.forEach(enemy => this.enemies.push(new Enemy({scene:this,enemy})));
    this.player = new Player({ scene: this, x: 180, y: 620, texture: 'female', frame: 'townsfolk_f_idle_1' });
    this.player.setDepth(3);
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.cam = this.cameras.main;


    // camera controls
    this.cam.startFollow(this.player);
    this.cam.setLerp(0.1,0.1);
    this.cam.setZoom(4);
    this.cam.setBounds(0,0, window.innerWidth, window.innerHeight);
    this.scene.launch('InventoryScene', { mainScene:this });
    
  }



  update() {
    this.enemies.forEach(enemy => enemy.update());
    this.player.update();
  }
}