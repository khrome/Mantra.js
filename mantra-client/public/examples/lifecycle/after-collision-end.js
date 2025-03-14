let game = new MANTRA.Game({
  graphics: ['css'], // array enum, 'babylon', 'phaser', 'css', 'three'
  defaultMovement: true,
});

let collisions = 0;

//
// Registers an event listener after the 'collisionEnd' event
//
// Cancels the collision by returning false
game.after('collisionEnd', function (entityA, entityB, pair) {

  // change the color of the entity
  game.updateEntity(entityA.id, {
    color: game.randomColor()
  });

  // change the color of the entity
  game.updateEntity(entityB.id, {
    color: game.randomColor()
  });

  // update the text
  collisions++;
  let text = game.getEntityByName('collisionCounter');
  game.updateEntity(text.id, {
    text: `Collisions: ${collisions}`
  });

});

game.start(function(){
  game.zoom(1);
  game.createBorder();
  game.setBackground('#000000');
  game.setGravity(0, 2);
  game.createPlayer({
    position: {
      x: -32,
      y: 0
    }
  });

  let box = game.createEntity({
    size: {
      height: 50,
      width: 50
    },
    position: {
      x: 0,
      y: -200
    }
  });

  let collisionCounter = game.createText({
    name: 'collisionCounter',
    text: `Collisions: ${collisions}`,
    color: 'white',
    position: {
      x: -200,
      y: 10
    },
    body: false,
    size: {
      width: 280,
      height: 50,
    },
    color: 0xffffff,
    style: {
      backgroundColor: 'black',
      fontSize: '44px',
    },
  });

});    