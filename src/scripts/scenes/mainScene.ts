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
    var sketch = this.add.graphics().setDefaultStyles({ lineStyle: { width: 6, color: 0x8fa3a5 } })
    var line = new Phaser.Geom.Line()
    let mToPxRatio = 1.7

    this.input.on(
      'pointermove',
      function (pointer) {
        angle = Phaser.Math.Angle.BetweenPoints(cannonHead, pointer)
        cannonHead.rotation = angle
        sketch.clear()
        const pos = (x: number) => {
          return mToPxRatio * x * Math.tan(angle) - (-9.81 / (2 * Math.pow(Math.cos(angle) * 50, 2))) * Math.pow(x, 2)
        }
        for (let x = 0; x < 490; x += 3) {
          line.setTo(mToPxRatio * x + 60, pos(x) + 620, mToPxRatio * (x + 2) + 60, pos(x + 2) + 620)
          sketch.strokeLineShape(line)
        }
      },
      this
    )

    this.input.on('pointerdown', pointer => {
      let ball = this.matter.add.image(60, 620, 'pangball')
      ball.setCircle(15)
      this.matter.setVelocity(ball, Math.cos(angle) * 50, Math.sin(angle) * 50)
      console.log(
        `x:${Math.cos(angle) * 50}, y:${Math.sin(angle) * 50}, distance: ${
          -(Math.sin(2 * angle) * Math.pow(50, 2)) / 9.81
        }, phaser distance:${Phaser.Math.Distance.BetweenPoints(cannonHead, ball)}`
      )
      //  let ball = this.matter.add.image(40, 630, 'pangball')
      //  ball.setCircle(15)
      //  ball.setMass(10)
      //  this.matter.applyForce(ball, {
      //    x: Math.cos(angle) * 3,
      //    y: Math.sin(angle) * 3
      //  })
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
