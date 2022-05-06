import { getRandomInt } from './utils.js';
import { onClick } from './utils.js';


export function initLevel1(app, score, shipsContainer, ships, textContainer, rocks) {

    // game settings
    const angles = [0, 90, 180, 270];
    const totalShips = score;
    const spacing = 100;
    const xOffset = 150;
    // load the spritesheet images
    let sheet = PIXI.Loader.shared.resources["images/spritesheet.json"].spritesheet;
    const shipTypes = ['ShipCruiserHull.png', 'ShipBattleshipHull.png',
                    'ShipDestroyerHull.png', 'ShipRescue.png',]

    // adding score text
    const style = new PIXI.TextStyle({fontSize: 18, fontFamily: 'Arial', fill: ['#ffffff', '#00ff99']})
    const basicText = new PIXI.Text(`Number of ships remaining: ${score}`, style);
    basicText.x = 5;
    basicText.y = 5; 
    textContainer.addChild(basicText);
    app.stage.addChild(textContainer);

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