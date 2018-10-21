<template>
  <div v-if="shouldShow(JourneyElements.IMAGE)" :class="renderClasses('image-junction')" :style="'left:'+junction.position.x+'px;top:'+junction.position.y+'px;width:'+junction.size.width+'px;height:'+junction.size.height+'px;background-image:url('+junction.content+');'" v-on:click="onJunctionClicked()"></div>
  <div v-else-if="shouldShow(JourneyElements.HTML)" :class="renderClasses('html-junction')" :style="'left:'+junction.position.x+'px;top:'+junction.position.y+'px;width:'+junction.size.width+'px;height:'+junction.size.height+'px;'" v-html="junction.content" v-on:click="onJunctionClicked()"></div>
  <div v-else-if="shouldShow(JourneyElements.YOUTUBE)" :class="renderClasses('video-junction')" :style="'left:'+junction.position.x+'px;top:'+junction.position.y+'px;width:'+junction.size.width+'px;height:'+junction.size.height+'px;'">
    <iframe :width="junction.size.width" :height="junction.size.height" :src="junction.content" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
  </div>
  <div v-else-if="shouldShow(JourneyElements.SPLIT)" :class="renderClasses('split-junction')" :style="'left:'+junction.position.x+'px;top:'+junction.position.y+'px;width:'+splitSize.width+'px;height:'+splitSize.height+'px;'">
    <div>
      <span v-if="ignorestate"></span>
      <span v-if="ignorestate"></span>
    </div>
  </div>
  <div v-else-if="shouldShow(JourneyElements.JUNCTION) && ignorestate" :class="renderClasses('junction-junction')" :style="'left:'+junction.position.x+'px;top:'+junction.position.y+'px;width:'+splitSize.width+'px;height:'+splitSize.height+'px;'">
    <div>
      X
    </div>
  </div>
</template>
<script>
import {EventBus} from './utils/EventBus.js'
import {JourneyElements, JourneyElementStates} from './utils/JourneyStates.js'
export default {
  props: ['junction', 'ignorestate'],
  data () {
    return {
      JourneyElements: JourneyElements,
      splitSize: {width: 50, height: 50}
    }
  },
  methods: {
    onJunctionClicked: function () {
      var self = this
      EventBus.$emit('on-junction-clicked', self.junction)
    },
    shouldShow: function (t) {
      var self = this
      return self.junction.type === t && (self.junction.state === JourneyElementStates.OPEN || self.ignorestate)
    },
    renderClasses: function (extraClass) {
      var xtr = extraClass !== undefined && extraClass !== null ? extraClass + ' ' : ''
      return xtr + 'junction-element'
    }
  }
}
</script>
<style lang="scss" scoped>
div.junction-element{
  z-index: 200;
  position: absolute;
  opacity:1;
  animation-name: fade-in;
  animation-duration: 2s;

}
@keyframes fade-in {
    from {opacity: 0;}
    to {opacity: 1;}
}
div.video-junction{
  background-color:#000000;
}
div.image-junction{
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
div.split-junction{
  div{
    width:100%;
    height: 100%;
    position: relative;
    > span{
      display: block;
      font-size: 45px;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 50%;
      margin-top:-5px;
    }
    > span:last-child{
      margin-top:13px;
    }
    > span:first-child::after{
      content: "\2934";
    }
    > span:last-child::after{
      content: "\2935";
    }
  }
}
</style>

