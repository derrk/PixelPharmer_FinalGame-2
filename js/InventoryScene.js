import items from "./Items.js";

export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super('InventoryScene');
        
        this.rows = 1;
        this.uiScale = 1.5;
        this.gridSpacing = 4;
        this.margin = 8;
        this._tileSize = 32;
        this.inventorySlot = [];
        this.inventorySlots = [];
    }

    init(data) {
        let { mainScene } = data;
        this.mainScene = mainScene;
        this.inventory = mainScene.player.inventory;
        this.maxColumns = this.inventory.maxColumns;
        this.maxRows = this.inventory.maxRows;
        //this.inventory.subscribe(() => this.refresh());
    }

    get tileSize() {
        return this._tileSize * this.uiScale;
    }

    destroyInventorySlot(inventorySlot){
        if(inventorySlot.item) inventorySlot.item.destroy();
        if(inventorySlot.quantityText) inventorySlot.quantityText.destroy();
        inventorySlot.destroy();
    }

    refresh() {
        
        this.inventorySlots.forEach( s => this.destroyInventorySlot(s));
        //this.inventorySlots = [];
        // set up 8 column inventory
        for (let index = 0; index < this.maxColumns * this.rows; index++) {
            let x = this.margin + this.tileSize / 2 + (index % this.maxColumns) * (this.tileSize + this.gridSpacing);
            let y = this.margin + this.tileSize / 2 + Math.floor(index / this.maxColumns) * (this.tileSize + this.gridSpacing);
            let inventorySlot = this.add.sprite(x,y,'items', 11);
            inventorySlot.setScale(this.uiScale);
            inventorySlot.depth = -1;
            
            inventorySlot.setInteractive();
            inventorySlot.on("pointerover", pointer => {
                console.log(`pointerover: ${index}`);
                this.hoverIndex = index;
            });

            let item = this.inventory.getItem(index);
            if(item){
                // assign name to picked up item inventory
                inventorySlot.item = this.add.sprite(inventorySlot.x, inventorySlot.y - this.tileSize / 12, 'items', items[item.name.frame]);
                inventorySlot.quantityText = this.add.text(inventorySlot.x, inventorySlot.y + this.tileSize / 6, item.quantity,{ 
                    font: '11px',
                    fill: '#111'
                    // set to center of inventory slot 
                }).setOrigin(0.5,0);
                // dragging code for inventory
                inventorySlot.item.setInteractive();
                inventorySlot.item.setDepth(4);
                this.input.setDraggable(inventorySlot.item);
            }
            this.inventorySlots.push(inventorySlot);
        }
        this.updateSelected();
    }

    updateSelected(){
        for (let index = 0; index < this.maxColumns; index++) {
            this.inventorySlots[index].tint = this.inventory.selected === index ? 0xffff00 : 0xffffff;
            
        }
    }

    create() {

        // selection
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.inventory.selected = Math.max(0, this.inventory.selected + (deltaY > 0 ? 1 : -1)) % this.maxColumns;
            this.updateSelected();
        });


        this.input.keyboard.on("keydown-I", () => {
            this.rows = this.rows === 1 ? this.maxRows : 1;
            this.refresh();
        });

        // drag and drop
        this.input.setTopOnly(false);
        this.input.on("dragstart", () =>{
            console.log("dragstart");
            this.startIndex = this.hoverIndex;
            //this.inventorySlots[this.startIndex].quantityText.destroy();
        })
       this.input.on('drag', (pointer,gameObject, dragX, dragY) => {
           gameObject.x = dragX;
           gameObject.y = dragY;
       });
       this.input.on('dragend', () =>{
           console.log('dragend');
           this.inventory.moveItem(this.startIndex, this.hoverIndex);
           this.refresh();
       }); 
       this.refresh();
    }
}