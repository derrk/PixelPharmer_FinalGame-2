
import MatterEntity from "./MatterEntity.js";
import TitleScene from "./TitleScene.js";
import Inventory from "./Inventory.js";

export default class Player extends MatterEntity {
  constructor(data){
    let {scene,x,y,texture,frame} = data;
    // create player with 10 health
    super({...data,health:15,drops:[],name:'player'});
    this.touching = [];
    // create player inventory
    this.inventory = new Inventory();
    //Weapon
    this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0,'items', 162);
    this.spriteWeapon.setScale(0.7);
    this.spriteWeapon.setOrigin(0.25,0.75);
    this.spriteWeapon.setDepth(2.5);
    this.scene.add.existing(this.spriteWeapon);
  // create player collisions
    const {Body,Bodies} = Phaser.Physics.Matter.Matter;
    // players 'hit box'
    var playerCollider = Bodies.circle(this.x,this.y,8,{isSensor:false,label:'playerCollider'});
    // area that pickaxe will collide with objects
    var playerSensor = Bodies.circle(this.x,this.y,16, {isSensor:true, label:'playerSensor'});
    const compoundBody = Body.create({
      parts:[playerCollider,playerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    this.CreateMiningCollisions(playerSensor);
    this.CreatePickupCollisions(playerCollider);
    this.scene.input.on('pointermove',pointer => {
       if(!this.dead) this.setFlipX(pointer.worldX < this.x)});
  }
  // preload female assets
  static preload(scene){
    scene.load.atlas('female','assets/images/female.png','assets/images/female_atlas.json');
    scene.load.animation('female_anim','assets/images/female_anim.json');
    scene.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
    scene.load.audio('player','assets/audio/player.mp3');
  }
// create death animation
  onDeath = () => {
    // stop movement
    this.anims.stop();
    // erase items stored in array
    this.setTexture('items',0);
    this.setOrigin(0.5);
    // destroy player weapon
    this.spriteWeapon.destroy();
    // on death start the title scene
    //this.scene.startScene(TitleScene);
    
  }

  update(){
    if(this.dead) return;

    if(this.inventory.selectedItem){
      this.spriteWeapon.setTexture('items', this.inventory.getItemFrame(this.inventory.selectedItem));
      this.spriteWeapon.setVisible(true);
    }else {
      this.spriteWeapon.setVisible(false);
    }

    const speed = 2.5;
    let playerVelocity = new Phaser.Math.Vector2();
    if(this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
    }
    if(this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }
    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x,playerVelocity.y);
    // if moving play the movement animation
    if(Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play('female_walk',true);
    }else { // else play idle bouncing animation
      this.anims.play('female_idle',true);
    }
    this.spriteWeapon.setPosition(this.x,this.y);
    this.weaponRotate();
  }
// set movement for tool in hand
  weaponRotate(){
    let pointer = this.scene.input.activePointer;
    if(pointer.isDown){
      this.weaponRotation += 6;
    }else{
      this.weaponRotation = 0;
    }
    // when angle is reached call hit function so resource
    // takes damage from the pickaxe swings
    if(this.weaponRotation > 100) {
      this.whackStuff();
      this.weaponRotation = 0;
    }
// if pointer is on left side flip its direction
// if on right side flip back to right side
    if(this.flipX){
      this.spriteWeapon.setAngle(-this.weaponRotation - 90);
    }else{
      this.spriteWeapon.setAngle(this.weaponRotation);
    }
  }
// creates collision with objects and player weapon
  CreateMiningCollisions(playerSensor){
    this.scene.matterCollision.addOnCollideStart({
      objectA:[playerSensor],
      callback: other => {
        if(other.bodyB.isSensor) return;
        this.touching.push(other.gameObjectB);
        console.log(this.touching.length,other.gameObjectB.name);
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA:[playerSensor],
      callback: other => {
        this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
        console.log(this.touching.length);
      },
      context: this.scene,
    })
  }
// create collision for picking up items that drop from resources
  CreatePickupCollisions(playerCollider){
    this.scene.matterCollision.addOnCollideStart({
      objectA:[playerCollider],
      callback: other => {
        if(other.gameObjectB && other.gameObjectB.pickup)
        if(other.gameObjectB.pickup()) this.inventory.addItem({name:other.gameObjectB.name,quantity:1});
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideActive({
      objectA:[playerCollider],
      callback: other => {
         if(other.gameObjectB && other.gameObjectB.pickup)
        if(other.gameObjectB.pickup()) this.inventory.addItem({name:other.gameObjectB.name,quantity:1});
      },
      context: this.scene,
    })

  }

  whackStuff(){
    this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
    this.touching.forEach(gameobject =>{
      gameobject.hit();
      if(gameobject.dead) gameobject.destroy();
    })
  }
}