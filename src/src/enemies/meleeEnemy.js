
import Phaser from 'phaser'
import Enemy from './enemy';

/**
 * Clase que representa un enemigo del juego.
 */
export default class MeleeEnemy extends Enemy {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el enemigo
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y, target, image, attackDelay) {
        super(scene, x, y, target, image);

        this.timerAttack = this.scene.time.addEvent({
            delay: attackDelay,
            callback: this.onTimerAttack,
            callbackScope: this,
            loop: true
        });

        this.timerAttack.paused = true;

        // SE PODRIA MEJORAR CON this.on(animationstart) PERO NO SABEMOS HACERLO
        this.on(Phaser.Animations.Events.ANIMATION_START, () => {
            if (this.life > 0){
                if (this.anims.getName() === 'attack'){
                    this.attacking = true;
                    this.spawnHitbox();
                }
            }
        })

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            if (this.life > 0){
                if (this.anims.getName() === 'attack'){
                    this.attacking = false;
                    this.destroyAttackZones();
                }
            }
        })

        this.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
            if (this.anims.getName() === 'attack'){
                this.attacking = false;
                this.destroyAttackZones();
            }
        })
    }

    spawnHitbox(){}

    destroyAttackZones(){
        this.attackZone.destroy(true);
    }

    doSomethingVerySpecificBecauseYoureMyBelovedChild() {
        this.scene.time.removeEvent(this.timerAttack);
    }

    receiveDamage(damage){
        super.receiveDamage(damage);
        if (this.life <= 0)
            this.timerAttack.paused = true;
    }

    onTimerAttack(){
        this.play('attack');
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
            this.scene.physics.moveToObject(this, this.target, this.attacking ? 0 : this.speed);
            this.playAfterRepeat('walking');
            if (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) >= 150)
                this.timerAttack.paused = true;
            else
                this.timerAttack.paused = false;
        }
    }

}