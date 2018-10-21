<template>
  <div :style="liveRenderStyle">
    <div :style="contentLayerStyle" class="content-layer html-layer">
      <junction :junction="d" v-for="(d, i) in journeyData" :key="'junction_'+i.toString()"></junction>
    </div>
    <div :style="contentLayerStyle" class="content-layer canvas-layer" :id="canvasID"></div>
  </div>
</template>
<script>
import {EventBus} from './utils/EventBus.js'
import {PixiManager} from './utils/pixi/PixiHelper.js'
import {Snake} from './utils/Snake.js'
// import {Unfolder} from './utils/pixi/Unfolder.js'
import {JourneyElements, JourneyElementStates} from './utils/JourneyStates.js'
import {JunctionManifest} from './JunctionManifest.js'
import Junction from './Junction.vue'
export default {
  props: ['jdata'],
  components: {
    junction: Junction
  },
  data () {
    return {
      pixiManager: {},
      canvasID: 'stage_' + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join(''),
      windowProps: {scale: 1, standardHeight: 938, width: 1600, height: 1000},
      JourneyElements: JourneyElements,
      JourneyElementStates: JourneyElementStates,
      snake: {},
      journeyData: this.jdata
    }
  },
  methods: {
    drawLine: function (points, props, graphics) {
      var self = this
      var weight = props.weight !== undefined && props.weight !== null ? props.weight : 1
      var color = props.color !== undefined && props.colr !== null ? props.color : 0x000000
      var g = graphics === undefined || graphics === null ? self.graphics() : graphics
      g.clear()
      g.lineStyle(weight, color, 1)
      g.moveTo(points[0].x, points[0].y)
      for (var i = 1; i < points.length; i++) {
        g.lineTo(points[i].x, points[i].y)
      }
      self.$data.pixiManager.app.stage.addChild(g)
    },
    graphics: function () {
      var self = this
      return new self.$data.pixiManager.PIXI.Graphics()
    },
    getJunctionByID: function (id) {
      var self = this
      var junction = {}
      for (var i = 0; i < self.$data.journeyData.length; i++) {
        if (self.$data.journeyData[i].id === id) {
          junction = self.$data.journeyData[i]
        }
      }
      return junction
    },
    getJunctionIndexByID: function (id) {
      var self = this
      var junctionIndex = -1
      for (var i = 0; i < self.$data.journeyData.length; i++) {
        if (self.$data.journeyData[i].id === id) {
          junctionIndex = i
        }
      }
      return junctionIndex
    },
    executeJunction: function (id, snake) {
      var self = this
      var junction = self.getJunctionByID(id)
      snake.drawPath(junction.path, function () {
        junction.state = JourneyElementStates.OPEN
        var i = 0
        if (junction.autoAdvance) {
          for (i = 0; i < junction.children.length; i++) {
            self.executeJunction(junction.children[i], snake)
          }
        } else {
          for (i = 0; i < junction.children.length; i++) {
            // console.log(junction.children[i])
            // console.log(self.getJunctionByID(junction.children[i]).path)
            if (self.getJunctionByID(junction.children[i]).path.length === 0) {
              self.executeJunction(junction.children[i], snake)
            }
          }
          switch (junction.type) {
            case JourneyElements.SPLIT:
            {
              for (i = 0; i < junction.children.length; i++) {
                self.executeJunction(junction.children[i], snake)
              }
              break
            }
            case JourneyElements.MESSAGE:
            {
              // var unfolder = new Unfolder(self.$data.pixiManager, junction.content, {width: 300, height: 200}).init()
              // self.$data.pixiManager.app.stage.addChild(unfolder.container)
              // unfolder.container.x = junction.position.x
              // unfolder.container.y = junction.position.y
              break
            }
            case JourneyElements.JUNCTION:
            {
              if (junction.junctionID >= 0) {
                var jctn = JunctionManifest[junction.junctionID].method(self.$data.pixiManager, junction)
                // junction.sizable = JunctionManifest[junction.junctionID].sizable
                self.$data.pixiManager.app.stage.addChild(jctn)
                jctn.x = junction.position.x
                jctn.y = junction.position.y
                if (JunctionManifest[junction.junctionID].params.clickable) {
                  jctn.interactive = true
                  jctn.on('click', function (e) {
                    self.onJourneyMapElementClicked(junction)
                  })
                }
              }
              // var jnctn = JunctionManifest
              // var img = self.$data.pixiManager.createImage(junction.content)
              // self.$data.pixiManager.app.stage.addChild(img)
              // img.x = junction.position.x
              // img.y = junction.position.y
              break
            }
            case JourneyElements.YOUTUBE:
            case JourneyElements.VIMEO:
            {
              break
            }
            case JourneyElements.HTML:
            {
              break
            }
          }
        }
      })
    },
    onJourneyMapElementClicked: function (junction) {
      var self = this
      for (var i = 0; i < junction.children.length; i++) {
        var subJunction = self.getJunctionByID(junction.children[i])
        if (subJunction.state !== JourneyElementStates.OPEN) {
          self.executeJunction(junction.children[i], self.$data.snake)
        }
      }
    },
    init: function () {
      var self = this
      self.$data.snake = new Snake(self.drawLine)
      self.$data.snake.setLineProperties({color: 0xff0000, weight: 2})
      // self.executeJunction('j0000', self.$data.snake)
      self.$data.pixiManager = new PixiManager().init(document.getElementById(self.$data.canvasID), self.$data.windowProps.width, self.$data.windowProps.height)
      window.addEventListener('resize', function (e) {
        self.$data.windowProps.scale = window.innerHeight / self.$data.windowProps.standardHeight
      })
      self.$data.windowProps.scale = window.innerHeight / self.$data.windowProps.standardHeight
      EventBus.$on('on-junction-clicked', (n) => {
        self.onJourneyMapElementClicked(n)
      })
    }
  },
  computed: {
    liveRenderStyle: function () {
      var self = this
      var size = {width: self.$data.windowProps.width, height: self.$data.windowProps.height}
      return 'position:fixed;height:' + size.height.toString() + 'px;width:' + size.width.toString() + 'px;transform: scale(' + self.$data.windowProps.scale + ');left:50%;top:50%;margin-top:-' + (size.height / 2).toString() + 'px;margin-left:-' + (size.width / 2).toString() + 'px;'
    },
    contentLayerStyle: function () {
      var self = this
      return 'height:' + self.$data.windowProps.height.toString() + 'px;width:' + self.$data.windowProps.width.toString() + 'px;'
    }
  },
  mounted: function () {
    var self = this
    self.init()
  }
}
</script>
<style lang="scss" scoped>
.content-layer{
  position:absolute;
  left:0;
  top:0;
  
}
.html-layer{
  > div{
    z-index: 200;
    position: absolute;
  }
  > div.video-junction{
    background-color:#000000;
  }
  > div.image-junction{
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>

