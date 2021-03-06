import items from "./Items.js";

export default class Inventory {
    constructor() {
        this.maxColumns = 8;
        this.maxRows = 3;
        this.selected = 0;
        this.observers = [];

        this.items = {
            0: {name: "pickaxe", quantity: 1},
            2: {name: "shovel", quantity: 1}
        }
        //this.addItem({name: "pickaxe", quantity: 2});
    }

    // subscribe(fn) {
    //     this.observers.push(fn);
    // }
    // unsubscribe(fn) {
    //     this.observers = this.observers.filter(subscriber => subscriber !== fn);
    // }

    // broadcast() {
    //     this.observers.forEach(subscriber => subscriber());
    // }


    addItem(item) {
        let existingKey =  Object.keys(this.items).find(key => this.items[key].name === item.name);
        console.log(`existing: ${existingKey}`);
        if (existingKey){
            this.items[existingKey].quantity += item.quantity;
        } else{
            // find the first available slot 
            for (let index = 0; index < this.maxColumns * this.maxRows; index++) {
                let existingItem = this.items[index];
                if(!existingItem){
                    this.items[index] = item;
                    break;
                }
            }
        }
        //this.broadcast();
    }

    getItem(index) {
        return this.items[index];
    }

    moveItem(start, end){
        console.log(`start ${start} end: ${end}`)
        if(start === end || this.items[end]) return;
        this.items[end] = this.items[start];
        delete this.items[start];
        //this.broadcast();
    }

    get selectedItem() {
        return this.items[this.selected];
    }

    getItemFrame(item) {
        return items[item.name].frame;
    }
}