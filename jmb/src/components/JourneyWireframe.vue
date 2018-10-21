<template>
  <div class="joureny-wireframe-component">
    <svg>
      <path v-for="(v, i) in jitems" :key="'path_'+i.toString()" :d="getPathEncoding(v.path)"></path>
    </svg>
    <div v-if="jitems.length > 0">
      <junction :junction="d" ignorestate="true" v-for="(d, i) in jitems" :key="'junction_'+i.toString()"></junction>
    </div>
    <div>
      <dragger v-for="(t, i) in jitems" :key="'itemdragger_'+i.toString()" :activatorstring="'item'+i.toString()" :coords="{left: t.position.x, top: t.position.y}" :size="isSizable(t) ? {width: t.size.width, height: t.size.height} : {width: 50, height: 50}" :dragid="t.id" :activez="z.active" :inactivez="z.inactive-1" bg="transparent" :disabled="false" :signature="signatures.itemMover">
        <div slot="content" class="item-dragger-bounds"></div>
      </dragger>
      <dragger v-if="i == selctedindex && t.type != JourneyElements.SPLIT && isSizable(t)" v-for="(t, i) in jitems" :key="'itemSizedragger_'+i.toString()" :activatorstring="'item'+i.toString()" :coords="{left: Number(t.position.x) - Number(pointSize.width / 2) + Number(t.size.width), top: Number(t.position.y) - Number(pointSize.height / 2) + Number(t.size.height)}" :size="{width: pointSize.width, height: pointSize.height}" :dragid="t.id" :activez="z.active" :inactivez="z.inactive-1" bg="transparent" :disabled="false" :signature="signatures.itemSizer">
        <div slot="content" class="item-size-dragger-bounds"></div>
      </dragger>
      <span v-if="selctedindex >= 0">
        <button v-if="jitems[selctedindex].path.length == 0" v-on:click="onPathButtonClicked(jitems[selctedindex])" class="point-starter-button" :style="getPathbuttonStyle(jitems[selctedindex])"></button>
        <!-- <dragger v-if="jitems[selctedindex].path.length == 0" :activatorstring="'startPoint'+selctedindex.toString()" :coords="{left: Number(jitems[selctedindex].position.x) + Number(jitems[selctedindex].size.width / 2),  top: Number(jitems[selctedindex].position.y) + Number(jitems[selctedindex].size.height / 2)}" :size="{width: pointSize.width * 2, height: pointSize.height * 2}" :dragid="jitems[selctedindex].id" :activez="z.active" :inactivez="z.inactive-1" bg="transparent" :disabled="false" :signature="signatures.pointStarter">
          <div slot="content" class="point-starter-bounds"></div>
        </dragger> -->
      </span>
      <span v-for="(g, j) in jitems" :key="g+'_'+j.toString()">
        <span v-if="j == selctedindex" v-for="(p, i) in jitems[j].path" :key="'selectepathmarker_'+j.toString()+'.'+i.toString()">
          <button v-if="i > 0" v-on:click="onPathButtonClicked(jitems[j], i)" class="point-starter-button" :style="getPathbuttonStyle(jitems[j], i)"></button>
          <dragger :activatorstring="'point'+i.toString()" :coords="{left: p.x - (pointSize.width / 2), top: p.y - (pointSize.height / 2)}" :size="{width: pointSize.width, height: pointSize.height}" :dragid="j.toString()+'_'+i.toString()" :activez="z.active" :inactivez="z.inactive-1" bg="transparent" :disabled="false" :signature="signatures.pointMover">
            <div slot="content" class="point-dragger-bounds"></div>
          </dragger>
        </span>
      </span>
    </div>
  </div>
