import FpsText from '../objects/fpsText'

var missile
export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.fpsText = new FpsText(this)
    missile = this.matter.add.image(0, 600, 'phaser-logo').setBounce(0.3)
    //this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 })
    this.matter.world.setBounds()
    missile.setFriction(3)
    this.input.on('pointerdown', pointer => {
      this.matter.setVelocity(missile, 30, -55)
    })

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
  }

  update() {
    this.fpsText.update()
  }
}
