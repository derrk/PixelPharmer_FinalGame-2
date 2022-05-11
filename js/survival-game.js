
import MainScene from "./MainScene.js";
import TitleScene from "./TitleScene.js";
import InventoryScene from "./InventoryScene.js";

const WWIDTH = window.innerWidth;
const WHEIGHT = window.innerHeight;
const ASPECT = WWIDTH / WHEIGHT;
const BASE = 450;
const VERTICAL = ASPECT < 1;
const GAME_WIDTH = VERTICAL ? BASE : BASE * ASPECT;
const GAME_HEIGHT = VERTICAL ? BASE / ASPECT : BASE;

const config = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#999999',
  type: Phaser.AUTO,
  parent: 'survival-game',
  scene:[
    TitleScene,
    MainScene,
    InventoryScene],
  scale: {
    zoom:2,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity:{y:0},
    }
  },
  plugins: {
    scene:[
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision'
      }
    ]
  }
}

new Phaser.Game(config);