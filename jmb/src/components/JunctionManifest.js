import {Unfolder} from './utils/pixi/Unfolder.js'
// import {EventBus} from './utils/EventBus.js'
export const JunctionManifest = [
  {
    label: 'Unfolder',
    params: {
      sizable: false
    },
    method: function (pm, junction) {
      // return new Unfolder(pm, junction.content, junction.size).init().container
      return new Unfolder(pm, junction.content, {width: 300, height: 200}).init().container
    }
  },
  {
    label: 'Image',
    params: {
      sizable: true,
      clickable: true
    },
    method: function (pm, junction) {
      var t = pm.PIXI.Texture.fromImage(junction.content)
      var img = new pm.PIXI.Sprite(t)
      img.width = junction.size.width
      img.height = junction.size.height
      // img.interactive = true
      // img.on('click', function (e) {
      //   console.log('pixi image clicked')
      //   EventBus.$emit('on-junction-clicked', junction)
      // })
      return img
    }
  }
]
