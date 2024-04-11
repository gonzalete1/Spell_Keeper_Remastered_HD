import Phaser from 'phaser'
import Projectile from './projectile';

/**
 * Clase que representa una flecha del juego.
 */
export default class GreenPoisonBall extends Projectile {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece el enemigo
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
    */

    constructor(scene, x, y, target, targetEnemy, damage) {
        super(scene, x, y, 'grennPoisonBall', targetEnemy, damage);

        this.anims.create({
            key: 'normal',
            frames: this.anims.generateFrameNumbers('greenPoisonBallSpritesheet', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'impact',
            frames: this.anims.generateFrameNumbers('greenPoisonBallSpritesheet', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        this.setScale(2);

        this.speed = 100;

        this.rotation = Phaser.Math.Angle.Between(x, y, target.x, target.y);

        if (this.angle >= 45 && this.angle <= 135) {
            this.body.setSize(this.width * 0.4, this.height * 0.45, true);
            this.body.setOffset(this.width * 0.3, 0.4*this.height)
        }
        else if(this.angle >= -135 && this.angle <= -45){
            this.body.setSize(this.width * 0.4, this.height * 0.45, true);
            this.body.setOffset(this.width * 0.3, 0.1 * this.height)
        }
        else if (this.angle > 135 || this.angle < -135) {
            this.body.setSize(this.width * 0.4, this.height * 0.45, true);
            this.body.setOffset(this.width * 0.2, 0.25 * this.height)
        }
        else if (this.angle < 45 && this.angle > -45) {
            this.body.setSize(this.width * 0.4, this.height * 0.45, true);
            this.body.setOffset(this.width * 0.4, 0.25 * this.height)
        }

        this.body.setVelocityX(this.speed * Math.cos(this.rotation));
        this.body.setVelocityY(this.speed * Math.sin(this.rotation));
    }

    impact() {
        super.impact();
        this.play('impact', true);       
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
        
    }

}