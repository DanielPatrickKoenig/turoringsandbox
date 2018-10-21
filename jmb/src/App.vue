<template>
  <div>
    <div class="preview-toggle">
      <label><input type="checkbox" v-model="preview" v-on:change="previewToggle" />Preview</label>
    </div>
    <journey v-if="preview" :jdata="journeyData"></journey>
    <journeybuilder v-else :jdata="journeyData"></journeybuilder>
  </div>
</template>

<script>
import {JourneyElementStates} from './components/utils/JourneyStates.js'
import JourneyPlayer from './components/JourneyPlayer.vue'
import JourneyBuilder from './components/JourneyBuilder.vue'
export default {
  name: 'app',
  components: {
    journey: JourneyPlayer,
    journeybuilder: JourneyBuilder
  },
  data () {
    return {
      preview: true,
      // journeyData: []
      journeyData: JSON.parse('[{"id":"app_online","type":6,"state":0,"position":{"x":35,"y":482},"size":{"width":"130","height":"130"},"content":"src/assets/images/fillOutApp.svg","path":[],"children":["app_in_mail","online_app_txt"],"startingPoint":true},{"id":"app_in_mail","type":6,"state":-1,"position":{"x":36,"y":331},"size":{"width":"130","height":"130"},"content":"src/assets/images/fillOutAppInMail.svg","path":[{"x":103,"y":507,"lock":true},{"x":103,"y":435,"lock":true}],"children":["meet_advisor","app_mail_txt"],"startingPoint":false,"autoAdvance":true},{"id":"meet_advisor","type":6,"state":-1,"position":{"x":39,"y":187},"size":{"width":"130","height":"130"},"content":"src/assets/images/meetAdvisor.svg","path":[{"x":105,"y":366,"lock":true},{"x":105,"y":290,"lock":true}],"children":["meet_advisor_txt","consumer_mindset"],"startingPoint":false,"autoAdvance":true},{"id":"consumer_mindset","type":5,"state":-1,"position":{"x":340,"y":149},"size":{"width":105,"height":40},"content":"CONSUMER<br />MINDSET","path":[{"x":105,"y":204,"lock":false},{"x":108,"y":165,"lock":true},{"x":331,"y":166,"lock":true}],"children":["monitor1","sizableimage"],"startingPoint":false,"autoAdvance":false},{"id":"monitor1","type":6,"state":-1,"position":{"x":483,"y":267,"lockFirstPointToParent":true},"size":{"width":276,"height":252},"content":"src/assets/images/monitor.svg","path":[{"x":437,"y":167,"lock":true},{"x":576,"y":168,"lock":true},{"x":576,"y":280,"lock":true}],"children":["approval_or_denial","video1"],"startingPoint":false,"autoAdvance":true},{"id":"approval_or_denial","type":6,"state":-1,"position":{"x":790,"y":118,"lockToParent":true,"lockFirstPointToParent":true},"size":{"width":"130","height":"130"},"content":"src/assets/images/aprovalOrDenial.svg","path":[{"x":766,"y":377,"lock":true},{"x":858,"y":377,"lock":true},{"x":857,"y":242,"lock":true}],"children":["approved_txt","denied_txt","unfolder1"],"startingPoint":false,"autoAdvance":false},{"id":"online_app_txt","type":5,"state":-1,"position":{"x":159,"y":549},"size":{"width":186,"height":67},"content":"FILL OUT APPLICATION<br />THROUGH ONLINE<br />BANKING APP/SITE","path":[{"x":155,"y":542,"lock":true},{"x":191,"y":542,"lock":true}],"children":[],"startingPoint":false},{"id":"app_mail_txt","type":5,"state":-1,"position":{"x":160,"y":393},"size":{"width":118,"height":67},"content":"FILL OUT<br />APPLICATION<br />& MAIL IN","path":[{"x":154,"y":388,"lock":true},{"x":190,"y":388,"lock":true}],"children":[],"startingPoint":false},{"id":"meet_advisor_txt","type":5,"state":-1,"position":{"x":163,"y":243},"size":{"width":95,"height":46},"content":"MEET WITH<br />ADVISOR","path":[{"x":156,"y":238,"lock":true},{"x":187,"y":238,"lock":true}],"children":[],"startingPoint":false},{"id":"approved_txt","type":5,"state":-1,"position":{"x":1003,"y":129},"size":{"width":88,"height":19},"content":"APPROVED","path":[{"x":916,"y":182,"lock":true},{"x":975,"y":182,"lock":true},{"x":975,"y":124,"lock":true},{"x":1075,"y":124,"lock":true}],"children":[],"startingPoint":false},{"id":"denied_txt","type":5,"state":-1,"position":{"x":1002,"y":244},"size":{"width":69,"height":18},"content":"DENIED","path":[{"x":918,"y":182,"lock":true},{"x":974,"y":182,"lock":true},{"x":974,"y":239,"lock":true},{"x":1070,"y":239,"lock":true}],"children":[],"startingPoint":false},{"id":"video1","type":3,"state":-1,"position":{"x":499,"y":301},"size":{"width":244,"height":153},"content":"https://www.youtube.com/embed/AvFl6UBZLv4","path":[],"children":[],"startingPoint":false,"autoAdvance":false},{"id":"sizableimage","type":2,"state":-1,"position":{"x":313,"y":193,"lockToParent":true,"lockFirstPointToParent":true},"size":{"width":"150","height":"150"},"content":"src/assets/logo.png","path":[],"children":["divwithbg"],"startingPoint":false,"autoAdvance":false,"junctionID":1,"customParams":{"sizable":true,"clickable":true}},{"id":"unfolder1","type":2,"state":-1,"position":{"x":982,"y":390,"lockToParent":true,"lockFirstPointToParent":true},"size":{"width":100,"height":100},"content":"src/assets/sampleSign.jpg","path":[],"children":[],"startingPoint":false,"autoAdvance":false,"junctionID":0,"customParams":{"sizable":false}},{"id":"divwithbg","type":5,"state":-1,"position":{"x":66,"y":750,"lockToParent":true,"lockFirstPointToParent":true},"size":{"width":59,"height":60},"content":"hold on","path":[{"x":391,"y":350,"lock":true},{"x":398,"y":763,"lock":true},{"x":130,"y":761,"lock":true}],"children":[],"startingPoint":false,"autoAdvance":false,"junctionID":-1,"customParams":{}}]')
      // journeyData: JSON.parse('[{"id":"app_online","type":6,"state":0,"position":{"x":35,"y":482},"size":{"width":"130","height":"130"},"content":"src/assets/images/fillOutApp.svg","path":[],"children":["app_in_mail","online_app_txt"],"startingPoint":true},{"id":"app_in_mail","type":6,"state":-1,"position":{"x":36,"y":331},"size":{"width":"130","height":"130"},"content":"src/assets/images/fillOutAppInMail.svg","path":[{"x":103,"y":507,"lock":true},{"x":103,"y":435,"lock":true}],"children":["meet_advisor","app_mail_txt"],"startingPoint":false,"autoAdvance":true},{"id":"meet_advisor","type":6,"state":-1,"position":{"x":38,"y":180},"size":{"width":"130","height":"130"},"content":"src/assets/images/meetAdvisor.svg","path":[{"x":104,"y":359,"lock":true},{"x":104,"y":283,"lock":true}],"children":["meet_advisor_txt","consumer_mindset"],"startingPoint":false,"autoAdvance":true},{"id":"consumer_mindset","type":5,"state":-1,"position":{"x":336,"y":146},"size":{"width":105,"height":40},"content":"CONSUMER<br />MINDSET","path":[{"x":105,"y":204,"lock":false},{"x":104,"y":162,"lock":true},{"x":327,"y":163,"lock":true}],"children":["monitor1"],"startingPoint":false,"autoAdvance":false},{"id":"monitor1","type":6,"state":-1,"position":{"x":484,"y":266,"lockFirstPointToParent":true},"size":{"width":276,"height":252},"content":"src/assets/images/monitor.svg","path":[{"x":438,"y":166,"lock":true},{"x":577,"y":167,"lock":true},{"x":577,"y":279,"lock":true}],"children":["approval_or_denial","video1"],"startingPoint":false,"autoAdvance":true},{"id":"approval_or_denial","type":6,"state":-1,"position":{"x":791,"y":117,"lockToParent":true,"lockFirstPointToParent":true},"size":{"width":"130","height":"130"},"content":"src/assets/images/aprovalOrDenial.svg","path":[{"x":767,"y":376,"lock":true},{"x":859,"y":376,"lock":true},{"x":858,"y":241,"lock":true}],"children":["approved_txt","denied_txt"],"startingPoint":false,"autoAdvance":false},{"id":"online_app_txt","type":5,"state":-1,"position":{"x":159,"y":549},"size":{"width":186,"height":67},"content":"FILL OUT APPLICATION<br />THROUGH ONLINE<br />BANKING APP/SITE","path":[{"x":155,"y":542,"lock":true},{"x":191,"y":542,"lock":true}],"children":[],"startingPoint":false},{"id":"app_mail_txt","type":5,"state":-1,"position":{"x":160,"y":393},"size":{"width":118,"height":67},"content":"FILL OUT<br />APPLICATION<br />& MAIL IN","path":[{"x":154,"y":388,"lock":true},{"x":190,"y":388,"lock":true}],"children":[],"startingPoint":false},{"id":"meet_advisor_txt","type":5,"state":-1,"position":{"x":163,"y":243},"size":{"width":95,"height":46},"content":"MEET WITH<br />ADVISOR","path":[{"x":156,"y":238,"lock":true},{"x":187,"y":238,"lock":true}],"children":[],"startingPoint":false},{"id":"approved_txt","type":5,"state":-1,"position":{"x":1003,"y":129},"size":{"width":88,"height":19},"content":"APPROVED","path":[{"x":916,"y":182,"lock":true},{"x":975,"y":182,"lock":true},{"x":975,"y":124,"lock":true},{"x":1075,"y":124,"lock":true}],"children":[],"startingPoint":false},{"id":"denied_txt","type":5,"state":-1,"position":{"x":1002,"y":244},"size":{"width":69,"height":18},"content":"DENIED","path":[{"x":918,"y":182,"lock":true},{"x":974,"y":182,"lock":true},{"x":974,"y":239,"lock":true},{"x":1070,"y":239,"lock":true}],"children":[],"startingPoint":false},{"id":"video1","type":3,"state":-1,"position":{"x":499,"y":301},"size":{"width":244,"height":153},"content":"https://www.youtube.com/embed/AvFl6UBZLv4","path":[],"children":[],"startingPoint":false,"autoAdvance":false}]')
      // journeyData: JSON.parse('[{"id":"split1","type":5,"state":0,"position":{"x":85,"y":59},"size":{"width":82,"height":24},"content":"Start Here","path":[],"children":["splittera"],"startingPoint":true},{"id":"splittera","type":0,"state":-1,"position":{"x":193,"y":272},"size":{"width":50,"height":50},"content":"","path":[{"x":124,"y":100,"lock":false},{"x":125,"y":175,"lock":false},{"x":212,"y":206,"lock":true},{"x":212,"y":292,"lock":true}],"children":["video1","ducker"],"startingPoint":false},{"id":"video1","type":3,"state":-1,"position":{"x":357,"y":502},"size":{"width":372,"height":227},"content":"https://www.youtube.com/embed/AvFl6UBZLv4","path":[{"x":212,"y":292,"lock":false},{"x":213,"y":358,"lock":false},{"x":385,"y":400,"lock":true},{"x":386,"y":503,"lock":true}],"children":[],"startingPoint":false},{"id":"ducker","type":6,"state":-1,"position":{"x":65,"y":567},"size":{"width":161,"height":159},"content":"https://upload.wikimedia.org/wikipedia/commons/b/bf/Bucephala-albeola-010.jpg","path":[{"x":212,"y":297,"lock":false},{"x":214,"y":427,"lock":false},{"x":140,"y":486,"lock":true},{"x":140,"y":587,"lock":true}],"children":[],"startingPoint":false}]')
      // journeyData: [
      //   {
      //     id: 'j000x',
      //     type: JourneyElements.HTML,
      //     state: JourneyElementStates.OPEN,
      //     position: {x: 50, y: 140},
      //     size: {width: 300, height: 200},
      //     content: '<a>Start</a>',
      //     path: [],
      //     children: ['j0000'],
      //     startingPoint: true
      //   },
      //   {
      //     id: 'j0000',
      //     type: JourneyElements.SPLIT,
      //     state: JourneyElementStates.NONE,
      //     position: {x: 50, y: 140},
      //     size: {width: 300, height: 200},
      //     content: '',
      //     path: [{x: 50, y: 140}, {x: 200, y: 140}, {x: 260, y: 300}, {x: 450, y: 300}],
      //     children: ['j0001', 'j0002']
      //   },
      //   {
      //     id: 'j0001',
      //     type: JourneyElements.HTML,
      //     state: JourneyElementStates.NONE,
      //     position: {x: 680, y: 160},
      //     size: {width: 300, height: 200},
      //     content: '<img src="src/assets/sampleSign.jpg" style="width:auto;height:100px;" />',
      //     path: [{x: 450, y: 300}, {x: 500, y: 300}, {x: 500, y: 160}, {x: 650, y: 160}],
      //     children: []
      //   },
      //   {
      //     id: 'j0002',
      //     type: JourneyElements.HTML,
      //     state: JourneyElementStates.NONE,
      //     position: {x: 610, y: 380},
      //     size: {width: 300, height: 200},
      //     content: '<img src="src/assets/logo.png" />',
      //     path: [{x: 450, y: 300}, {x: 500, y: 300}, {x: 500, y: 420}, {x: 650, y: 420}],
      //     children: ['j0003', 'j0004', 'j0005']
      //   },
      //   {
      //     id: 'j0003',
      //     type: JourneyElements.IMAGE,
      //     state: JourneyElementStates.NONE,
      //     position: {x: 475, y: 525},
      //     size: {width: 300, height: 200},
      //     content: 'src/assets/facebook.png',
      //     path: [{x: 700, y: 550}, {x: 700, y: 650}, {x: 600, y: 650}, {x: 550, y: 550}, {x: 500, y: 550}],
      //     children: []
      //   },
      //   {
      //     id: 'j0004',
      //     type: JourneyElements.IMAGE,
      //     state: JourneyElementStates.NONE,
      //     position: {x: 500, y: 750},
      //     size: {width: 300, height: 200},
      //     content: 'src/assets/gplus-32.png',
      //     path: [{x: 700, y: 550}, {x: 700, y: 650}, {x: 600, y: 650}, {x: 550, y: 750}, {x: 500, y: 750}],
      //     children: ['j0006', 'j0007']
      //   },
      //   {
      //     id: 'j0005',
      //     type: JourneyElements.YOUTUBE,
      //     state: JourneyElementStates.NONE,
      //     position: {x: 780, y: 640},
      //     size: {width: 300, height: 200},
      //     content: 'https://www.youtube.com/embed/AvFl6UBZLv4',
      //     path: [{x: 700, y: 550}, {x: 700, y: 700}, {x: 780, y: 700}],
      //     children: []
      //   },
      //   {
      //     id: 'j0006',
      //     type: JourneyElements.HTML,
      //     state: JourneyElementStates.NONE,
      //     position: {x: 225, y: 755},
      //     size: {width: 300, height: 200},
      //     content: '<img src="src/assets/gplus-32.png" />',
      //     path: [],
      //     children: []
      //   },
      //   {
      //     id: 'j0007',
      //     type: JourneyElements.YOUTUBE,
      //     state: JourneyElementStates.NONE,
      //     position: {x: 10, y: 390},
      //     size: {width: 300, height: 200},
      //     content: 'https://www.youtube.com/embed/opi8X9hQ7q8',
      //     path: [{x: 500, y: 750}, {x: 380, y: 750}, {x: 380, y: 660}, {x: 150, y: 660}, {x: 150, y: 550}],
      //     children: []
      //   }
      // ]
    }
  },
  methods: {
    previewToggle: function (e) {
      var self = this
      if (!self.$data.preview) {
        self.resetData()
      }
    },
    resetData: function () {
      var self = this
      for (var i = 0; i < self.$data.journeyData.length; i++) {
        if (!self.$data.journeyData[i].startingPoint) {
          self.$data.journeyData[i].state = JourneyElementStates.NONE
        }
      }
    }
  }
}
</script>

<style lang="scss">

div.hidden-content{
  display: none;
}
div.preview-toggle{
  position: relative;
  z-index: 300;
  display: inline-block;
}
</style>
