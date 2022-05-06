import { initLevel1 } from './levels.js';


const app = new PIXI.Application({
    width: 800, 
    height: 600, 
    backgroundColor: 0x0492C2, 
    resolution: window.devicePixelRatio || 1,
    antialias: true
});

document.getElementsByClassName("app")[0].appendChild(app.view);

// Initiatlize a few variables
PIXI.Loader.shared.add("images/spritesheet.json").load(setup);
let shipsContainer = new PIXI.Container();
let textContainer = new PIXI.Container();
let ships = [];
let rocks = [];
let score;
let level = 1; 

app.ticker.add(gameLoop);

function setup() {
  if (level == 1) {
    score = 2;
    initLevel1(app, score, shipsContainer, ships, textContainer, rocks);
  }
  if (level == 2) {
    score = 2;
    initLevel1(app, score, shipsContainer, ships, textContainer, rocks);
  }
}

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
        level = 2;
        app.stage.removeChild(textContainer);
        app.stage.removeChild(winText);
        setup();
        //app.ticker.stop();
      }
      updateScoreText(score);
    }
  }
}

function removeShip(ship) {
  // remove ship from stage
  shipsContainer.removeChild(ship)
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
  const winStyle = new PIXI.TextStyle({fontSize: 24, fontFamily: 'Arial', fill: ['#00FF00', '#00FF00']})
  const winText = new PIXI.Text('You won', winStyle);
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

function updateScoreText(score) {
  textContainer.children.forEach((message) => {
    message.text = `Number of ships remaining: ${score}`
  })
}

function startOverButton() {

}