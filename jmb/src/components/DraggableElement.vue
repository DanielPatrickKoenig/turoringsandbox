<template>
  <div class="sizing-handle-container">
    <div class="sizing-content" v-bind:style="'left:' + position.left.toString() + 'px; top:' + position.top.toString() + 'px; width:' + size.width + 'px; height:' + size.height + 'px;'">
      <slot name="content"></slot>
    </div>
    <div v-if="!disabled" class="sizing-handle" v-on:mousedown="onDown" v-bind:style="'left:' + position.left.toString() + 'px; top:' + position.top.toString() + 'px; width:' + size.width + 'px; height:' + size.height + 'px; background-color:' + bg + '; box-shadow: 0 0 0 1px ' + border">
    </div>
    <div :id="activatorID" class="sizing-releaser" v-on:mouseup="onUp" v-on:mousemove="onMove" v-bind:style="'z-index:' + zIndex"></div>
  </div>
</template>
<script>
import {EventBus} from './utils/EventBus.js'
export default {
  data () {
    return {
      zIndex: this.inactivez,
      activatorID: 'd_' + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join(''),
      position: {
        left: this.coords.left,
        top: this.coords.top
      },
      offset: {
        x: 0,
        y: 0
      }
    }
  },
  props: ['coords', 'size', 'dragid', 'activez', 'inactivez', 'bg', 'border', 'disabled', 'signature', 'activatorstring'],
  methods: {
    getSignature: function () {
      var self = this
      return self.signature === undefined ? '' : self.signature
    },
    onDown: function (e) {
      console.log('####### down')
      var self = this
      self.activateDrag(e.currentTarget.getBoundingClientRect().left - e.pageX, e.currentTarget.getBoundingClientRect().top - e.pageY)
      // document.getElementById(self.$data.activatorID).style.display = 'block'
      // self.$data.zIndex = this.activez
      // self.$data.offset.x = e.currentTarget.getBoundingClientRect().left - e.pageX
      // self.$data.offset.y = e.currentTarget.getBoundingClientRect().top - e.pageY
      // EventBus.$emit('draggable-element-down' + self.getSignature(), {dragid: this.dragid, position: self.$data.position})
    },
    activateDrag: function (x, y) {
      var self = this
      document.getElementById(self.$data.activatorID).style.display = 'block'
      // e.currentTarget.parentNode.children[2].style.display = 'block'
      self.$data.zIndex = self.activez
      self.$data.offset.x = x
      self.$data.offset.y = y
      EventBus.$emit('draggable-element-down' + self.getSignature(), {dragid: self.dragid, position: self.$data.position})
    },
    onUp: function (e) {
      console.log('####### up')
      var self = this
      e.currentTarget.parentNode.children[2].style.display = 'none'
      self.$data.zIndex = this.inactivez
      EventBus.$emit('draggable-element-up' + self.getSignature(), {dragid: this.dragid, position: self.$data.position})
    },
    onMove: function (e) {
      var self = this
      self.$data.position.left = e.pageX - e.currentTarget.parentNode.getBoundingClientRect().left + self.$data.offset.x
      self.$data.position.top = e.pageY - e.currentTarget.parentNode.getBoundingClientRect().top + self.$data.offset.y
      console.log(self.getSignature())
      EventBus.$emit('draggable-element-move' + self.getSignature(), {dragid: this.dragid, position: self.$data.position})
    },
    activatorListener: function () {
      var self = this
      if (self.activatorstring !== null && self.activatorstring !== undefined && self.activatorstring.split('/').length > 1) {
        self.activateDrag(Number(self.activatorstring.split('/')[0]), Number(self.activatorstring.split('/')[1]))
      }
    }
  },
  watch: {
    coords: function (val, oldVal) {
      var self = this
      self.$data.position = self.coords
    },
    activatorstring: function () {
      var self = this
      self.activatorListener()
      // if (self.activatorstring !== null && self.activatorstring !== undefined && self.activatorstring.split('/').length > 1) {
      //   self.activateDrag(Number(self.activatorstring.split('/')[0]), Number(self.activatorstring.split('/')[1]))
      // }
    }
  },
  mounted: function () {
    var self = this
    self.activatorListener()
    // if (self.activatorstring !== null && self.activatorstring !== undefined && self.activatorstring.split('/').length > 1) {
    //   self.activateDrag(Number(self.activatorstring.split('/')[0]), Number(self.activatorstring.split('/')[1]))
    // }
  }
}
</script>
<style lang="scss">
.sizing-handle-container{
  position: relative;
  > div{
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }
  > div.sizing-handle{
    position: absolute;
    z-index:50;
  }
  > div.sizing-content{
    position: absolute;
    z-index:40;
  }
  > div.sizing-releaser{
    position: fixed;
    left:0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    display: none;
  }
}
</style>


