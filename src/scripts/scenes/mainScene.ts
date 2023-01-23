import FpsText from '../objects/fpsText'

var missile
export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.fpsText = new FpsText(this)
    this.matter.world.setBounds()
    var cannonHead = this.add.image(60, 621, 'cannon_head').setDepth(1)
    var cannon = this.add.image(60, 669, 'cannon_body').setDepth(1)
    var angle = 0
    var gfx = this.add.graphics().setDefaultStyles({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } })
    var line = new Phaser.Geom.Line()

    this.input.on(
      'pointermove',
      function (pointer) {
        angle = Phaser.Math.Angle.BetweenPoints(cannonHead, pointer)
        cannonHead.rotation = angle
        Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, 128)
        gfx.clear().strokeLineShape(line)
      },
      this
    )

    this.input.on('pointerdown', pointer => {
      this.matter.setVelocity(
        this.matter.add.image(40, 630, 'pangball').setCircle(15),
        Math.cos(angle) * 50,
        Math.sin(angle) * 50
      )
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
