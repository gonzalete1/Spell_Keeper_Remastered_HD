import Phaser from 'phaser'

/**
 * Clase que se usa para crear las hitbox del juego.
 */
export default class PlayerHitBox extends Phaser.GameObjects.Zone {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el enemigo
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
    */

    constructor(scene, x, y, width, height, damage) {
        super(scene, x, y, width, height);
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.physics.add.overlap(this.scene.enemies, this, (enemy) => {
            enemy.receiveDamage(damage);
            this.scene.player.regenMana();
        });
    }
}