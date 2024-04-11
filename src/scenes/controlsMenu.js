import Phaser from 'phaser'



export default class MainMenu extends Phaser.Scene{

    constructor() {
        super({ key: 'controlsMenu' });
    }

    preload(){
        
    }

    create(){
        this.add.image(0,0,'controlsBackground').setOrigin(0).setDepth(0).setDisplaySize(1025, 515)//Background

        this.add.image(190,5,'titleDecoration').setOrigin(0).setDepth(1).setScale(1.5)//Title decoration

        this.add.image(200, 235, 'wKey').setOrigin(0).setDepth(1).setScale(5)
        this.add.image(130, 300, 'aKey').setOrigin(0).setDepth(1).setScale(5)
        this.add.image(200, 300, 'sKey').setOrigin(0).setDepth(1).setScale(5)
        this.add.image(270, 300, 'dKey').setOrigin(0).setDepth(1).setScale(5)

        this.add.image(450, 260, 'leftClick').setOrigin(0).setDepth(1).setScale(6)
        this.add.image(710, 260, 'rightClick').setOrigin(0).setDepth(1).setScale(6)

        this.add.text(400, 28, 'CONTROLS', { fontFamily: 'pixelFont', fontSize: 60, color: '#5e1675ff' , fontStyle: 'bold'}).setDepth(1);
        this.add.text(75, 33, 'BACK', { fontFamily: 'pixelFont', fontSize: 40, color: '#5e1675ff' , fontStyle: 'bold'});
        this.add.text(155, 190, 'MOVEMENT', { fontFamily: 'pixelFont', fontSize: 50, color: '#5e1675ff' , fontStyle: 'bold'});
        this.add.text(445, 190, 'SHOOT', { fontFamily: 'pixelFont', fontSize: 50, color: '#5e1675ff' , fontStyle: 'bold'});
        this.add.text(650, 190, 'ATTACK MODE', { fontFamily: 'pixelFont', fontSize: 50, color: '#5e1675ff' , fontStyle: 'bold'});
        this.backButton = this.add.image(18, 30, 'homeButton').setOrigin(0).setDepth(1).setScale(1.5);

       this.backButton.setInteractive();
       this.backButton.on("pointerover", ()=>{
            this.backButton.setScale(1.6)
       })

       this.backButton.on("pointerout", ()=>{
            this.backButton.setScale(1.5)
       })

       this.backButton.on("pointerup", ()=>{
            this.scene.start('mainMenu');
       })
    }
}