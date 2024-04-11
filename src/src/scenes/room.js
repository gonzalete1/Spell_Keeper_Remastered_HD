
import arb from '../../assets/armory/tiles/Base.png'
import arw from '../../assets/armory/tiles/Weapons.png'
import lbb from '../../assets/library/tiles/Base.png'
import lbw from '../../assets/library/tiles/Objects.png'
import f from '../../assets/misc/fire.png'

import Player from '../player.js'
import basicRanged from '../armas/basicRanged.js';
import basicMelee from '../armas/basicMelee.js';
import FireStaff from '../armas/fireStaff.js';
import Trigger from '../trigger.js';
import CollisionHitbox from '../collisionHitbox.js';
import EnemySpawner from '../enemySpawner.js';
import Fire from '../fire.js'
import Chest from '../chest.js';
import LevelTrigger from '../levelTrigger.js'
import Dungeongen from '../dungeongen'

import font from 'url:../../assets/fonts/VT323Regular.ttf'


export default class Room extends Phaser.Scene {



    constructor(obj) {
        super({ key: obj.key });

        this.x = 0;
        this.y = 0;
        this.loadScene = this.loadScene.bind(this);
        this.nSpawn = { x: 0, y: 0 };
        this.sSpawn = { x: 0, y: 0 };
        this.eSpawn = { x: 0, y: 0 };
        this.wSpawn = { x: 0, y: 0 };
        this.cSpawn = { x: 0, y: 0 };
        // this.level = obj.level
        this.dungeonGenerator = new Dungeongen();

    }

    init(obj) {


        this.x = obj.X;
        this.y = obj.Y;
        this.dungeon = obj.dg;
        this.direction = obj.dir;
        this.numberOfEnemies = 0;
        this.chestOpened = false;
        this.loadScene = this.loadScene.bind(this);
        this.loadLevel = this.loadLevel.bind(this);
        this.cache.tilemap.remove('tilemap');
        this.saveStateMatrix = obj.SSM
        this.fireArray = [] //El array que guarda los fuegos en el nivel para destruirlos una vez matados a todos los bichos

        if (obj.playerStat === null) {

            this.globalPlayerStats = {
                life: 0,           // Current life points
                maximumLife: 0,    // Maximum life points
                mana: 0,            // Current mana points
                maximumMana: 0,     // Maximum mana points
                weaponMult: 1,       // Multiplier for weapon damage
                moveSpeed: 0,        // Player movement speed
                lck: 0,              // Player luck stat
                MeleeWeaponArray: [new basicMelee(this, 0, 0, 1, true)], // Array to store melee weapons
                RangedWeaponArray: [new basicRanged(this, 0, 0, 1, true)],// Array to store ranged weapons
                ActMelIndex: 0,      // Index of the currently active melee weapon
                ActRangIndex: 0,     // Index of the currently active ranged weapon
                lastWeaponUsed: null // Last weapon used (can be set to the name or ID of the weapon)
            };
        } else {
            this.globalPlayerStats = obj.playerStat;

        }
    }


    preload() {

        if (this.textures.exists('Base'))
            this.textures.remove('Base')

        if (this.textures.exists('Objects'))
            this.textures.remove('Objects')

        if (this.level === 'ar') {
            this.load.image('Base', arb)
            this.load.image('Objects', arw)
        } else {
            this.load.image('Base', lbb)
            this.load.image('Objects', lbw)
        }

        this.load.image('fire', f)

    }


    loadScene(x, y, direction, level, dungeon) {

        //Ajustamos las coordenadas
        if (direction === 'n') {
            y -= 1;
            direction = 's'
        } else if (direction === 's') {
            y += 1;
            direction = 'n'
        } else if (direction === 'e') {
            x += 1;
            direction = 'w'
        } else if (direction === 'w') {
            x -= 1;
            direction = 'e'
        }
        // console.log(level + dungeon[y][x].name)
        this.map.removeAllLayers()
        this.map.destroy()

        this.unloadScene(this.key)
        this.scene.start(level + dungeon[y][x].name, { X: x, Y: y, dg: dungeon, dir: direction, SSM: this.saveStateMatrix, playerStat: this.globalPlayerStats });
    }

    loadLevel(level) {
        this.map.removeAllLayers()
        this.map.destroy()

        this.unloadScene(this.key)
        this.loadingBar()
        
        if (level === 'ar')
            this.scene.start('lbE1', { dg: this.dungeonGenerator.init(), X: this.dungeonGenerator.getEntranceX(), Y: this.dungeonGenerator.getEntranceY(), dir: 'c', SSM: this.dungeonGenerator.generateSaveStateMatrix(this.dungeonGenerator.getN(), this.dungeonGenerator.getM()), playerStat: this.globalPlayerStats })

    }