</template>
<script>
import {EventBus} from './utils/EventBus.js'
import DraggableElement from './DraggableElement.vue'
import Junction from './Junction.vue'
import {JourneyElements} from './utils/JourneyStates.js'
export default {
  props: ['items', 'selctedindex'],
  components: {
    dragger: DraggableElement,
    junction: Junction
  },
  data () {
    return {
      jitems: this.items,
      pointSize: {
        width: 10,
        height: 10
      },
      z: {
        active: 2000,
        inactive: 1
      },
      signatures: {
        pointMover: 'pointmoversignaturestring',
        itemMover: 'itemmoversignaturestring',
        itemSizer: 'itemsizersignaturestring',
        pointStarter: 'pointstartersignaturestring'
      },
      itemMoveOffset: {x: 0, y: 0, origins: []},
      JourneyElements: JourneyElements
    }
  },
  methods: {
    getPathEncoding: function (path) {
      var pathString = 'M '
      for (var i = 0; i < path.length; i++) {
        if (i > 0) {
          pathString += ' L '
        }
        pathString += path[i].x.toString() + ' ' + path[i].y.toString()
      }
      return pathString
    },
    getJunctionIndexByID: function (id) {
      var self = this
      var index = -1
      for (var i = 0; i < self.$data.jitems.length; i++) {
        if (self.$data.jitems[i].id === id) {
          index = i
          // junction = self.$data.journeyData[i]
        }
      }
      return index
    },
    positionItem: function (x, y, id, cOffset) {
      var self = this
      var index = self.getJunctionIndexByID(id)
      // var materIndex = ndx !== undefined && ndx !== null ? ndx : index
      var childOffset = cOffset !== undefined ? cOffset : {x: 0, y: 0}
      if (index >= 0) {
        self.$data.jitems[index].position.x = x
        self.$data.jitems[index].position.y = y
        var moveShift = {x: self.$data.jitems[index].position.x - self.$data.itemMoveOffset.x, y: self.$data.jitems[index].position.y - self.$data.itemMoveOffset.y}
        for (var i = 0; i < self.$data.jitems[index].path.length; i++) {
          if (self.$data.jitems[index].path[i].lock || (cOffset !== undefined && cOffset !== null)) {
            self.$data.jitems[index].path[i].x = Number(self.$data.itemMoveOffset.origins[index].path[i].x) + Number(moveShift.x) - childOffset.x
            self.$data.jitems[index].path[i].y = Number(self.$data.itemMoveOffset.origins[index].path[i].y) + Number(moveShift.y) - childOffset.y
            // self.$data.jitems[index].path[i].x = Number(self.$data.itemMoveOffset.origins[i].x) + Number(moveShift.x)
            // self.$data.jitems[index].path[i].y = Number(self.$data.itemMoveOffset.origins[i].y) + Number(moveShift.y)
          }
        }
        // console.log(self.getDescendants(id))
        var descendants = self.getLockedDescendants(id)
        console.log(descendants)
        for (var j = 0; j < descendants.length; j++) {
          var jindex = self.getJunctionIndexByID(descendants[j])
          var childX = Number(self.$data.itemMoveOffset.origins[jindex].x) + Number(moveShift.x)
          var childY = Number(self.$data.itemMoveOffset.origins[jindex].y) + Number(moveShift.y)
          var childXAlt = Number(self.$data.itemMoveOffset.origins[jindex].x) - Number(self.$data.itemMoveOffset.origins[index].x)
          var childYAlt = Number(self.$data.itemMoveOffset.origins[jindex].y) - Number(self.$data.itemMoveOffset.origins[index].y)
          if (cOffset === undefined || cOffset === null) {
            self.positionItem(childX, childY, descendants[j], {x: childXAlt, y: childYAlt})
          }
        }
      }
    },
    reguildOrigins: function () {
      var self = this
      self.$data.itemMoveOffset.origins = []
      for (var i = 0; i < self.$data.jitems.length; i++) {
        self.$data.itemMoveOffset.origins[i] = {x: self.$data.jitems[i].position.x, y: self.$data.jitems[i].position.y, path: []}
        for (var j = 0; j < self.$data.jitems[i].path.length; j++) {
          self.$data.itemMoveOffset.origins[i].path.push({x: self.$data.jitems[i].path[j].x, y: self.$data.jitems[i].path[j].y})
        }
      }
      // for (var i = 0; i < self.$data.jitems[index].path.length; i++) {
      //   self.$data.itemMoveOffset.origins.push({x: self.$data.jitems[index].path[i].x, y: self.$data.jitems[index].path[i].y})
      // }
    },
    getLockedDescendants: function (id, list) {
      var self = this
      if (list === undefined || list === null) {
        list = []
      }
      var index = self.getJunctionIndexByID(id)
      for (var j = 0; j < self.$data.jitems[index].children.length; j++) {
        var jindex = self.getJunctionIndexByID(self.$data.jitems[index].children[j])
        if (self.$data.jitems[jindex].position.lockToParent) {
          list.push(self.$data.jitems[index].children[j])
          self.getLockedDescendants(self.$data.jitems[index].children[j], list)
        }
      }
      return list
    },
    isSizable: function (junction) {
      var sizable = true
      if (junction.customParams !== undefined) {
        if (junction.customParams.sizable !== undefined) {
          if (junction.customParams.sizable === false) {
            sizable = false
          }
        }
      }
      return sizable
    },
    getPathbuttonStyle: function (junction, index) {
      var styleString = ''
      if (index === undefined || index === null) {
        styleString = 'left:' + (Number(junction.position.x) + Number(junction.size.width / 2)).toString() + 'px;top:' + (Number(junction.position.y) + Number(junction.size.height / 2)).toString() + 'px;'
      } else {
        var xVal = Number(junction.path[index].x) + ((Number(junction.path[index - 1].x) - Number(junction.path[index].x)) / 2)
        var yVal = Number(junction.path[index].y) + ((Number(junction.path[index - 1].y) - Number(junction.path[index].y)) / 2)
        styleString = 'left:' + xVal.toString() + 'px;top:' + yVal.toString() + 'px;'
      }
      return styleString
    },
    onPathButtonClicked: function (junction, index) {
      var isFirstPoint = index === undefined || index === null
      var pointPos = {x: 0, y: 0}
      if (isFirstPoint) {
        pointPos = {x: Number(junction.position.x) + Number(junction.size.width / 2), y: Number(junction.position.y) + Number(junction.size.height / 2)}
        junction.path.push({x: pointPos.x, y: pointPos.y, lock: true})
        junction.path.push({x: pointPos.x - 50, y: pointPos.y, lock: true})
      } else {
        var xVal = Number(junction.path[index].x) + ((Number(junction.path[index - 1].x) - Number(junction.path[index].x)) / 2)
        var yVal = Number(junction.path[index].y) + ((Number(junction.path[index - 1].y) - Number(junction.path[index].y)) / 2)
        pointPos = {x: xVal, y: yVal}
        junction.path.splice(index, 0, {x: pointPos.x, y: pointPos.y, lock: true})
      }
    }
  },
  computed: {
    shouldShowPath: function () {
      var self = this
      return self.$data.jitems.length > 0 && self.$data.selctedindex >= 0 && self.$data.jitems[self.$data.selctedindex].path.length > 0
    },
    getSelectedPath: function () {
      var self = this
      return self.$data.jitems.length > 0 && self.$data.selctedindex >= 0 ? self.$data.jitems[self.$data.selctedindex].path : []
    }
  },
  mounted: function () {
    var self = this
    EventBus.$on('draggable-element-move' + self.$data.signatures.pointMover, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      var itemIndex = Number(n.dragid.split('_')[0])
      var pointIndex = Number(n.dragid.split('_')[1])
      self.$data.jitems[itemIndex].path[pointIndex].x = n.position.left + (self.$data.pointSize.width / 2)
      self.$data.jitems[itemIndex].path[pointIndex].y = n.position.top + (self.$data.pointSize.height / 2)
      console.log(n)
    })
    EventBus.$on('draggable-element-move' + self.$data.signatures.itemMover, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      self.positionItem(n.position.left, n.position.top, n.dragid)
      // var index = self.getJunctionIndexByID(n.dragid)
      // console.log(n.dragid)
      // console.log(index)
      // if (index >= 0) {
      //   self.$data.jitems[index].position.x = n.position.left
      //   self.$data.jitems[index].position.y = n.position.top
      //   var moveShift = {x: self.$data.jitems[index].position.x - self.$data.itemMoveOffset.x, y: self.$data.jitems[index].position.y - self.$data.itemMoveOffset.y}
      //   for (var i = 0; i < self.$data.jitems[index].path.length; i++) {
      //     if (self.$data.jitems[index].path[i].lock) {
      //       self.$data.jitems[index].path[i].x = Number(self.$data.itemMoveOffset.origins[i].x) + Number(moveShift.x)
      //       self.$data.jitems[index].path[i].y = Number(self.$data.itemMoveOffset.origins[i].y) + Number(moveShift.y)
      //     }
      //   }
      // }
      // console.log(n)
    })
    EventBus.$on('draggable-element-down' + self.$data.signatures.itemMover, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      // var index = self.getJunctionIndexByID(n.dragid)
      console.log('went down')
      var index = self.getJunctionIndexByID(n.dragid)
      self.$data.itemMoveOffset.x = self.$data.jitems[index].position.x
      self.$data.itemMoveOffset.y = self.$data.jitems[index].position.y
      self.reguildOrigins()
      // self.$data.itemMoveOffset.origins = []
      // for (var i = 0; i < self.$data.jitems[index].path.length; i++) {
      //   self.$data.itemMoveOffset.origins.push({x: self.$data.jitems[index].path[i].x, y: self.$data.jitems[index].path[i].y})
      // }
      EventBus.$emit('update-selection-index', self.getJunctionIndexByID(n.dragid))
      // self.selctedindex = self.getJunctionIndexByID(n.dragid)
    })
    EventBus.$on('draggable-element-move' + self.$data.signatures.itemSizer, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      var index = self.getJunctionIndexByID(n.dragid)
      // console.log(n.dragid)
      // console.log(index)
      self.$data.jitems[index].size.width = n.position.left - self.$data.jitems[index].position.x
      self.$data.jitems[index].size.height = n.position.top - self.$data.jitems[index].position.y
      // console.log(n)
    })
  }
}
</script>

<style lang="scss" scoped>
div.joureny-wireframe-component{
  position: fixed;
  left:0;
  top:0;
  right:0;
  bottom: 0;
  > svg{
    position: fixed;
    z-index: 224;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    width:100%;
    height: 100%;
    path{
      fill: transparent;
      stroke:#000000;
    }
  }
  > div{
    position: fixed;
    z-index: 225;
    left:0;
    top:0;
    right:0;
    bottom: 0;
  }
}
div.point-dragger-bounds{
  width:10px;
  height: 10px;
  background-color: #cc0000;
}
div.point-starter-bounds{
  width:20px;
  height: 20px;
  background-color: #cc0000;
}
div.item-dragger-bounds{
  width:100%;
  height: 100%;
  background-color: rgba(0,0,0,.2);
}

div.item-size-dragger-bounds{
  width:10px;
  height: 10px;
  background-color: #00cc00;
}
button.point-starter-button{
  position: absolute;
  z-index: 3000;
  width:30px;
  height: 30px;
  margin-top:-15px;
  margin-left:-15px;
}
button.point-starter-button:after{
  content: "\22B6";
}
</style>
