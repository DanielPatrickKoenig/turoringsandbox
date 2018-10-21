<template>
  <div class="journey-item-form">
    <input v-if="isnew" class="item-id-field" type="text" placeholder="please inter an id" v-model="jitem.id" />
    <label v-else class="item-id-label"><slot name="expander"></slot>{{jitem.id}}</label>
    <label>Starting Point <input type="checkbox" v-model="jitem.startingPoint" /></label>
    <label>Auto Advance <input type="checkbox" v-model="jitem.autoAdvance" /></label>
    <!-- <label>ID <input type="text" v-model="jitem.id" /></label> -->
    
    <label>
      Type
      <select v-model="jitem.type">
        <option v-for="(v, k, i) in JourneyElements" :key="'journeyElement_'+i.toString()" :value="v">{{k}}</option>
      </select>
    </label>
    <label v-if="jitem.type == JourneyElements.JUNCTION">
      Junction Type
      <select v-model="jitem.junctionID" v-on:click="onJunctionSubtypeSelected(jitem.junctionID)">
        <option :value="-1">Select a junction type</option>
        <option v-for="(v, i) in JunctionManifest" :key="'junctiontype_'+i.toString()" :value="i">
          {{v.label}}
        </option>
      </select>
    </label>
    <label>Content <input type="text" v-model="jitem.content" /></label>
    <label>Position 
      <label>X <input type="number" v-model="jitem.position.x" /></label>
      <label>Y <input type="number" v-model="jitem.position.y" /></label>
      <label>Lock to Parent <input type="checkbox" v-model="jitem.position.lockToParent" /></label>
      <!-- <label>Lock First Point to Parent <input type="checkbox" v-model="jitem.position.lockFirstPointToParent" /></label> -->
    </label>
    <label v-if="jitem.type != JourneyElements.SPLIT">
      Size 
      <label>Width <input type="number" v-model="jitem.size.width" /></label>
      <label>Height <input type="number" v-model="jitem.size.height" /></label>
    </label>
    <label>Path <button class="path-edit-toggle"></button></label>
    <ul>
      <li class="position-item" v-for="(p, i) in jitem.path" :key="'pathPoint_'+i.toString()">
        <label>X <input type="number" v-model="jitem.path[i].x" /></label>
        <label>Y <input type="number" v-model="jitem.path[i].y" /></label>
        <label>Lock <input type="checkbox" v-model="jitem.path[i].lock" /></label>
        <a v-on:click="deletePoint(i)"></a>
      </li>
      <li>
        <button v-on:click="addPoint">Add Point</button>
      </li>
    </ul>
    <label>Children</label>
    <ul>
      <li v-for="(c, i) in jitem.children" :key="'child'+i.toString()">
        <select v-model="jitem.children[i]">
          <option v-if="v.id != jitem.id" v-for="(v, i) in jouneyData" :key="'item_'+i.toString()" :value="v.id">{{v.id}}</option>
        </select>
        <a v-on:click="deleteChild(i)"></a>
      </li>
      <li>
        <select v-on:change="addItemChild" v-model="defaultChildProps.tempChild">
          <option :value="defaultChildProps.placeholder">{{defaultChildProps.placeholder}}</option>
          <option v-if="!shouldExcludeChild(v.id)" v-for="(v, i) in jouneyData" :key="'empty_item_'+i.toString()" :value="v.id">{{v.id}}</option>
        </select>
      </li>
    </ul>
  </div>
</template>

<script>
import {JourneyElements} from './utils/JourneyStates.js'
import {JunctionManifest} from './JunctionManifest.js'
export default {
  props: ['item', 'items', 'isnew'],
  data () {
    return {
      jitem: this.item,
      JourneyElements: JourneyElements,
      JunctionManifest: JunctionManifest,
      jouneyData: this.items,
      defaultChildProps: {
        tempChild: '',
        placeholder: 'Please select a junction'
      }
    }
  },
  methods: {
    addPoint: function (e) {
      var self = this
      self.$data.jitem.path.push({x: 0, y: 0, lock: true})
    },
    addItemChild: function () {
      var self = this
      self.$data.jitem.children.push(self.$data.defaultChildProps.tempChild.toString())
      self.$data.defaultChildProps.tempChild = self.$data.defaultChildProps.placeholder.toString()
    },
    shouldExcludeChild: function (id, activeChoice) {
      var self = this
      var should = false
      if (id === self.$data.jitem.id) {
        should = true
      }
      for (var i = 0; i < self.$data.jitem.children.length; i++) {
        if (id === self.$data.jitem.children[i]) {
          should = true
        }
      }
      return should
    },
    deletePoint: function (index) {
      var self = this
      self.$data.jitem.path.splice(index, 1)
    },
    deleteChild: function (index) {
      var self = this
      self.$data.jitem.children.splice(index, 1)
    },
    onJunctionSubtypeSelected: function (id) {
      var self = this
      self.$data.jitem.customParams = id >= 0 ? JSON.parse(JSON.stringify(JunctionManifest[id].params)) : {}
    }
  },
  mounted: function () {
    var self = this
    self.$data.defaultChildProps.tempChild = self.$data.defaultChildProps.placeholder.toString()
  },
  watch: {
    item: function () {
      var self = this
      self.$data.jitem = self.item
    }
  }
}
</script>

<style lang="scss" scoped>
div.journey-item-form{
  width:100%;
  > input.item-id-field{
    display: inline-block;
    width: 88%;
    font-size: 18px;
    border:none;
  }
  > label{
    display:inline-block;
    width: 97%;
    padding:3px 2px;
    height: 30px;
    box-shadow:  0 1px 0 rgba(0,0,0,.2) inset;
    button.path-edit-toggle{
      float: right;
    }
    button.path-edit-toggle::after{
      content: "\2710";
    }
    > input, select{
      float:right;
      
    }
    > label{
      display: inline-block;
      width:100%;
      padding:3px 0;
      > input, select{
        float:right;
        
      }
    }
  }
  > label.item-id-label{
    width: auto;
    font-size: 18px;
    font-weight: bold;
    box-shadow: none;
  }
  > ul{
    display:block;
    margin:0;
    padding: 0;
    width:100%;
    > li{
      display: block;
      margin:0;
      padding:3px;
      position: relative;
      box-shadow:  0 -1px 0 rgba(0,0,0,.1) inset;
      > a{
        position: absolute;
        top:0;
        right:0;
        color: #ff0000;
        margin-right: 2px;
      }
      > a::after{
        content: "\2716";
      }
      > button{
        width:100%;
      }
      > label{
        float: left;
        display:block;
        width: 100%;
        height: 30px;
        
        > input{
          float: right;
          margin-right:16px;
        }
      }
      > label + label{
        
      }
    }
    > li.position-item{
      display: inline-block;
    }
  }
}
</style>

