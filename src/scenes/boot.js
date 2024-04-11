import Phaser from 'phaser'
import player from '../../assets/cSprites/characters/Mage_Walking.png'
import playerIdle from '../../assets/cSprites/characters/Mage_Idle.png'
import playerDead from '../../assets/cSprites/characters/Mage_Dead.png'
import knight from '../../assets/armory/sprites/knight/knight_spritesheet.png'
import skeleton from '../../assets/armory/sprites/skeleton/skeleton_spritesheet.png'
import PoisonousGoblin from '../../assets/gardens/sprites/goblin/poisonous_goblin_spritesheet.png'
import CarnivorousPlant from '../../assets/gardens/sprites/carnivorous_plant/carnivorous_plant_spritesheet.png'
import MagicSkeleton from '../../assets/library/sprites/skeleton/skeleton_3_spritesheet.png'
import StandardSkeleton from '../../assets/library/sprites/skeleton/skeleton_1_spritesheet.png'
import LavaGolem from '../../assets/throne_room/sprites/lava_golem/golem_spritesheet.png'
import Slime from '../../assets/gardens/sprites/slime/slime_spritesheet.png'
import Book from '../../assets/library/sprites/book/book_spritesheet_1.png'
import room from '../../assets/armory/sprites/Hab_Prueba.png'
import arrow from '../../assets/armory/sprites/arrow/arrow.png'
import dagger from '../../assets/cSprites/02.png'
import Fireball from '../../assets/cSprites/fireball_spritesheet.png'
import Lighting from '../../assets/cSprites/LightingEffect.png'
import PurpleMagicBall from '../../assets/cSprites/purple_magic_ball_spritesheet.png'
import GreenPoisonBall from '../../assets/cSprites/green_poison_spritesheet.png'
import font from 'url:../../assets/fonts/VT323Regular.ttf'
import fullHeart from '../../assets/HUD/ui-heart-full.png'
import halfHeart from '../../assets/HUD/half-ui-heart.png'
import emptyHeart from '../../assets/HUD/ui-heart-empty.png'
import Fire from '../../assets/misc/fire.png'
// prueba
import manaBar from '../../assets/HUD/manabar.png'
import mainMana from '../../assets/HUD/main_mana.png'
import finalMana from '../../assets/HUD/final_mana.png'
import chest from '../../assets/armory/sprites/chests.png'
import fireStaff from '../../assets/cSprites/fireStaff2.png'
import poisonStaff from '../../assets/cSprites/poisonStaff2.png'
// Controls Menu
import ControlsBackground from '../../assets/controlsMenu/background.png'
import wKey from '../../assets/controlsMenu/w.png'
import aKey from '../../assets/controlsMenu/a.png'
import sKey from '../../assets/controlsMenu/s.png'
import dKey from '../../assets/controlsMenu/d.png'
import homeButton from '../../assets/controlsMenu/home.png'
import leftClick from '../../assets/controlsMenu/leftClick.png'
import rightClick from '../../assets/controlsMenu/rightClick.png'
import TitleDecoration from  '../../assets/mainTitle.png'

/**
 * Escena para la precarga de los assets que se usarán en el juego.
 * Esta escena se puede mejorar añadiendo una imagen del juego y una 
 * barra de progreso de carga de los assets
 * @see {@link https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/} como ejemplo
 * sobre cómo hacer una barra de progreso.
 */
export default class Boot extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
    
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    // Con setPath podemos establecer el prefijo que se añadirá a todos los load que aparecen a continuación
   // this.load.setPath('assets/sprites/');
    this.load.spritesheet('player_spritesheet', player, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player_idle',playerIdle, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('player_dead',playerDead, { frameWidth: 32, frameHeight: 32 })
    this.load.image('escenaPrueba', room);
    // Controls Menu
    this.load.image('controlsBackground', ControlsBackground);
    this.load.image('wKey', wKey);
    this.load.image('aKey', aKey);
    this.load.image('sKey', sKey);
    this.load.image('dKey', dKey);
    this.load.image('homeButton', homeButton);
    this.load.image('leftClick', leftClick);
    this.load.image('rightClick', rightClick);
    this.load.image('titleDecoration', TitleDecoration)
    this.load.image('fire',Fire)

    this.load.spritesheet('arrow', arrow,{frameWidth: 32, frameHeight: 32});
    this.load.image('dagger', dagger);
    this.load.image('fireStaff',fireStaff)
    this.load.image('poisonStaff',poisonStaff)
    this.load.image('ui-heart-full', fullHeart);
    this.load.image('half-ui-heart', halfHeart);
    this.load.image('ui-heart-empty', emptyHeart);
    this.load.spritesheet('knight_spritesheet', knight, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton_spritesheet', skeleton, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('fireball_spritesheet', Fireball, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('chest',chest,{frameWidth: 32, frameHeight:32})
    this.load.spritesheet('lighting_spritesheet', Lighting, { frameWidth: 64, frameHeight:64 });
    this.load.spritesheet('poisonousGoblinSpritesheet', PoisonousGoblin, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('carnivorousPlantSpritesheet', CarnivorousPlant, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('magicSkeletonSpritesheet', MagicSkeleton, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lavaGolemSpritesheet', LavaGolem, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('slimeSpritesheet', Slime, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('bookSpritesheet', Book, {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet('standardSkeletonSpritesheet', StandardSkeleton, { frameWidth: 72, frameHeight: 72 });
    this.load.spritesheet('purpleMagicBallSpritesheet', PurpleMagicBall, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('greenPoisonBallSpritesheet', GreenPoisonBall, { frameWidth: 32, frameHeight: 32 });
    this.load.image('manaBar', manaBar);
    this.load.image('mainMana', mainMana);
    this.load.image('finalMana', finalMana);

   /* // Background
    let background = this.add.graphics();
    background.fillStyle(0xad88c6, 1);
    // 363062
    background.fillRect(0, 0, 1000, 600);
    
    // Loading bar 
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x8f3ea9, 0.8);
    progressBox.fillRect(340, 270, 320, 50);

    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0x8f3ea9, 1);
      progressBar.fillRect(350, 280, 300 * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });
                
    this.load.on('fileprogress', function (file) {
      console.log(file.src);
    });
    this.load.on('complete', function () {
      console.log('complete');
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Loading bar text
    this.loadFont('pixelFont', font);
    let loadingText = this.add.text(420, 215, 'Loading...', { fontFamily: 'pixelFont', fontSize: 40, color: '#5e1675ff'});

    // Percent bar text
    let percentText = this.add.text(485, 320, '0%', { fontFamily: 'pixelFont', fontSize: 24, color: '#5e1675ff'});*/
  }

  loadFont(name, url) {
    let newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
  }

  /**
   * Creación de la escena. En este caso, solo cambiamos a la escena que representa el
   * nivel del juego
   */
  create() {
    this.scene.start('mainMenu');
  }
}