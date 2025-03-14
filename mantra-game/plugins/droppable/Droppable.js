// Droppable.js
export default class Droppable {
  static id = 'droppable';

  constructor(config = {}) {
    this.id = Droppable.id;
  }

  init(game) {
    this.game = game;
    this.game.systemsManager.addSystem('droppable', this);
  }

  build(entityData = {}) {
    // Ensure `meta` exists and initialize shield properties
    const meta = entityData.meta || {};

    /*
    entityData.onDrop = function(context, event){
      if (typeof entityData.onDrop === 'function') {
        entityData.onDrop(context, event);
      } else {
        console.log('default entityData.onDrop handler, none was set')
      }
    };
    */

    entityData.isSensor = true;

    entityData.pointerout = function (context, event) {
      // remove the border from context
      if (context && context.dropTarget) {
        game.updateEntity(context.dropTarget.id, {
          style: {
            border: 'none'
          }
        })
      }
    }

    entityData.pointerdown = function (context, event) {
      // fix the context ( entity ) to the pointer
      game.updateEntity(context.id, {
        update: function (entity) {
          // console.log('sup dating', game.data.mouse.position)
          //entity.position.x = event.x;
          //entity.position.y = event.y;
          game.updateEntity(entity.id, {
            position: game.data.mouse.worldPosition
          });
        }
      })
    };

    entityData.pointermove = function (context, event) {
      // console.log("droppable.pointermove", context.size, context.position);
  
      // perform rbush search for context.position + range of context.size with small buffer
      let entsInFov = game.getPlayerFieldOfView(context, context.size.width, true);
  
      let selectedDropTarget = null;
      // go through all the entsInFov, pick the first which id is *not* context.id
      // and has a onDrop function
      // console.log(entsInFov)
      for (let i = 0; i < entsInFov.length; i++) {
        let ent = game.data.ents._[entsInFov[i].id]
        // console.log(ent)
        if (ent.id !== context.id && ent.onDrop && typeof ent.onDrop === 'function') {
          selectedDropTarget = ent;
          break;
        }
      }
  
      if (selectedDropTarget) {
        let ent = game.data.ents._[selectedDropTarget.id]
        context.dropTarget = ent;
  
        // TODO: add highlight to selectedDropTarget
       
        // iterate all other droppable entities and remove border
        let dropTargets = game.components.onDrop.data;
        // droppables is a map
        for (let key in dropTargets) {
          // let dropTarget = dropTargets[key.toString()];
          if (key.toString() !== ent.id.toString()) {
            game.updateEntity(key, {
              style: {
                border: 'none'
              }
            });
          }
        }

        game.updateEntity(ent.id, {
          style: {
            border: '2px solid red'
          }
        });

  
        // console.log('selectedDropTarget', ent)
        context.dropTarget = ent;
      }
    }
  
  
    entityData.pointerup = function (context, event) {
      // release the context ( entity ) from the pointer by clearing the update
      // TODO: this will remove all updates, we'll need to manage the wrapped fn.events array here
      //       it is already possible with current architecture, just need to implement it
      game.updateEntity(context.id, {
        update: null
      });
  
  
      if (context.dropTarget) {
        let ent = game.data.ents._[context.dropTarget.id]
        if (ent && typeof ent.onDrop === 'function') {
          ent.onDrop(context, event);
        }
      }
  
    }

    return {
      ...entityData,
      meta,
    };
  }
}