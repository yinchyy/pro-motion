import FpsText from '../objects/fpsText'

var missile
export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.fpsText = new FpsText(this)
    //missile = this.matter.add.image(0, 600, 'phaser-logo').setBounce(0.3)
    //this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 })
    this.matter.world.setBounds()
    //missile.setFriction(3)
    var cannonHead = this.add.image(60, 621, 'cannon_head').setDepth(1)
    var cannon = this.add.image(60, 669, 'cannon_body').setDepth(1)
    var angle = 0
    var gfx = this.add.graphics().setDefaultStyles({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } })
    var line = new Phaser.Geom.Line()

    this.input.on(
      'pointermove',
      function (pointer) {
        angle = Phaser.Math.Angle.BetweenPoints(cannon, pointer)
        cannonHead.rotation = angle
        Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, 128)
        gfx.clear().strokeLineShape(line)
      },
      this
    )

    this.input.on('pointerdown', pointer => {
      this.matter.setVelocity(this.matter.add.image(200, 300, 'pangball').setCircle(15), 30, -55)
      //this.matter.setVelocity(this.matter.add.circle(0, 600, 25), 30, -55)
      //this.matter.setVelocity(missile, 30, -55)
    })

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: 'white',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
  }
  update() {
    this.fpsText.update()
  }
}
