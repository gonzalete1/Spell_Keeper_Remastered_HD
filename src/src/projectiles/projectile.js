import Phaser from 'phaser'

/**
 * Clase que representa el proyectil generico del juego del juego.
 */
export default class Projectile extends Phaser.GameObjects.Sprite {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el enemigo
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
    */

    constructor(scene, x, y, image, targetEnemy, damage) {
        super(scene, x, y, image);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.enviromental.add(this)
        this.scene.physics.add.overlap(this, this.scene.enemies, (projectile, enemy) => {
            if (targetEnemy){
                this.impact(); // impact animation
                enemy.receiveDamage(damage)
            }
        });

        this.scene.physics.add.overlap(this, this.scene.player, (projectile, player) => {
            if (!targetEnemy){
                this.impact(); // impact animation
                player.receiveDamage(damage)
            }
        });

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            if (this.anims.getName() === 'impact'){
                this.destroy();
            }
        });
        this.setDepth(7);
        this.impacted = false;

        //this.play('normal', true);
    }

    impact(){
        this.impacted = true;
        this.body.setVelocity(0);
    }

    isProjectile(){
        return true;
    }

    /**
     * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
     * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
     * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
     * @override
     */
    preUpdate(t, dt) {
        // IMPORTANTE: Si no ponemos esta instrucción y el sprite está animado
        // no se podrá ejecutar la animación del sprite. 
        super.preUpdate(t, dt);
        if (!this.impacted)
            this.play('normal', true);

        // on overlap(fn(con quien) { ... })
        
    }

}