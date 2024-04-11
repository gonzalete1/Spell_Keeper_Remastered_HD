import ArmeriaPrueba from './scenes/armeriaPrueba.js';
import Boot from './scenes/boot.js';
import Phaser from 'phaser'
import MainMenu  from './scenes/mainMenu.js';
import GUI from './scenes/GUI.js';
import LBE1 from './scenes/library/lbE1.js';
import ARR1 from './scenes/armory/arR1.js'
import ARR2 from './scenes/armory/arR2.js'
import ARR3 from './scenes/armory/arR3.js'
import ARX1 from './scenes/armory/arX1.js'
import LBR1 from './scenes/library/lbR1.js';
import LBR2 from './scenes/library/lbR2.js';
import LBR3 from './scenes/library/lbR3.js'
import LBR4 from './scenes/library/lbR4.js';
import LBR5 from './scenes/library/lbR5.js';
import LBR6 from './scenes/library/lbR6.js';
import LBR7 from './scenes/library/lbR7.js';
import LBR8 from './scenes/library/lbR8.js';
import LBR9 from './scenes/library/lbR9.js';
import LBR10 from './scenes/library/lbR10.js';
import LBR11 from './scenes/library/lbR11.js';
import LBR12 from './scenes/library/lbR12.js';
import LBR13 from './scenes/library/lbR13.js';
import LBR14 from './scenes/library/lbR14.js';
import LBR15 from './scenes/library/lbR15.js';
import LBX1 from './scenes/library/lbX1.js';
import LBX2 from './scenes/library/lbX2.js';
import LBX3 from './scenes/library/lbX3.js';
import LBX4 from './scenes/library/lbX4.js';
import Controls from './scenes/controlsMenu.js';
import End from './scenes/end.js'


/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 512,
    scale: {
        mode: Phaser.Scale.FIT,  
        //autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
    scene: [Boot, MainMenu, Controls, ArmeriaPrueba,ARR1,ARR2,ARR3,ARX1,LBE1,LBR1,LBR2,LBR3,LBR4,LBR5,LBR6,LBR7,LBR8,LBR9,LBR10,LBR11,LBR12,LBR13,LBR14,LBR15,LBX1,LBX2,LBX3,LBX4, GUI, End],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
};

new Phaser.Game(config);
