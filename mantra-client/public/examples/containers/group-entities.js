let game = new MANTRA.Game({
  graphics: ['css'], // array enum, 'babylon', 'css', 'three'
});

game.start(function(){

  game.setBackground('#000000');
  game.setZoom(1.5);

  let containerA = game.createContainer({
    name: 'group-a',
    // layout: 'grid', // optional. can also be "flex" or "none"
    color: 0xff00ff,
    position: {
      x: -150,
      y: 0,
      z: -1
    },
    body: false,
    size: {
      width: 300,
      height: 180
    },
    grid: {
      columns: 1,
      rows: 8,
    },
    style: { // supports CSS property names
      padding: 0,
      margin: 0,
      // background: '#ff0000', // can also use Entity.color
      border: {
        color: '#000000',
        width: 0
      }
    },
  });


  let containerB = game.createContainer({
    name: 'group-b',
    // layout: 'grid', // optional. can also be "flex" or "none"
    color: 0x007fff,
    position: {
      x: 150,
      y: 0,
      z: -1
    },
    body: false,
    size: {
      width: 300,
      height: 180
    },
    grid: {
      columns: 1,
      rows: 8,
    },
    style: { // supports CSS property names
      padding: 0,
      margin: 0,
      // background: '#ff0000', // can also use Entity.color
      border: {
        color: '#000000',
        width: 0
      }
    },
  });

  for (let i = 0; i < 12; i++) {

    // create entity directly inside container with relative position
    let group = i < 6 ? 'group-a' : 'group-b';
    game.createEntity({
      name: 'maze-door-' + i,
      container: group,
      texture: {
        sheet: 'loz_spritesheet',
        sprite: 'ayyoDoor',
      },
      color: 0x00ff00,
      body: true,
      meta: {
        source: 'labryninthos',
        algo: 'recursive-backtracking',
        height: 16,
        width: 16
      },
      type: 'DOOR',
      size: {
        width: 16,
        height: 16
      }
    });
  }

});
    