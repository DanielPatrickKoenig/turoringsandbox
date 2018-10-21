function getDistance (x1, y1, x2, y2) {
  var distx = x2 - x1
  var disty = y2 - y1
  return Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))
}
function getAngle (x1, y1, x2, y2) {
  var distx = x2 - x1
  var disty = y2 - y1
  var masterdist = getDistance(x1, y1, x2, y2)
  var primaryAnglex = distx / masterdist
  var anglex = Math.asin(primaryAnglex) * 180 / Math.PI
  var primaryAngley = disty / masterdist
  var angley = Math.asin(primaryAngley) * 180 / Math.PI
  var resultVal
  if (disty < 0) {
    resultVal = anglex
  } else if (disty >= 0 && distx >= 0) {
    resultVal = angley + 90
  } else if (disty >= 0 && distx < 0) {
    resultVal = (angley * -1) - 90
  }
  return resultVal
}
function getOrbit (_center, _radius, _angle, orbitType) {
  var _num1 = _center
  var _num2 = _radius
  var _num3 = _angle
  var theCent = _num1
  var radius = _num2
  var angle = _num3 - 90
  var ot = orbitType
  var resultVal
  if (ot === 'cos') {
    resultVal = theCent + (Math.cos((angle) * (Math.PI / 180)) * radius)
  }
  if (ot === 'sin') {
    resultVal = theCent + (Math.sin((angle) * (Math.PI / 180)) * radius)
  }
  return resultVal
}
function pointPath (_points) {
  var breaks = []
  var totalDistance = 0
  breaks.push({x: _points[0].x, y: _points[0].y, dist: totalDistance})
  for (var i = 1; i < _points.length; i++) {
    var dist = getDistance(_points[i].x, _points[i].y, _points[i - 1].x, _points[i - 1].y)
    totalDistance += dist
    breaks.push({x: _points[i].x, y: _points[i].y, dist: totalDistance})
  }
  return breaks
}
function plotToPath (_ratio, _points) {
  var _path = pointPath(_points)
  var totalDistance = _path[_path.length - 1].dist
  var _fullRat = totalDistance * _ratio
  var _section = -1
  for (var i = 1; i < _path.length; i++) {
    if (_fullRat <= _path[i].dist && _fullRat > _path[i - 1].dist) {
      _section = i - 1
    }
  }
  var cData = _path[_section]
  var nData = _path[Number(_section + 1)]
  var base = nData.dist - cData.dist
  var diff = _fullRat - cData.dist
  var _newRat = diff / base
  var newPoint = {x: cData.x + ((nData.x - cData.x) * _newRat), y: cData.y + ((nData.y - cData.y) * _newRat)}
  // trace(newPoint.x);
  return newPoint
}
function plotToLine (_startPoint, _endPoint, _anchorPoint, _ratio) {
  var _centerPoint = _startPoint + ((_endPoint - _startPoint) * _ratio)
  var roundUp = _ratio <= 0.5
  var _curveRat = roundUp ? 1 - _ratio : 1 - (1 - _ratio)
  var _realRat = roundUp ? _ratio * 2 : _ratio
  var _pointA = roundUp ? _startPoint : _anchorPoint + (_anchorPoint - _endPoint)
  var _pointB = roundUp ? _anchorPoint : _endPoint
  var basePoint = _pointA + ((_pointB - _pointA) * _realRat)
  // trace(_curveRat);
  var curvePoint = _centerPoint + ((basePoint - _centerPoint) * _curveRat)
  return curvePoint
}
function plotToCurve (_startPoint, _endPoint, _anchorPoint, _ratio) {
  var plotX = plotToLine(_startPoint.x, _endPoint.x, _anchorPoint.x, _ratio)
  var plotY = plotToLine(_startPoint.y, _endPoint.y, _anchorPoint.y, _ratio)
  var curvePoint = {x: plotX, y: plotY}
  return curvePoint
}
function plotToCurvedPath (_ratio, _points, _anchors) {
  var newPoint = {}
  if (_ratio === 0) {
    newPoint = {x: _points[0].x, y: _points[0].y}
  } else {
    var _path = pointPath(_points)
    var totalDistance = _path[_path.length - 1].dist
    var _fullRat = totalDistance * _ratio
    var _section = -1
    for (var i = 1; i < _path.length; i++) {
      if (_fullRat <= _path[i].dist && _fullRat > _path[i - 1].dist) {
        _section = i - 1
      }
    }
    var cData = _path[_section]
    var nData = _path[Number(_section + 1)]
    var base = nData.dist - cData.dist
    var diff = _fullRat - cData.dist
    var _newRat = diff / base
    var currentAnchor = _anchors[_section]
    // var newPoint:Object = {x:cData.x+((nData.x-cData.x)*_newRat), y:cData.y+((nData.y-cData.y)*_newRat)};
    newPoint = plotToCurve(cData, nData, currentAnchor, _newRat)
    if (_section === -1) {
      newPoint = {x: _points[_points.length - 1].x, y: _points[_points.length - 1].y}
    }
  }
  // trace(newPoint.x);
  return newPoint
}
function plotAnchorsAndPoints (_points, _radius) {
  var anchors = []
  var points = []
  points.push({x: _points[0].x, y: _points[0].y})
  for (var i = 0; i < _points.length; i++) {
    var notFirst = i > 0
    var notLast = i < _points.length - 1
    if (notFirst && notLast) {
      anchors.push({x: _points[i - 1].x + ((_points[i].x - _points[i - 1].x) / 2), y: _points[i - 1].y + ((_points[i].y - _points[i - 1].y) / 2)})
      var angleToLast = getAngle(_points[i - 1].x, _points[i - 1].y, _points[i].x, _points[i].y) + 180
      var pointBeforeCurveAnchor = {x: getOrbit(_points[i].x, _radius, angleToLast, 'cos'), y: getOrbit(_points[i].y, _radius, angleToLast, 'sin')}
      points.push(pointBeforeCurveAnchor)
      var angleToNext = getAngle(_points[i + 1].x, _points[i + 1].y, _points[i].x, _points[i].y) + 180
      var pointAfterCurveAnchor = {x: getOrbit(_points[i].x, _radius, angleToNext, 'cos'), y: getOrbit(_points[i].y, _radius, angleToNext, 'sin')}
      points.push(pointAfterCurveAnchor)
      anchors.push({x: _points[i].x, y: _points[i].y})
    }
  }
  anchors.push({x: _points[_points.length - 2].x + ((_points[_points.length - 1].x - _points[_points.length - 2].x) / 2), y: _points[_points.length - 2].y + ((_points[_points.length - 1].y - _points[_points.length - 2].y) / 2)})
  points.push({x: _points[_points.length - 1].x, y: _points[_points.length - 1].y})
  return {points: points, anchors: anchors}
}
export {getDistance, getAngle, getOrbit, pointPath, plotToPath, plotToLine, plotToCurve, plotToCurvedPath, plotAnchorsAndPoints}
