import FpsText from '../objects/fpsText'
import dat from 'dat.gui'
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
    var data = { angle: '0', velocity: 50, velocity_y: 0, velocity_x: 0, range: '0', peak: '0' }
    var sketch = this.add.graphics().setDefaultStyles({ lineStyle: { width: 6, color: 0x8fa3a5 } })
    var line = new Phaser.Geom.Line()
    let mToPxRatio = 1.7
    const drawTrajectory = () => {
      sketch.clear()
      const pos = (x: number) => {
        return (
          mToPxRatio * x * Math.tan(angle) -
          (-9.81 / (2 * Math.pow(Math.cos(angle) * data.velocity, 2))) * Math.pow(x, 2)
        )
      }
      if (angle > 1.25 && angle < 1.85) {
        return
      }
      if (angle >= -1.565 && angle <= 1.25) {
        for (let x = 0; x < 490; x += 3) {
          if (pos(x) + 620 >= 720) {
            break
          }
          line.setTo(mToPxRatio * x + 60, pos(x) + 620, mToPxRatio * (x + 2) + 60, pos(x + 2) + 620)
          sketch.strokeLineShape(line)
        }
      } else {
        for (let x = 0; x > -490; x -= 3) {
          if (pos(x) + 620 >= 720) {
            break
          }
          line.setTo(mToPxRatio * x + 60, pos(x) + 620, mToPxRatio * (x + 2) + 60, pos(x + 2) + 620)
          sketch.strokeLineShape(line)
        }
      }
    }
    const refreshDataValues = () => {
      data.velocity_y = Math.sin(angle) * data.velocity
      data.velocity_x = Math.cos(angle) * data.velocity
      data.range = `${(-(Math.pow(data.velocity, 2) / 9.81) * Math.sin(2 * angle)).toFixed(2)}m`
      if (Phaser.Math.RadToDeg(-angle) < 0) {
        data.peak = `0.00m`
      } else {
        data.peak = `${(Math.pow(data.velocity_y, 2) / (2 * 9.81)).toFixed(2)}m`
      }
    }

    this.input.on(
      'pointermove',
      function (pointer) {
        angle = Phaser.Math.Angle.BetweenPoints(cannonHead, pointer)
        data.angle = `${Phaser.Math.RadToDeg(-angle).toFixed(2)}deg`
        cannonHead.rotation = angle
        refreshDataValues()
        drawTrajectory()
      },
      this
    )

    this.input.on('pointerdown', pointer => {
      let ball = this.matter.add.image(60, 620, 'pangball')
      ball.setCircle(15)
      this.matter.setVelocity(ball, data.velocity_x, data.velocity_y)
      //  let ball = this.matter.add.image(40, 630, 'pangball')
      //  ball.setCircle(15)
      //  ball.setMass(10)
      //  this.matter.applyForce(ball, {
      //    x: Math.cos(angle) * 3,
      //    y: Math.sin(angle) * 3
      //  })
    })
    this.input.on('wheel', event => {
      if (event.deltaY < 0) {
        data.velocity += 2
      }
      if (event.deltaY > 0) {
        data.velocity -= 2
      }
      refreshDataValues()
      drawTrajectory()
    })

    var gui = new dat.GUI()
    var p1 = gui.addFolder('Missile trajectory data')
    p1.add(data, 'angle').listen()
    p1.add(data, 'velocity').listen()
    p1.add(data, 'velocity_x').listen()
    p1.add(data, 'velocity_y').listen()
    p1.add(data, 'range').listen()
    p1.add(data, 'peak').listen()
    p1.open()
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
