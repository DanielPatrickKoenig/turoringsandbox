<template>
  <div class="modal-window-component">
    <div>
      <slot name="content"></slot>
      <div class='navigation-container'>
        <slot name="navigation"></slot>
      </div>
    </div>
  </div>
</template>
<script>
// import {EventBus} from './utils/EventBus.js'
export default {
}
</script>
<style lang="scss" scoped>
div.modal-window-component{
  position: fixed;
  background-color: rgba(0,0,0,.8);
  top:0;
  left:0;
  bottom:0;
  right:0;
  z-index:300;
  > div{
    width: 300px;
    height: auto;
    position: relative;
    margin: 40px auto 0 auto;
    background-color:#ffffff;
    padding-bottom: 60px;
    > div.navigation-container{
      position:absolute;
      width:100%;
      height: 60px;
      bottom:0;
    }
  }

}
</style>

