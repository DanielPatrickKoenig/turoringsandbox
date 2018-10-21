<template>
  <div>
    <button class="add-junction-button" v-on:click="addJunction">Add Junction</button>
    <button class="save-journey-button" v-on:click="saveJourney">Save Journey</button>
    <div v-if="modalStates.add">
      <modalwindow>
        <div slot="content">
          <label v-if="submissionError !== ''" class="modal-error-label">{{submissionError}}</label>
          <jform :item="BaseJourneyItem" :items="journeyData" :isnew="true"></jform>
        </div>
        <div slot="navigation">
          <button v-on:click="modalStates.add = false">Cancel</button>
          <button v-if="submissionError === ''" v-on:click="addItem">Add</button>
        </div>
      </modalwindow>
    </div>
    <div class="properties-panel">
      <jform v-if="selectedJourneyItem >= 0" class="journey-form-toggle journey-form-open" :item="journeyData[selectedJourneyItem]" :items="journeyData" :isnew="false">
      </jform>
    </div>
    
    <!-- <ul class="journey-item-list">
      <li v-for="(d, i) in journeyData" :key="'jourenyitem_'+i.toString()">
        <a class="delete-item" :index="i" v-on:click="deleteItem"></a>
        <jform :class="selectedJourneyItem == i ? 'journey-form-toggle journey-form-open' : 'journey-form-toggle'" :item="d" :items="journeyData" :isnew="false">
          <span class="expander" slot="expander">
            <input type="radio" :value="i" v-model="selectedJourneyItem" name="journeyformtoggleselector" />
          </span>
        </jform>
      </li>
    </ul> -->
    <wireframe :items="journeyData" :selctedindex="selectedJourneyItem"></wireframe>
  </div>
</template>
<script>
import {EventBus} from './utils/EventBus.js'
import {JourneyElements, BaseJourneyItem, JourneyElementStates} from './utils/JourneyStates.js'
import ModalWindowComponent from './ModalwindowComponent.vue'
import JourneyItemForm from './JourneyItemForm.vue'
import JourneyWireframe from './JourneyWireframe.vue'
export default {
  props: ['jdata'],
  components: {
    modalwindow: ModalWindowComponent,
    jform: JourneyItemForm,
    wireframe: JourneyWireframe
  },
  data () {
    return {
      journeyData: this.jdata,
      selectedJourneyItem: -1,
      modalStates: {
        add: false,
        confirmDelete: false
      },
      BaseJourneyItem: {},
      JourneyElements: JourneyElements
    }
  },
  methods: {
    addJunction: function (e) {
      var self = this
      self.$data.BaseJourneyItem = self.createBaseJourneyItem()
      self.$data.modalStates.add = true
    },
    saveJourney: function (e) {
      var self = this
      for (var i = 0; i < self.$data.journeyData; i++) {
        if (self.$data.journeyData[i].startingPoint) {
          self.$data.journeyData[i].state = JourneyElementStates.OPEN
        }
      }
      console.log(JSON.stringify(self.$data.journeyData))
    },
    createBaseJourneyItem: function () {
      var item = JSON.parse(JSON.stringify(BaseJourneyItem))
      console.log(item)
      // for (var b in BaseJourneyItem) {
      //   item[b] = BaseJourneyItem[b]
      // }
      return item
    },
    addItem: function (e) {
      var self = this
      if (self.submissionError === '') {
        var newJunction = JSON.parse(JSON.stringify(self.$data.BaseJourneyItem))
        if (newJunction.type === JourneyElements.SPLIT) {
          newJunction.size.width = 50
          newJunction.size.height = 50
        }
        self.$data.journeyData.push(newJunction)
        self.$data.modalStates.add = false
      }
    },
    deleteItem: function (e) {
      var self = this
      var index = e.currentTarget.getAttribute('index')
      self.$data.journeyData.splice(index, 1)
      console.log(self.$data.journeyData)
    }
  },
  computed: {
    submissionError: function () {
      var self = this
      var notEmpty = self.$data.BaseJourneyItem.id !== ''
      var notTaken = true
      var errorText = ''
      for (var i = 0; i < self.$data.journeyData.length; i++) {
        if (self.$data.BaseJourneyItem.id === self.$data.journeyData[i].id) {
          notTaken = false
        }
      }
      if (!notEmpty) {
        errorText = 'You must enter an id.'
      } else if (!notTaken) {
        errorText = 'The id ' + self.$data.BaseJourneyItem.id + ' is already being used.'
      }
      return errorText
    }
  },
  mounted: function () {
    var self = this
    EventBus.$on('update-selection-index', (n) => {
      self.selectedJourneyItem = n
    })
  }
}
</script>
<style lang="scss">
label.modal-error-label{
  font-size: 10px;
  display: inline-block;
  color: #ff0000;
  width:100%;
}
button.add-junction-button{
  position:fixed;
  top:0;
  right:0;
  z-index: 255;
}
button.save-journey-button{
  position:fixed;
  right:0;
  bottom:0;
  z-index: 255;

}
div.properties-panel
{
  position: fixed;
  right: 0;
  top: 30px;
  bottom: 30px;
  width: 300px;
  overflow-y: auto;
  z-index: 250;
  padding: 0;
  margin: 0;
}
ul.journey-item-list{
  position: fixed;
  right: 0;
  top: 30px;
  bottom: 30px;
  width: 300px;
  overflow-y: auto;
  z-index: 250;
  padding: 0;
  margin: 0;
  > li{
    display:block;
    padding: 8px 0;
    margin:0;
    box-shadow: 0 -3px 0 #333333 inset;
    > a.delete-item{
      float:right;
    }
    > a.delete-item::after{
      content: "\2716";
    }
    .journey-form-toggle {
      height: 40px;
      overflow: hidden;
    }
    .journey-form-toggle.journey-form-open {
      height: auto;
    }
  }
}
</style>

