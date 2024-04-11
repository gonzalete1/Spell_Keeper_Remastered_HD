import Phaser from "phaser";

export default class weaponDisplay extends Phaser.GameObjects.Sprite {
    /**
        * Constructor
        * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
        * @param {number} x Coordenada X
        * @param {number} y Coordenada Y
        */
    constructor(scene, x, y, initialWeaponName) {
        super(scene, x, y, initialWeaponName);
        this.setScale(3);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.showedWeapon = initialWeaponName;
    }

    updateDisplay(newWeaponName) {
        this.showedWeapon = newWeaponName;
        this.setTexture(this.showedWeapon);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}