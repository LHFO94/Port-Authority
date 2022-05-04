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
                   PIXI.Texture.from('images/ShipBattleshipHull.png'),
                   PIXI.Texture.from('images/ShipDestroyerHull.png'),
                   PIXI.Texture.from('images/ShipRescue.png')];
const explosion = PIXI.Texture.from('images/explosion.png');
const angles = [0, 90, 180, 270];
const totalShips = 5;
const spacing = 100;
const xOffset = 150;
const style = new PIXI.TextStyle({
  fontSize: 18,
  fontFamily: 'Arial',
  fill: ['#ffffff', '#00ff99']})
const basicText = new PIXI.Text(`Ships remaining: ${totalShips}`, style);
basicText.x = 0;
basicText.y = 0;

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
    app.stage.addChild(basicText);
    app.ticker.add(gameLoop);
}

function gameLoop(delta) {
  for (let i=0; i < ships.length; i++) {
    let shipA = ships[i];
    // Move ships around the stage
    moveShip(ships[i], Math.random());
    // Check if ships are out of bounds of stage
    outOfBounds(ships[i]);

    for (let j = i + 1; j < ships.length; j++) {
      let shipB = ships[j];
      // Check colision between two ships
      if (shipIntersect(ships[i], ships[j])) {
        explode(ships[i], ships[j]);
        app.ticker.stop();     
      }
    }
  }
}

function explode(shipA, shipB) {

  let explosionA = new PIXI.Sprite(explosion);

  explosionA.x = shipA.x;
  explosionA.y = shipB.y;

  explosionA.x = shipA.x - shipA.width / 2; 
  explosionA.y = shipA.y - shipA.height / 2;
 
  app.stage.addChild(explosionA)
}

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


function shipIntersect(shipA, shipB) {
  let aBox = shipA.getBounds();
  let bBox = shipB.getBounds();

  //console.log(aBox);
  return aBox.x + aBox.width > bBox.x &&
         aBox.x < bBox.x + bBox.width &&
         aBox.y + aBox.height > bBox.y &&
         aBox.y < bBox.y + bBox.height; 
}