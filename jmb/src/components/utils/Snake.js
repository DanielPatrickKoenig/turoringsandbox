import {TweenLite} from 'gsap'
import {plotAnchorsAndPoints, plotToCurvedPath} from './Trig.js'
function Snake (drawMethod, target) {
  var drawingTarget = target
  var lineProperties = {}
  function animateLine (points, graphics, id, handler) {
    // /*
    var progressProps = {p: 0.00001}
    TweenLite.to(progressProps, 0.5, {
      p: 1,
      onComplete: function (obj) {
        handler(obj)
      },
      onCompleteParams: [{points: points, graphics: graphics, id: id}],
      onUpdate: function () {
        var progress = progressProps.p
        var currentPoints = []
        for (var i = 0; i < points.length * progress; i++) {
          currentPoints.push(points[i])
        }
        drawMethod(currentPoints, lineProperties, target)
      }
    })
    // */
    // self.drawDot(200, 120)
    // console.log('mp called')
  }
  this.setLineProperties = function (props) {
    lineProperties = props
  }
  this.drawPath = function (path, handler) {
    if (path.length > 0) {
      var anchorPointMatrix = plotAnchorsAndPoints(path, 30)
      // /*
      var steps = 150
      var finalPoints = [{x: path[0].x, y: path[0].y}]
      for (var i = 1; i < steps; i++) {
        var ratio = (1 / steps) * i
        var coords = plotToCurvedPath(ratio, anchorPointMatrix.points, anchorPointMatrix.anchors)
        finalPoints.push(coords)
      }
      finalPoints.push({x: path[path.length - 1].x, y: path[path.length - 1].y})
      animateLine(finalPoints, drawingTarget, 'test_line_1', handler)
    } else {
      handler()
    }
  }
}
export {Snake}
