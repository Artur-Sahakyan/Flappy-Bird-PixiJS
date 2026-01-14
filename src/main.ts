import { Application, Text } from "pixi.js";
import { createBackground, resizeBackground } from "./game/background";
import {
  drawCharacter,
  setCharacterInitialPosition,
  onResizeCharacter,
  getCharacter,
  jump,
  moveCharacterDown,
} from "./game/character";
import { updateWalls, getWalls } from "./game/wall";
import { isColliding } from "./game/collision";
import { setGameOver, getGameOver } from "./game/gameState";


async function initGame(): Promise<void> {
  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x87ceeb,
  });

  const character = getCharacter();
  document.body.appendChild(app.canvas);

  await createBackground(app);
  window.addEventListener("resize", () => resizeBackground(app));

  drawCharacter();
  setCharacterInitialPosition(app);
  app.stage.addChild(getCharacter());
  
  updateWalls(0, app, app.stage);
  
  let score = 0;
  let displayScore = 0;
  const scoreText = new Text({ text: "0", style: { fontSize: 48, fill: 0xffffff, fontWeight: "bold" } });
  scoreText.x = app.screen.width / 2;
  scoreText.y = 50;
  scoreText.anchor.set(0.5);
  app.stage.addChild(scoreText);


  window.addEventListener("resize", () => onResizeCharacter(app));
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (!getGameOver()) {
        jump();
      }
    }
  });

  function update(delta: number): void {
    if (getGameOver()) {
      return;
    }

    const top = character.height;
    const bottom = app.screen.height - character.height;
        
    if (character.y < bottom) {
      moveCharacterDown(5 * delta);
    }
  
    character.y = Math.min(Math.max(character.y, top), bottom);
    updateWalls(delta, app, app.stage);
    
    const walls = getWalls();

    // Score tracking: detect wall passage with smooth counter animation
    for (const wall of walls) {
      if (!wall.passed && character.x > wall.x + 60) {
        wall.passed = true;
        score++;
      }
      if (isColliding(character, wall.top) || isColliding(character, wall.bottom)) {
        setGameOver();
        return;
      }
    }
    
    // Smooth score animation: interpolate display score towards actual score
    displayScore += (score - displayScore) * 0.15;
    scoreText.text = Math.floor(displayScore).toString();
    scoreText.scale.set(1 + (score - displayScore) * 0.1);
    
    // Keep score on top (move to end of children array)
    app.stage.setChildIndex(scoreText, app.stage.children.length - 1);
  }

  app.ticker.add((ticker) => {
    update(ticker.deltaTime);
  });
}

initGame();