    create() {

        if (this.dungeon[this.y][this.x].visited === false)
            this.dungeon[this.y][this.x].visited = true
        else {
            this.loadSceneState()
        }

        //let hb_n = new Trigger(this,256,0,96,32,this.player,sceneManager.loadScene(x,y,'n'));
        //LOADING TILES
        this.map = this.make.tilemap({
            key: 'tilemap',
            tileHeight: 32,
            tileWidth: 32
        });

        let base = this.map.addTilesetImage('Base');
        let objects = this.map.addTilesetImage('Objects');
        let fondo = this.map.createLayer('Fondo', [base]).setDepth(0)
        let floor = this.map.createLayer('Floor', [base]).setDepth(1)
        let walls = this.map.createLayer('Walls', [base]).setDepth(2).setCollisionByExclusion(-1)
        let cObjects = this.map.createLayer('CObjects', [objects]).setDepth(3).setCollisionByExclusion(-1)
        let nCObjects = this.map.createLayer('NCObjects', [objects]).setDepth(4)
        let extra = this.map.createLayer('Extra', [objects]).setDepth(5)

        //DETERMINE PLAYER SPAWN
        let playerX = 300;
        let playerY = 200;

        this.loadPlayerSpawn();

        switch (this.direction) {
            case 'n':
                playerX = this.nSpawn.x; playerY = this.nSpawn.y;
                break;
            case 's':
                playerX = this.sSpawn.x; playerY = this.sSpawn.y;
                break;
            case 'e':
                playerX = this.eSpawn.x; playerY = this.eSpawn.y;
                break;
            case 'w':
                playerX = this.wSpawn.x; playerY = this.wSpawn.y;
                break;
            case 'c':
                playerX = this.cSpawn.x; playerY = this.cSpawn.y;
                break;
        }

        this.enviromental = this.add.group()

        let newMeleeArray = []
        for (let weapon of this.globalPlayerStats.MeleeWeaponArray) {
            let newWeapon = weapon.constructor
            newMeleeArray.push(new newWeapon(this, 0, 0, 1, true))
        }
        this.globalPlayerStats.MeleeWeaponArray = newMeleeArray;


        let newRangedArray = []
        for (let weapon of this.globalPlayerStats.RangedWeaponArray) {
            let newWeapon = weapon.constructor
            newRangedArray.push(new newWeapon(this, 0, 0, 1, true))
        }
        this.globalPlayerStats.RangedWeaponArray = newRangedArray;


        this.player = new Player(this, playerX, playerY, this.globalPlayerStats.life, this.globalPlayerStats.maximumLife, this.globalPlayerStats.mana, this.globalPlayerStats.maximumMana, this.globalPlayerStats.weaponMult, this.globalPlayerStats.moveSpeed, this.globalPlayerStats.lck, this.globalPlayerStats.MeleeWeaponArray, this.globalPlayerStats.RangedWeaponArray, this.globalPlayerStats.ActMelIndex, this.globalPlayerStats.ActRangIndex, this.globalPlayerStats.lastWeaponUsed);
        this.physics.add.collider(this.enviromental, walls, (obj) => {
            if (obj.isProjectile())
                obj.destroy();
        });
        this.physics.add.collider(this.enviromental, cObjects, (obj) => {
            if (obj.isProjectile())
                obj.destroy();
        });
        this.player.setDepth(6);



        this.scene.launch('gui', { life: this.player.actualLife, maxLife: this.player.maxLife, mana: this.player.actualMana, maxMana: this.player.maxMana });

        this.enemies = this.add.group()

        //TRIGGERS AND STUFF
        this.loadObjects();


        this.cameras.main.setZoom(3);
        this.cameras.main.setBounds(0, 0, 1024, 512)
        this.cameras.main.startFollow(this.player)
    }

