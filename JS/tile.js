const TILE = {
    NONE: 0,
    BOMB: 1,
    EXPLODED: 2
}

export class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, gridX, gridY, textures) {
        super(scene, x, y, textures.covered);

        this.gridPos = {
            x: gridX,
            y: gridY
        }

        this.textures = textures;
        this.numerOfBombs = 0;

        this.type = TILE.NONE;
        this.revealed = false;

        this.flag = this.scene.add.sprite(x, y, this.textures.flag);
        this.flag.depth = 1;
        this.flag.visible = false;
        this.flagged = false

        this.bombCountText = this.scene.add.text(x, y, "0",{
            fontFamily: "Arial",
            fontSize: 64,
            color: "#00FF00"

        }).setOrigin(0.5);
        this.bombCountText.depth = 2;
        this.bombCountText.visible = false;
        
        this.godMode = false;

        this.setInteractive();
        this.setTileTexture();
    }

    setTileTexture() {

        if(this.godMode = true) {
            this.setTexture(this.getTexture());
            return;
        } else {
        let tex = this.revealed ?
            this.getTexture() :
            this.textures.covered;
        this.setTexture(tex);}

        this.flag.visible = this.flagged;
        this.bombCountText.visible = false;
        if((this.revealed || this.godMode) && this.numerOfBombs > 0) {
            this.bombCountText.visible = true;
        }
    }

    getTexture() {
        switch(this.type) {
            case TILE.NONE:
                return this.textures.base;
            case TILE.BOMB:
                return this.textures.bomb;
            case TILE.EXPLODED:
                return this.textures.explosion;                  
        }

        return undefined;
    }

    setNumberOfBombs(bombs) {
        this.numerOfBombs = bombs;
        this.bombCountText.text = bombs;
    }

    reveal() {
        this.revealded = true;
        this.setTileTexture();
    }

    mark() {
        this.flagged = !this.flagged;
        this.setTileTexture();
    }

    explode() {
        this.type = TILE.EXPLODED;
        this.setTileTexture();
    }

    turnIntoBomb() {
        this.type = TILE.BOMB;
        this.setTileTexture();
    }

    isBomb() {
        return (this.type === TILE.BOMB);
    }

    toggleGodMode() {
        this.godMode = !this.godMode
        this.setTileTexture();
    }
}