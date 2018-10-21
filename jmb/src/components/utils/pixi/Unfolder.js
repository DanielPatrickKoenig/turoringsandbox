import {TweenLite, Sine, Back} from 'gsap'
function Unfolder (_pm, _src, _size) {
  var pm = _pm
  var src = _src
  var size = _size
  var cellRows = []
  var cellShapes = []
  var startShape = new pm.PIXI.Graphics()
  var pointRows = []
  var pShift = size.height / 6.5// 30
  var sideShift = size.height / 8
  var closeVal = size.height / 2
  var standardDuration = 0.5
  var easeType = Back.easeOut
  var initialEaseType = Sine.easeIn
  var rotationEase = Back.easeOut
  var readyToOpen = true
  var readyToClose = false
  // var shapeGraphics = new pm.PIXI.Graphics()
  var endFrame = {}
  var innerContainer = {}
  var self = this
  this.container = {}
  function rerenderCells () {
    // cellShapes = []
    // shapeGraphics.clear()
    for (var c = 0; c < cellRows.length; c++) {
      // cellShapes.push([])
      for (var _c = 0; _c < cellRows[c].length; _c++) {
        var quad = [{x: pointRows[c][_c].current.x, y: pointRows[c][_c].current.y}, {x: pointRows[c][_c + 1].current.x, y: pointRows[c][_c + 1].current.y}, {x: pointRows[c + 1][_c + 1].current.x, y: pointRows[c + 1][_c + 1].current.y}, {x: pointRows[c + 1][_c].current.x, y: pointRows[c + 1][_c].current.y}]
        cellRows[c][_c].proj.mapBilinearSprite(cellRows[c][_c], quad)
        cellShapes[c][_c].clear()
        var color = 0x000000
        var opacity = 0.5
        switch (c) {
          case 0: {
            switch (_c) {
              case 0: {
                color = 0x000000
                opacity = 0.8
                break
              }
              case 1: {
                color = 0xffffff
                opacity = 0.6
                break
              }
              case 2: {
                color = 0xffffff
                opacity = 0.8
                break
              }
            }
            break
          }
          case 1: {
            switch (_c) {
              case 0: {
                color = 0xffffff
                opacity = 0.8
                break
              }
              case 1: {
                color = 0x000000
                opacity = 0.6
                break
              }
              case 2: {
                color = 0x000000
                opacity = 0.8
                break
              }
            }
            break
          }
        }
        if (cellRows[c][_c].alpha > 0) {
          pm.createPolygon(quad, cellShapes[c][_c], {color: color, opacity: opacity})
          // cellShapes[c][_c] = pm.createPolygon(quad, shapeGraphics)
        }
      }
    }
  }
  function returnToOrigin (x, y, handler) {
    var duration = standardDuration * 1.5
    TweenLite.to(pointRows[y][x].current, duration, {x: pointRows[y][x].origin.x, y: pointRows[y][x].origin.y, ease: easeType})
    TweenLite.to(pointRows[y + 1][x].current, duration, {x: pointRows[y + 1][x].origin.x, y: pointRows[y + 1][x].origin.y, ease: easeType})
    TweenLite.to(pointRows[y + 1][x + 1].current, duration, {x: pointRows[y + 1][x + 1].origin.x, y: pointRows[y + 1][x + 1].origin.y, ease: easeType})
    TweenLite.to(pointRows[y][x + 1].current, duration, {
      x: pointRows[y][x + 1].origin.x,
      y: pointRows[y][x + 1].origin.y,
      onUpdate: function () {
        // cellRows[0][1].alpha = pointRows[0][0].current.x > pointRows[0][1].current.x ? 0 : 1
        rerenderCells()
        cellRows[y][x].alpha = 1
        // cellRows[y][x].proj.mapBilinearSprite(cellRows[y][x], [{x: pointRows[y][x].current.x, y: pointRows[y][x].current.y}, {x: pointRows[y][x + 1].current.x, y: pointRows[y][x + 1].current.y}, {x: pointRows[y + 1][x + 1].current.x, y: pointRows[y + 1][x + 1].current.y}, {x: pointRows[y + 1][x].current.x, y: pointRows[y + 1][x].current.y}])
      },
      onComplete: function (cell) {
        rerenderCells()
        if (handler !== undefined && handler !== null) {
          handler(cell)
        }
      },
      onCompleteParams: [cellRows[y][x]],
      ease: easeType
    })
  }
  this.init = function () {
    self.container = new pm.PIXI.Container()
    innerContainer = new pm.PIXI.Container()
    self.container.rotation = -45 * (Math.PI / 180)
    self.container.scale.set(0.25)
    self.container.addChild(innerContainer)
    endFrame = pm.createImage(src)
    self.container.addChild(endFrame)
    endFrame.alpha = 0
    // pm.app.stage.addChild(container)
    // container.x = 100
    // container.y = 100
    var matrix = pm.createTextureGrid(src, 3, 2, size.width, size.height)
    var footPrint = {width: size.width / matrix[0].length, height: size.height / matrix.length}
    innerContainer.x = footPrint.width * -1
    innerContainer.y = footPrint.height * -1
    // console.log(matrix)
    var h = 0
    var v = 0
    for (var i = 0; i < matrix.length + 1; i++) {
      pointRows.push([])
      if (i < matrix.length) {
        cellRows.push([])
        cellShapes.push([])
      }
      var len = matrix[0].length
      for (var j = 0; j < len; j++) {
        if (i < matrix.length) {
          var cell = pm.createImage2s(matrix[i][j])
          innerContainer.addChild(cell)
          cell.x = h * footPrint.width
          cell.y = v * footPrint.height
          cellRows[v].push(cell)
          var shape = new pm.PIXI.Graphics()
          cellShapes[v].push(shape)
          innerContainer.addChild(shape)
        }
        pointRows[v].push({current: new pm.PIXI.Point((h * footPrint.width) + (Math.random() * 0), (v * footPrint.height) + (Math.random() * 0)), origin: new pm.PIXI.Point(h * footPrint.width, v * footPrint.height)})
        h++
      }
      pointRows[v].push({current: new pm.PIXI.Point((h * footPrint.width) + (Math.random() * 0), (v * footPrint.height) + (Math.random() * 0)), origin: new pm.PIXI.Point(h * footPrint.width, v * footPrint.height)})
      h = 0
      v++
    }
    cellRows[0][0].alpha = 0
    cellRows[0][2].alpha = 0
    cellRows[1][0].alpha = 0
    cellRows[1][2].alpha = 0
    innerContainer.addChild(cellRows[0][1])
    innerContainer.addChild(cellShapes[0][1])
    innerContainer.addChild(cellRows[1][1])
    innerContainer.addChild(cellShapes[1][1])
    cellRows[0][1].alpha = 0
    cellRows[1][1].alpha = 0
    cellShapes[1][1].alpha = 0
    // f58757
    innerContainer.addChild(startShape)
    pm.createPolygon([{x: pointRows[1][1].current.x, y: pointRows[1][1].current.y}, {x: pointRows[2][2].current.x, y: pointRows[2][2].current.y}, {x: pointRows[2][1].current.x, y: pointRows[2][1].current.y}], startShape, {color: 0xf58757})
    // innerContainer.addChild(shapeGraphics)
    // --------------------------
    rerenderCells()
    startShape.interactive = true
    startShape.on('click', foldToggle)
    return this
  }
  function foldToggle () {
    console.log('foldToggle()')
    if (readyToClose) {
      self.fold()
    } else if (readyToOpen) {
      self.unfold()
    }
  }
  this.fold = function () {
    if (readyToClose) {
      readyToClose = false
      // add fold animation
    }
  }
  this.unfold = function () {
    if (readyToOpen) {
      readyToOpen = false
      var startYJump = size.height * 0.6
      var initialDuration = standardDuration
      var conProps = {rotation: self.container.rotation, scale: self.container.scale, x: self.container.x, y: self.container.y}
      TweenLite.to(conProps, initialDuration * 3, {
        rotation: 0,
        scale: 1,
        x: conProps.x + (size.width / -2),
        y: conProps.y + (size.height / -2),
        onUpdate: function () {
          self.container.rotation = conProps.rotation
          self.container.scale.set(conProps.scale)
          self.container.x = conProps.x
          self.container.y = conProps.y
        },
        ease: rotationEase
      })
      TweenLite.to(innerContainer, initialDuration, {x: 0, y: 0})
      TweenLite.to(cellShapes[1][1], initialDuration, {
        alpha: 1,
        onComplete: function () {
          TweenLite.to(cellShapes[1][1], standardDuration * 2.2, {
            alpha: 0,
            onUpdate: function () {
              for (var c = 0; c < cellShapes.length; c++) {
                for (var _c = 0; _c < cellShapes[c].length; _c++) {
                  if (cellShapes[1][1] !== cellShapes[c][_c]) {
                    cellShapes[c][_c].alpha = cellShapes[1][1].alpha
                  }
                }
              }
            }
          })
        }
      })
      TweenLite.to(startShape, initialDuration * 2, {
        alpha: 0,
        onUpdate: function () {
          startShape.clear()
          pm.createPolygon([{x: pointRows[1][1].current.x, y: pointRows[1][1].current.y}, {x: pointRows[1][2].current.x, y: pointRows[1][2].current.y}, {x: pointRows[2][2].current.x, y: pointRows[2][2].current.y}, {x: pointRows[2][1].current.x, y: pointRows[2][1].current.y}], startShape, {color: 0xf58757})
        }
      })
      TweenLite.to(pointRows[0][1].current, initialDuration, {x: pointRows[1][1].current.x + (pShift / 2), y: pointRows[2][1].current.y - startYJump, ease: initialEaseType})
      TweenLite.to(pointRows[0][2].current, initialDuration, {x: pointRows[1][2].current.x - (pShift / 2), y: pointRows[2][2].current.y - startYJump, ease: initialEaseType})
      TweenLite.to(pointRows[2][1].current, initialDuration, {x: pointRows[1][1].current.x + (pShift / 2), y: pointRows[2][1].current.y - startYJump, ease: initialEaseType})
      TweenLite.to(pointRows[2][2].current, initialDuration, {
        x: pointRows[1][2].current.x - (pShift / 2),
        y: pointRows[2][2].current.y - startYJump,
        onUpdate: function () {
          rerenderCells()
        },
        onComplete: function () {
          unfoldPhase2()
        },
        ease: initialEaseType
      })
      for (var p = 0; p < pointRows[1].length; p++) {
        TweenLite.to(pointRows[1][p].current, initialDuration, {x: pointRows[1][p].current.x + sideShift, ease: initialEaseType})
      }
    }
  }
  function unfoldPhase2 () {
    cellRows[0][1].alpha = 1
    returnToOrigin(1, 0)
    returnToOrigin(1, 1)
    var progressProp = {a: 0}
    TweenLite.to(progressProp, standardDuration * 0.3, {
      a: 1,
      onComplete: function () {
        pointRows[0][0].current.x = pointRows[0][1].current.x + closeVal
        pointRows[0][0].current.y = pointRows[0][1].current.y + (pShift * 2)
        pointRows[1][0].current.x = pointRows[1][1].current.x + closeVal
        pointRows[1][0].current.y = pointRows[1][1].current.y
        returnToOrigin(0, 0)
        pointRows[1][0].current.x = pointRows[1][1].current.x + closeVal
        pointRows[1][0].current.y = pointRows[1][1].current.y
        pointRows[2][0].current.x = pointRows[2][1].current.x + closeVal
        pointRows[2][0].current.y = pointRows[2][1].current.y - (pShift * 2)
        returnToOrigin(0, 1)
        pointRows[0][3].current.x = pointRows[0][2].current.x - closeVal
        pointRows[0][3].current.y = pointRows[0][2].current.y + (pShift * 2)
        pointRows[1][3].current.x = pointRows[1][2].current.x - closeVal
        pointRows[1][3].current.y = pointRows[1][2].current.y
        returnToOrigin(2, 0)
        pointRows[1][3].current.x = pointRows[1][2].current.x - closeVal
        pointRows[1][3].current.y = pointRows[1][2].current.y
        pointRows[2][3].current.x = pointRows[2][2].current.x - closeVal
        pointRows[2][3].current.y = pointRows[2][2].current.y - (pShift * 2)
        returnToOrigin(2, 1)
        var endFrameProps = {a: 0}
        TweenLite.to(endFrameProps, standardDuration * 1.4, {
          a: 1,
          onComplete: function () {
            endFrame.alpha = 1
            endFrame.width = size.width
            endFrame.height = size.height
            innerContainer.alpha = 0
            readyToClose = true
            startShape.clear()
            pm.createPolygon([{x: 0, y: 0}, {x: size.width, y: 0}, {x: size.width, y: size.height}, {x: 0, y: size.height}], startShape, {color: 0xf58757})
          }
        })
      }
    })
  }
}
export {Unfolder}
