
import bg from '../../assets/main_menu/title_bg.png'
import mt from '../../assets/main_menu/main_title.png'
import play from '../../assets/main_menu/play.png'
import playSel from '../../assets/main_menu/play_selected.png'
import font from 'url:../../assets/fonts/VT323Regular.ttf'
import Dungeongen from '../dungeongen'



export default class MainMenu extends Phaser.Scene{

    constructor() {
        super({ key: 'mainMenu' });
    }
    
 

    preload(){
        this.load.image('title_bg',bg);
        this.load.image('main_title',mt);
        this.load.image('play',play);
        this.load.image('play_sel',playSel);

        // Archivo .ttf descargable desde
        // https://www.dafont.com/es/happy-donuts.font
        //this.load.add('pixelFont', '../assets/fonts/VT323Regular.ttf')
        //this.load.bitmapFont('customFont','../../assets/font/spellkeeper.png','../../assets/font/spellkeeper.xml')
        //this.load.bitmapFont('pixelfont','../../assets/font/pixelfont.png','../../assets/font/Pixeled.xml')
    }

    create(){
        this.add.image(0,0,'title_bg').setOrigin(0).setDepth(0).setScale(1.05); //Background
        this.add.text(100, 50, 'SPELL KEEPER',{ fontFamily: 'pixelFont', fontSize: 80, color: '#000000', fontStyle: 'bold'});
        // let playButton = this.add.image(470,150,'play').setOrigin(0).setDepth(1).setScale(0.35); 
        // let playSelectedButton = this.add.image(470,150,'play_sel').setOrigin(0).setDepth(1).setScale(0.35).setVisible(false); 

        this.playButton = this.add.text(180, 160, '> PLAY', { fontFamily: 'pixelFont', fontSize: 60, color: '#000000' , fontStyle: 'bold'});

        let dungeonGenerator = new Dungeongen();
       
        this.controlsButton = this.add.text(180, 230, '> CONTROLS', { fontFamily: 'pixelFont', fontSize: 60, color: '#000000' , fontStyle: 'bold'});
        /*let nuevoTexto = 
        this.add.text(390, 70, 
            'Spell Keeper', 
            { fontFamily: 'pixelFont', fontSize: 80, color: '#000000' });*/
        //this.add.text(450, 70, 'Spell Keeper',{ fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' })
      //  let hola = this.add.bitmapText(200, 100, 'pixelfont','Bitmap Fonts!', 64);
       // text.setScale(3);

       this.playButton.setInteractive();
       this.playButton.on("pointerover", ()=>{
            this.playButton.setStyle({fill: '#ffffff'})
       })

       this.playButton.on("pointerout", ()=>{
        this.playButton.setStyle({fill: '#000000'})
       })

       this.playButton.on("pointerup", ()=>{
            this.scene.start('arR1',{X: 0, Y: 3, dg:dungeonGenerator.tutorial(),dir:'c', SSM: dungeonGenerator.generateSaveStateMatrix(4,1),playerStat:null});
            //this.scene.start('lbE1',{ dg:dungeonGenerator.init(),X: dungeonGenerator.getEntranceX(), Y: dungeonGenerator.getEntranceY(),dir:'c', SSM: dungeonGenerator.generateSaveStateMatrix(dungeonGenerator.getN(),dungeonGenerator.getM()),playerStat:null});
       })

       this.controlsButton.setInteractive();
       this.controlsButton.on("pointerover", ()=>{
            this.controlsButton.setStyle({fill: '#ffffff'})
       })

       this.controlsButton.on("pointerout", ()=>{
        this.controlsButton.setStyle({fill: '#000000'})
       })

       this.controlsButton.on("pointerup", ()=>{
         this.scene.start('controlsMenu');
       })
    }

}