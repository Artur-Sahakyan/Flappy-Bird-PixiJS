import type { Application, Graphics } from "pixi.js";
import { moveCharacterDown } from "./character";
import { updateWalls, getWalls } from "./wall";
import { isColliding } from "./collision";
import { setGameOver, getGameOver } from "./gameState";
import { updateGameOverFrame, updateScoreDisplay, bringUIToFront, type UI } from "./ui";
import type { GameState } from "./gameState";

export function updateCharacter(app: Application, character: Graphics, delta: number): void {
  const top = character.height;
  const bottom = app.screen.height - character.height;
  if (character.y < bottom) moveCharacterDown(5 * delta);
  character.y = Math.min(Math.max(character.y, top), bottom);
}

export function checkCollisionsAndScore(
  app: Application,
  character: Graphics,
  state: GameState,
  ui: UI
): boolean {
  const walls = getWalls();
  for (const wall of walls) {
    if (!wall.passed && character.x > wall.x + 60) {
      wall.passed = true;
      state.score++;
    }
    if (isColliding(character, wall.top) || isColliding(character, wall.bottom)) {
      setGameOver();
      ui.gameOverText.visible = true;
      ui.restartText.visible = true;
      bringUIToFront(app, ui);
      return true;
    }
  }
  return false;
}

export function createGameLoop(
  app: Application,
  character: Graphics,
  ui: UI,
  state: GameState
): (delta: number) => void {
  return function update(delta: number): void {
    if (getGameOver()) {
      updateGameOverFrame(app, ui);
      return;
    }

    updateCharacter(app, character, delta);
    updateWalls(delta, app, app.stage);

    if (checkCollisionsAndScore(app, character, state, ui)) return;

    updateScoreDisplay(ui, state);
    app.stage.setChildIndex(ui.scoreText, app.stage.children.length - 1);
  };
}
