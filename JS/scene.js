import {Tile} from "./tile.js"

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    init() {
        this.board = {
            width: 7,
            height: 9,
            bombs: 9,
            tileSize: 96,
            offset: {
                x: 95,
                y: 120
            }
        }

        this.input.keyboard.on("keydown-V", event => {
            this.showBoard(event);
        });
        this.input.on("gameobjectup", (pointer, go, event) => {
            this.mousePressed(pointer, go, event);
            });
    }

    preload() {
        
    }

    create() {
        this.background = this.add.sprite(0 , 0, "background").setOrigin(0);

        this.createMap();
        this.placeBombs();
        this.countBombs();
    }
        

    update(time) {
        
    }

    createMap() {
        let tile_faces = {
            base: "squarePressed",
            covered: "square",
            bomb: "bomb",
            explosion: "bombRed",
            flag: "flag"
        }

        this.tiles = [];

        for(let w = 0; w < this.board.width; w++) {
            for(let h = 0; h < this.board.height; h++) {
                let t = new Tile(
                    this, w * this.board.tileSize + 
                    this.board.offset.x,
                    h * this.board.tileSize + 
                    this.board.offset.y, 
                     w, h, tile_faces);

                this.add.existing(t);
                this.tiles.push(t);
            }
        }
    }

    placeBombs() {
        let bombCount = 0;
        while(bombCount < this.board.bombs) {
            let w = Math.floor(Math.random() * this.board.witdh);
            let h = Math.floor(Math.random() * this.board.height);

            let t = this.tiles[w * this.board.height + h];
            if(!t.isBomb()) {
                t.turnIntoBomb(); 
                bombCount++; 
            }         
        }
    }

    countBombs() {
        this.tiles.forEach(
            t => {
                if(t.isBomb()) {
                    return;
                }

                let gridPos = t.gridPos;

                let startX = Math.max(gridPos.x - 1, 0);
                let endX = Math.min(gridPos.x + 1, this.board.width - 1);

                let startY = Math.max(gridPos.y - 1, 0);
                let endY = Math.min(gridPos.y + 1, this.board.height - 1);

                let bombCount = 0;

                for(let w = startX; w <= endX; w++) {
                    for(let h = startY; h <= endY; h++) {
                        if(w === gridPos.x && h === gridPos.y) {
                            continue;
                        }
                        let other = this.tiles[
                            w * this.board.height + h];
                        if(other.isBomb()) {
                            bombCount++
                        }
                    }
                }

                t.setNumberOfBombs(bombCount);
            }
        );
    }

    mousePressed(pointer, go, event) {
        if(go.revealed == true) {
            return;
        }

        if(pointer.rightButtonReleased()) {
            go.mark();
        } else if(!go.flagged) {
            go.reveal();
            if(go.isBomb()) {
                go.explode();
                console.log("You lost")
            } else {
                this.showOtherTiles(go);
            }          
        } 
    }

    showOtherTiles(tile) {
        if(!tile.isBomb() && tile.setNumberOfBombs == 0) {
            let gridPos = tile.gridPos;

            let startX = Math.max(gridPos.x - 1, 0);
            let endX = Math.min(gridPos.x + 1, this.board.width - 1);

            let startY = Math.max(gridPos.y - 1, 0);
            let endY = Math.min(gridPos.y + 1, this.board.height - 1);

            for(let w = startX; w <= endX; w++) {
                for(let h = startY; h <= endY; h++) {
                    let other = this.tiles[
                        w * this.board.height + h];
                    if(!other.isBomb() && !other.revealed && !other.flagged) {
                        other.reveal();
                        this.showOtherTiles(other);
                    }
                }
            }    
        }

        this.checkVictory();
    }

    checkVictory() {
        let flaggedBombs = 0;
        let revealed = 0;

        this.tile.forEach( t => {
            if(t.isBomb() && t.flagged) {
                flaggedBombs++;
            } else {
                revealed++;
            }
        });

        if(flaggedBombs + revealed == this.tiles.lenght) {
            console.log("YOU WON");
        }
    }

    showBoard() {
        this.tiles.forEach(t => t.toggleGodMode());
    }
}