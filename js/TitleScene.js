export default class TitleScene extends Phaser.Scene {
    constructor(){
        super("TitleScene");
        this.titleBG = null;
        this.img = null;
        
        

    }
    preload(){
        // Load the background file
        this.load.image('titleBG', './assets/images/Title.png');
        this.load.image('start', './assets/images/playBtn.png');
        this.load.image('titleText', './assets/images/loadingimage.png');
    }
    create(){

        let titleBG= this.add.image(0,0, 'titleBG');
        titleBG.setOrigin(0,0).setScale(.5);
        let startBtn= this.add.image(366,225, 'start');
        startBtn.setOrigin(0,0).setScale(5).setInteractive();
        startBtn.on('pointerdown', ()=>{
            this.scene.launch('MainScene');
            // this.scene.launch('ControlScene');
        });

        let titleFlash = this.add.image(400, 100, 'titleText');
        titleFlash.setScale(.25);
       
    }

}
