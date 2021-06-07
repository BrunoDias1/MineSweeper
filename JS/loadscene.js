export default class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene");
    }

    preload() {
        this.load.image("background", "./Images/backGround.png");
        this.load.image("square", "./Images/square.png");
        this.load.image("squarePressed", "./Images/squarePressed.png");
        this.load.image("bomb", "./Images/bomb.png");
        this.load.image("bombRed", "./Images/bombRed.png");
        this.load.image("flag", "./Images/flag.png");
    }

    create() {
        this.input.mouse.disableContextMenu();
        this.scene.start("MainScene");
    }
}