    loadObjects() {
        // En Tiled tiene que haber una capa de objetos llamada `capaObjetos`
        for (const objeto of this.map.getObjectLayer('Cosas').objects) {
            // `objeto.name` u `objeto.type` nos llegan de las propiedades del
            // objeto en Tiled
            if (objeto.type === 'Trigger') {
                switch (objeto.properties[0].value) {
                    case 'n':
                        new Trigger(this, objeto.x + objeto.width / 2, objeto.y + 16, objeto.width, objeto.height, this.player, this.level, this.x, this.y, this.loadScene, 'n', this.dungeon);
                        break;
                    case 's':
                        new Trigger(this, objeto.x + objeto.width / 2, objeto.y + 16, objeto.width, objeto.height, this.player, this.level, this.x, this.y, this.loadScene, 's', this.dungeon);
                        break;
                    case 'e':
                        new Trigger(this, objeto.x + objeto.width / 2, objeto.y + objeto.height / 2, objeto.width, objeto.height, this.player, this.level, this.x, this.y, this.loadScene, 'e', this.dungeon);
                        break;
                    case 'w':
                        new Trigger(this, objeto.x + objeto.width / 2, objeto.y + objeto.height / 2, objeto.width, objeto.height, this.player, this.level, this.x, this.y, this.loadScene, 'w', this.dungeon);
                        break;
                }

            } else if (objeto.type === 'Hitbox') {
                new CollisionHitbox(this, objeto.x + objeto.width / 2, objeto.y + objeto.height / 2, objeto.width, objeto.height)
            } else if (objeto.type === 'EnemySpawn') {
                if (this.numberOfEnemies !== -1) {
                    new EnemySpawner(this, objeto.x, objeto.y, this.player)
                    this.numberOfEnemies++
                }
            } else if (objeto.type === 'Fire') {
                if (this.numberOfEnemies !== -1) {
                    if (objeto.rotation === 270)
                        this.fireArray.push(new Fire(this, objeto.x - objeto.width / 2, (objeto.y + objeto.height / 2) - 40, objeto.width, objeto.height, objeto.rotation))
                    else if (objeto.rotation === 90)
                        this.fireArray.push(new Fire(this, objeto.x + objeto.width / 2, (objeto.y + objeto.height / 2) - 8, objeto.width, objeto.height, objeto.rotation))
                    else
                        this.fireArray.push(new Fire(this, (objeto.x - objeto.width / 2) + 32, (objeto.y + objeto.height / 2) - 40, objeto.width, objeto.height, objeto.rotation))
                }
            } else if (objeto.type === 'Chest') {
                new Chest(this, objeto.x + objeto.width / 2, objeto.y - objeto.height / 2, objeto.width, objeto.height, this.player, this.chestOpened)
            } else if (objeto.type === 'SpecialTrigger') {
                new LevelTrigger(this, objeto.x + objeto.width / 2, objeto.y + 16, objeto.width, objeto.height, this.player, this.level, this.loadLevel)
            }
        }
    }

    enemyHasDied() {
        this.numberOfEnemies--;
        if (this.numberOfEnemies <= 0) {
            this.numberOfEnemies = -1; //Habitacion limpia

            for (let fire of this.fireArray) {
                fire.destroySprite();
                fire.destroy();
            }
        }
    }

    chestWasOpened() {
        this.chestOpened = true;
    }

    loadPlayerSpawn() {
        for (const objeto of this.map.getObjectLayer('Cosas').objects) {
            // `objeto.name` u `objeto.type` nos llegan de las propiedades del
            // objeto en Tiled
            if (objeto.type === 'PlayerSpawn') {
                switch (objeto.properties[0].value) {
                    case 'n':
                        this.nSpawn.x = objeto.x; this.nSpawn.y = objeto.y;
                        break;
                    case 's':
                        this.sSpawn.x = objeto.x; this.sSpawn.y = objeto.y;
                        break;
                    case 'e':
                        this.eSpawn.x = objeto.x; this.eSpawn.y = objeto.y;
                        break;
                    case 'w':
                        this.wSpawn.x = objeto.x; this.wSpawn.y = objeto.y;
                        break;
                    case 'c':
                        this.cSpawn.x = objeto.x; this.cSpawn.y = objeto.y;
                        break;
                }
            }
        }
    }

    saveSceneState() {
        let savedSceneState = {
            // Save relevant scene state here
            // For example:
            numberOfEnemies: this.numberOfEnemies,
            chestOpened: this.chestOpened
        };

        this.saveStateMatrix[this.y][this.x] = savedSceneState
    }

    loadSceneState() {
        let savedSceneState = this.saveStateMatrix[this.y][this.x]
        if (savedSceneState) {
            this.numberOfEnemies = savedSceneState.numberOfEnemies
            this.chestOpened = savedSceneState.chestOpened
        }
    }

    // Unload scene
    unloadScene(sceneKey) {
        this.getPlayerStats();
        this.saveSceneState();
        this.scene.stop(sceneKey);
    }


    getPlayerStats() {
        this.globalPlayerStats.life = this.player.actualLife
        this.globalPlayerStats.maximumLife = this.player.maxLife
        this.globalPlayerStats.mana = this.player.actualMana
        this.globalPlayerStats.maximumMana = this.player.maxMana
        this.globalPlayerStats.weaponMult = this.player.weaponMultiplier
        this.globalPlayerStats.moveSpeed = this.player.movSpeed
        this.globalPlayerStats.lck = this.player.luck
        this.globalPlayerStats.MeleeWeaponArray = this.player.meeleWeapons
        this.globalPlayerStats.RangedWeaponArray = this.player.rangedWeapons
        this.globalPlayerStats.ActMelIndex = this.player.meleeIndex
        this.globalPlayerStats.ActRangIndex = this.player.rangedIndex
        this.globalPlayerStats.lastWeaponUsed = this.player.equipedWeapon
    }

    loadingBar() {
        // Background
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
        let loadingText = this.add.text(420, 215, 'Loading...', { fontFamily: 'pixelFont', fontSize: 40, color: '#5e1675ff' });

        // Percent bar text
        let percentText = this.add.text(485, 320, '0%', { fontFamily: 'pixelFont', fontSize: 24, color: '#5e1675ff' });
    }

    loadFont(name, url) {
        let newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
      }






}