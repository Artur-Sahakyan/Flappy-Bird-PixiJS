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
import { updateWalls, getWalls, resetWalls } from "./game/wall";
import { isColliding } from "./game/collision";
import { setGameOver, getGameOver, resetGame } from "./game/gameState";


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

  const gameOverText = new Text({ text: "Game Over", style: { fontSize: 64, fill: 0xff0000, fontWeight: "bold" } });
  gameOverText.x = app.screen.width / 2;
  gameOverText.y = app.screen.height / 2 - 50;
  gameOverText.anchor.set(0.5);
  gameOverText.visible = false;
  app.stage.addChild(gameOverText);

  const restartText = new Text({ text: "Press R to restart", style: { fontSize: 32, fill: 0xffffff, fontWeight: "bold" } });
  restartText.x = app.screen.width / 2;
  restartText.y = app.screen.height / 2 + 30;
  restartText.anchor.set(0.5);
  restartText.visible = false;
  app.stage.addChild(restartText);


  window.addEventListener("resize", () => {
    onResizeCharacter(app);
    gameOverText.x = app.screen.width / 2;
    restartText.x = app.screen.width / 2;
  });
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (!getGameOver()) {
        jump();
      }
    }
    if (event.code === "KeyR" && getGameOver()) {
      resetGame();
      setCharacterInitialPosition(app);
      resetWalls(app.stage);
      score = 0;
      displayScore = 0;
      gameOverText.visible = false;
      restartText.visible = false;
    }
  });

  function update(delta: number): void {
    if (getGameOver()) {
      gameOverText.x = app.screen.width / 2;
      gameOverText.y = app.screen.height / 2 - 50;
      restartText.x = app.screen.width / 2;
      restartText.y = app.screen.height / 2 + 30;
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
        gameOverText.visible = true;
        restartText.visible = true;
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
