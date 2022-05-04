import { getRandomInt } from './utils.js';

const app = new PIXI.Application({
    width: 800, 
    height: 600, 
    backgroundColor: 0x0492C2, 
    resolution: window.devicePixelRatio || 1,
    antialias: true
});

document.getElementsByClassName("app")[0].appendChild(app.view);

const container = new PIXI.Container();
const shipTypes = [PIXI.Texture.from('images/ShipCruiserHull.png'),
                   PIXI.Texture.from('images/ShipPatrolHull.png'),
                   PIXI.Texture.from('images/ShipBattleshipHull.png'),
                   PIXI.Texture.from('images/ShipDestroyerHull.png'),
                   PIXI.Texture.from('images/ShipRescue.png')];
const explosion = PIXI.Texture.from('images/explosion.png');
const angles = [0, 90, 180, 270];
const totalShips = 5;
const spacing = 100;
const xOffset = 150;

app.stage.addChild(container);

let ships = [];

//console.log(app.options.width, app.options.height)

for (let i=0; i < totalShips; i++) {
    let shipIndex = getRandomInt(shipTypes.length)
    let ship = new PIXI.Sprite(shipTypes[shipIndex]);
    let x = spacing * i + xOffset;
    let y = getRandomInt(app.screen.height - ship.height);

    let angle_index = math.floor(Math.random() * shipTypes.length);
    let angle = angles[angle_index];

    ship.x = x;
    ship.y = y;
    ship.vx = 0;
    ship.vy = 0;
    ship.anchor.x = 0.5;
    ship.anchor.y = 0.5;
    ship.angle = angle;

    // Opt-in to interactivity
    ship.interactive = true;
    ship.buttonMode = true;

    // Pointers normalize touch and mouse
    ship.on('pointerdown', onClick);
        
    ships.push(ship);
    app.stage.addChild(ship);
}

app.ticker.add((delta) => {
    for (let i=0; i < ships.length; i++) {
        let j = i + 1
        moveShip(ships[i], Math.random());
        outOfBounds(ships[i]);
        if (shipIntersect(ships[i], ships[j % ships.length])) {
          let explosionSprite = new PIXI.Sprite(explosion);
          explosionSprite.x = ships[i].x;
          explosionSprite.y = ships[i].y;
          app.stage.addChild(explosionSprite)
        }
    }
});

function moveShip(ship, speed) {
    let angle = Math.round(ship.angle % 360);
    // move up
    if (angle == 0) {
      ship.vy = -speed;
      ship.y += ship.vy;
      // move right
    } else if (angle == 90) {
      ship.xy = speed;
      ship.x += ship.xy;
      // move down
    } else if (angle == 180) {
      ship.vy = speed;
      ship.y += ship.vy;
      // move left
    } else if (angle == 270) {
      ship.vx = -speed;
      ship.x += ship.vx;
    }
}
    
function onClick() {
    console.log(this.angle)
    this.angle += 90;
}

function outOfBounds (ship) {
  // Horizontal out of bounds
  if (ship.x < 0 || ship.x > (app.screen.width - 50)) {
    ship.angle += 180; 
  // Vertical out if bounds
  } if (ship.y < 0 || ship.y > (app.screen.height - 50)) {
    ship.angle += 180;
  } 
}

function hitTestShips(ship1, ship2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  ship1.centerX = ship1.x + ship1.width / 2;
  ship1.centerY = ship1.y + ship1.height / 2;
  ship2.centerX = ship2.x + ship2.width / 2;
  ship2.centerY = ship2.y + ship2.height / 2;

  //Find the half-widths and half-heights of each sprite
  ship1.halfWidth = ship1.width / 2;
  ship1.halfHeight = ship1.height / 2;
  ship2.halfWidth = ship2.width / 2;
  ship2.halfHeight = ship2.height / 2;

  //Calculate the distance vector between the sprites
  vx = ship1.centerX - ship2.centerX;
  vy = ship1.centerY - ship2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = ship1.halfWidth + ship2.halfWidth;
  combinedHalfHeights = ship1.halfHeight + ship2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

function shipIntersect(shipA, shipB) {
  let aBox = shipA.getBounds();
  let bBox = shipB.getBounds();

  return aBox.x + aBox.width > bBox.x &&
         aBox.x < bBox.x + bBox.width &&
         aBox.y + aBox.height > bBox.y &&
         aBox.y < bBox.y + bBox.height; 
}