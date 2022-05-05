import { getRandomInt } from './utils.js';

const app = new PIXI.Application({
    width: 800, 
    height: 600, 
    backgroundColor: 0x0492C2, 
    resolution: window.devicePixelRatio || 1,
    antialias: true
});

document.getElementsByClassName("app")[0].appendChild(app.view);

PIXI.Loader.shared.add("images/spritesheet.json").load(setup);
let ships = [];
let shipsContainer = new PIXI.Container();
let rocks = [];
app.ticker.add(gameLoop);

function setup(){
  
  // game settings
  const angles = [0, 90, 180, 270];
  const totalShips = 2;
  const spacing = 100;
  const xOffset = 150;
  // load the spritesheet images
  let sheet = PIXI.Loader.shared.resources["images/spritesheet.json"].spritesheet;
  const shipTypes = ['ShipCruiserHull.png', 'ShipBattleshipHull.png',
                     'ShipDestroyerHull.png', 'ShipRescue.png',]
  
  const style = new PIXI.TextStyle({fontSize: 18, fontFamily: 'Arial', fill: ['#ffffff', '#00ff99']})
  const basicText = new PIXI.Text(`Ships remaining: ${score}`, style);
  basicText.x = 5;
  basicText.y = 5; 
  app.stage.addChild(basicText);
  
  // Adding ships 
  for (let i=0; i < totalShips; i++) {
    let shipType = shipTypes[getRandomInt(shipTypes.length)]
    let ship = new PIXI.Sprite(sheet.textures[shipType]);
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
    
    shipsContainer.addChild(ship);
    ships.push(ship);
  }

  app.stage.addChild(shipsContainer);
  let rocksContainer = new PIXI.Container();
  
  // Adding rocks
  let rockTopLeft = new PIXI.Sprite(sheet.textures['rocks.png']);
  rockTopLeft.x = app.screen.width / 2  - 50;
  rockTopLeft.y = 0;
  rocks.push(rockTopLeft);
  app.stage.addChild(rockTopLeft);

  let rockMidLeft = new PIXI.Sprite(sheet.textures['rocks.png']);
  rockMidLeft.x = app.screen.width / 2  - 50;
  rockMidLeft.y = 30;
  rocks.push(rockMidLeft);
  app.stage.addChild(rockMidLeft);

  let rockBottomLeft = new PIXI.Sprite(sheet.textures['rocks.png']);
  rockBottomLeft.x = app.screen.width / 2  - 50;
  rockBottomLeft.y = 60;
  rocks.push(rockBottomLeft);
  app.stage.addChild(rockBottomLeft);

  let rockTopRight = new PIXI.Sprite(sheet.textures['rocks.png']);
  rockTopRight.x = app.screen.width / 2  + 50;
  rockTopRight.y = 0;
  rocks.push(rockTopRight);
  app.stage.addChild(rockTopRight);

  let rockBottomRight = new PIXI.Sprite(sheet.textures['rocks.png']);
  rockBottomRight.x = app.screen.width / 2  + 50;
  rockBottomRight.y = 30;
  rocks.push(rockBottomRight);
  app.stage.addChild(rockBottomRight);

  let rockMidRight = new PIXI.Sprite(sheet.textures['rocks.png']);
  rockMidRight.x = app.screen.width / 2  + 50;
  rockMidRight.y = 60;
  rocks.push(rockMidRight);
  rocksContainer.addChild(rockMidRight)
  app.stage.addChild(rockMidRight);
}

console.log(app.stage.children)
let score = 2;

function gameLoop(delta) {
  for (let i=0; i < ships.length; i++) {
    let shipA = ships[i];
    // Move ships around the stage
    moveShip(shipA, 0.5);
    // Check if ships are out of bounds of stage
    outOfBounds(shipA);
    // Check colision between one ship and all others
    for (let j = i + 1; j < ships.length; j++) {
      let shipB = ships[j];
      if (shipIntersect(shipA, shipB)) {
        explode(shipA, shipB);
        youLose();
        app.ticker.stop();     
      }
    }
    // Check collision between one ship and all rocks
    for (let k=0; k < rocks.length; k++) {
      if (shipIntersect(shipA, rocks[k])) {
        console.log('error')
        explode(shipA, rocks[k]);
        youLose();
        app.ticker.stop();  
      }
    }
    if (shipInDock(shipA)) {
      removeShip(shipA);
      score -= 1;
      if (score == 0) {
        youWin();
        app.ticker.stop();
      }
    }
  }
}

function removeShip(ship) {
  // remove ship from stage
  app.stage.removeChild(ship)
  // remove ship from ships list
  const index = ships.indexOf(ship);
      if (index > -1) {
        ships.splice(index, 1); // 2nd parameter means remove one item only
      }
} 

function explode(shipA, shipB) {
  let sheet = PIXI.Loader.shared.resources["images/spritesheet.json"].spritesheet;
  let explosionA = new PIXI.Sprite(sheet.textures['explosion.png']);

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

  rocks.forEach((rock) => {
    let bBox = rock.getBounds();
    
    return aBox.x + aBox.width > bBox.x &&
         aBox.x < bBox.x + bBox.width &&
         aBox.y + aBox.height > bBox.y &&
         aBox.y < bBox.y + bBox.height;
})

function youLose() {
  const lostStyle = new PIXI.TextStyle({fontSize: 24, fontFamily: 'Arial', fill: ['#ff0019', '#ff0019']})
  const lostText = new PIXI.Text('You lost', lostStyle);
  lostText.anchor.x = 0.5;
  lostText.anchor.y = 0.5;
  lostText.x = app.screen.width / 2;
  lostText.y = app.screen.height / 2;
  app.stage.addChild(lostText)
}

function youWin() {
  const winStyle = new PIXI.TextStyle({fontSize: 24, fontFamily: 'Arial', fill: ['#00FF009', '#00FF00']})
  const winText = new PIXI.Text('You won!', winStyle);
  winText.anchor.x = 0.5;
  winText.anchor.y = 0.5;
  winText.x = app.screen.width / 2;
  winText.y = app.screen.height / 2;
  app.stage.addChild(winText)
  console.log('CTF{Aye_Aye_Captain!}')
}

function shipInDock(ship) {
  let aBox = ship.getBounds();

  if (aBox.x > app.screen.width / 2  - 50 && 
      aBox.x < app.screen.width / 2  + 50 &&
      aBox.y < 5) {
        return true;
  }
  return false;
}

function scoreText(score) {
   // Adding text
   const style = new PIXI.TextStyle({fontSize: 18, fontFamily: 'Arial', fill: ['#ffffff', '#00ff99']})
   const basicText = new PIXI.Text(`Ships remaining: ${score}`, style);
   basicText.x = 5;
   basicText.y = 5; 
   app.stage.addChild(basicText);
}