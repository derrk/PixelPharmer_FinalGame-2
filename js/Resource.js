import MatterEntity from "./MatterEntity.js";

export default class Resource extends MatterEntity {
  
  static preload(scene){
    scene.load.atlas('resources','assets/images/resources.png','assets/images/resources_atlas.json');
    scene.load.audio('tree','assets/audio/tree.mp3');
    scene.load.audio('rock','assets/audio/rock.mp3');
    scene.load.audio('bush','assets/audio/bush.mp3');
    scene.load.audio('pickup','assets/audio/pickup.mp3');
  }

  constructor(data){
    //let resource = null;
    let {scene,resource} = data;
    //console.log(resource);
    let drops = JSON.parse(resource.properties.find(p=>p.name=='drops').value);
    let depth = resource.properties.find(p=>p.name=='depth').value;
    // load in resource off of tiled map json by type
    super({scene,x:resource.x,y:resource.y,texture:'resources',frame:resource.type,drops,depth,health:5,name:resource.type});
    let yOrigin = resource.properties.find(p=>p.name == 'yOrigin').value;
    this.y = this.y + this.height * (yOrigin - 0.5);
    const {Bodies} = Phaser.Physics.Matter.Matter;
    var circleCollider = Bodies.circle(this.x,this.y,12,{isSensor:false,label:'collider'});
    // set collider around resource
    this.setExistingBody(circleCollider);
     // set physics to gravity to the ground
    this.setStatic(true);
    //this.setDepth(2.5);
    this.setOrigin(0.5,yOrigin);
  }
}