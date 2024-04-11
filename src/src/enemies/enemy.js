
import Phaser from 'phaser'

/**
 * Clase que representa un enemigo del juego.
 */
export default class Enemy extends Phaser.GameObjects.Sprite {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el enemigo
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y, target, image) {
        super(scene, x, y, image);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.enemies.add(this)
        this.scene.enviromental.add(this)
        // Queremos que el enemigo no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        // Velocidad 0 por defecto
        this.speed = 0;
        // Daño
        this.damage = 1;
        // Vida
        this.life = 1;
        
        this.target = target;

        // is enemy attacking?
        this.attacking = false;

        this.setDepth(7);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            if (this.anims.getName() === 'die'){
                this.doSomethingVerySpecificBecauseYoureMyBelovedChild()
                this.scene.enemies.remove(this);
                this.destroy();
            }
        });
    }

    doSomethingVerySpecificBecauseYoureMyBelovedChild() {
    }


    receiveDamage(damage){
        this.life -= damage;

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Elastic.InOut,
            duration: 40, 
            repeat: 1,
            yoyo: true,
            onStart: () => {
                this.setTint(0xff0000);
            },
            onComplete: () => {
                this.clearTint();
                this.setAlpha(1);
            }
        })

        if (this.life <= 0){
            this.body.setVelocity(0);
            this.body.enable = false;
            this.scene.enemyHasDied();
            this.stop();
            this.play('die', true);
        }
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
        if (this.life > 0){
            this.flipEnemy()
        }
    }

    flipEnemy(){
        this.setFlipX(this.body.velocity.x < 0 || this.target.x < this.x);
    }

    isProjectile(){
        return false;
    }
}