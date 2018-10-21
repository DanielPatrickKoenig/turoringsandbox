import 'pixi.js'
import PIXI from 'pixi-projection'
function PixiManager () {
  console.log(PIXI)
  // var PIXI = require('pixi.js')
  this.PIXI = require('pixi.js')
  this.app = {}
  this.renderer = {}
  var self = this
  function getDefaultProperties () {
    return {
      color: 0x000000,
      opacity: 1,
      x: 0,
      y: 0,
      radius: 72,
      strokeColor: 0x000000,
      strokeOpacity: 0,
      strokeWidth: 1
    }
  }
  this.init = function (el, _width, _height) {
    var width = _width !== undefined && _width !== null ? _width : 800
    var height = _height !== undefined && _height !== null ? _height : 600
    self.PIXI = require('pixi.js')
    self.app = new this.PIXI.Application(width, height, {antialias: true, backgroundColor: 0xeeeeee})
    el.appendChild(self.app.view)
    self.renderer = self.PIXI.autoDetectRenderer(width, height)
    console.log(self.renderer)
    // renderer.backgroundColor = 0xCCCCCC
    // el.appendChild(renderer.view)
    // self.app = new PIXI.Container()
    // renderer.render(self.app)
    return self
  }
  this.createImage = function (src) {
    var texture = src.textureCacheIds !== undefined && src.textureCacheIds !== null ? src : self.PIXI.Texture.fromImage(src)
    return new self.PIXI.Sprite(texture)
  }
  // /*
  this.createImage2s = function (src) {
    // console.log(self.PIXI.projection)
    var texture = src.textureCacheIds !== undefined && src.textureCacheIds !== null ? src : self.PIXI.Texture.fromImage(src)
    var spt = new self.PIXI.projection.Sprite2s(texture)
    // spt.anchor.set(0.5)
    return spt
  }
  // */
  this.createCircle = function (props) {
    var properties = getDefaultProperties()
    if (props !== undefined && props !== null) {
      for (var p in properties) {
        properties[p] = props[p]
      }
    }
    var g = new self.PIXI.Graphics()
    g.lineStyle(properties.strokeWidth, properties.strokeColor, properties.strokeOpacity)
    g.beginFill(properties.color, properties.opacity)
    g.drawCircle(properties.x, properties.y, properties.radius)
    g.endFill()
    console.log(g)
    return g
  }
  this.createPolygon = function (points, graphics, props) {
    var properties = getDefaultProperties()
    if (props !== undefined && props !== null) {
      for (var p in properties) {
        properties[p] = props[p]
      }
    }
    var noGraphics = graphics === undefined || graphics === null
    var g = noGraphics ? new self.PIXI.Graphics() : graphics
    if (noGraphics) {
      g.clear()
    }
    g.lineStyle(properties.strokeWidth, properties.strokeColor, properties.strokeOpacity)
    g.beginFill(properties.color, properties.opacity)
    g.moveTo(points[0].x, points[0].y)
    for (var i = 1; i < points.length; i++) {
      g.lineTo(points[i].x, points[i].y)
    }
    g.lineTo(points[0].x, points[0].y)
    g.endFill()
    return g
  }
  this.createTextureGrid = function (src, columns, rows, width, height) {
    var fullTexture = self.PIXI.Texture.fromImage(src)
    var matrix = []
    var cellSize = {width: width / columns, height: height / rows}
    var left = 0
    var top = 0
    for (var i = 0; i < rows; i++) {
      var subMatrix = []
      for (var j = 0; j < columns; j++) {
        var cellLeft = left * cellSize.width
        var cellTop = top * cellSize.height
        var subTexture = new self.PIXI.Texture(fullTexture, new self.PIXI.Rectangle(cellLeft, cellTop, cellSize.width, cellSize.height))
        subMatrix.push(subTexture)
        left++
      }
      top++
      left = 0
      matrix.push(subMatrix)
    }
    return matrix
  }
  this.createRenderer = function () {
    var renderer = self.PIXI.autoDetectRenderer(90, 120)
    renderer.backgroundColor = 0xCCCCCC
    // console.log(renderer)
    return renderer
  }
}
export {PixiManager}
