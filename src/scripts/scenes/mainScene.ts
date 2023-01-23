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
    var curve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(60, 620),
      new Phaser.Math.Vector2(150, 350),
      new Phaser.Math.Vector2(200, 700)
    )

    this.input.on(
      'pointermove',
      function (pointer) {
        angle = Phaser.Math.Angle.BetweenPoints(cannonHead, pointer)
        cannonHead.rotation = angle
        Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, 128)
        //gfx.clear().strokeLineShape(line)
        let p1x = -((Math.pow(50, 2) / 9.81) * Math.sin(2 * angle)) * 3.17
        console.log(Phaser.Math.RadToDeg(angle))
        let p1y = 620 - (3.17 * Math.pow(Math.sin(angle) * 50, 2)) / (2 * 9.81)
        console.log(`y: ${Math.pow(Math.sin(angle) * 50, 2) / (2 * 9.81)}, calculated: ${p1y}`)
        curve.p1 = new Phaser.Math.Vector2(p1x / 2, p1y)
        //   curve.p1 = new Phaser.Math.Vector2(
        //     -(60 + (Math.pow(50, 2) / 9.81) * Math.sin(2 * angle)) / 2,
        //     100 + Math.pow(50 * Math.sin(angle), 2) / (2 * 9.81)
        //   )
        // curve.p1 = new Phaser.Math.Vector2(
        //   p1x / 2,
        //   (Math.tan(angle) - ((p1x / 2 / (2 * 50 * Math.cos(angle))) * (p1x / 2 - 60) - 100)) /
        //     Phaser.Math.RadToDeg(angle)
        // )
        //curve.p2 = new Phaser.Math.Vector2(-(Math.pow(50, 2) / 9.81) * Math.sin(2 * angle), 700)
        curve.p2 = new Phaser.Math.Vector2(p1x, 620)
        gfx.clear()
        curve.draw(gfx)
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
