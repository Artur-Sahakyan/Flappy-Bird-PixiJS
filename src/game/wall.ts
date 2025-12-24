import { Graphics, type Application, type Container } from "pixi.js";

export type Wall = {
  top: Graphics;
  bottom: Graphics;
  x: number;
  gapY: number;
  gap: number;
  spacing: number;
  passed: boolean;
};

const walls: Wall[] = [];

const WALL = {
  width: 60,
  speed: 4,

  gapMin: 150,
  gapMax: 600,

  spacingMin: 300,
  spacingMax: 800,

  marginTop: 80,
  marginBottom: 80,
};


function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomGapY(screenH: number, gap: number): number {
  const min = WALL.marginTop;
  const max = screenH - WALL.marginBottom - gap;
  const safeMax = Math.max(min, max);
  return min + Math.random() * (safeMax - min);
}

function makeRect(w: number, h: number): Graphics {
  const g = new Graphics();
  g.rect(0, 0, w, h);
  g.fill(0x00ff00);
  return g;
}

function moveWall(wall: Wall, dt: number): void {
  wall.x -= WALL.speed * dt;
}

function syncWallSprites(wall: Wall): void {
  wall.top.x = wall.x;
  wall.bottom.x = wall.x;
}

function isWallOffScreen(wall: Wall): boolean {
  return wall.x + WALL.width < 0;
}

function destroyWall(wall: Wall, container: Container): void {
  container.removeChild(wall.top, wall.bottom);
  wall.top.destroy();
  wall.bottom.destroy();
}

function shouldCreateNextWall(last: Wall | undefined, screenW: number): boolean {
  return !last || last.x < screenW - last.spacing;
}

export function createWall(app: Application, container: Container): void {
  const gap = randomNumber(WALL.gapMin, WALL.gapMax);
  const spacing = randomNumber(WALL.spacingMin, WALL.spacingMax);
  const gapY = randomGapY(app.screen.height, gap);

  const top = makeRect(WALL.width, gapY);

  const bottomH = app.screen.height - (gapY + gap);
  const bottom = makeRect(WALL.width, Math.max(0, bottomH));

  const x = app.screen.width;

  top.x = x;
  top.y = 0;

  bottom.x = x;
  bottom.y = gapY + gap;

  container.addChild(top, bottom);

  walls.push({ top, bottom, x, gapY, gap, spacing, passed: false });
}

export function updateWalls(dt: number, app: Application, container: Container): void {
  for (let i = walls.length - 1; i >= 0; i--) {
    const wall = walls[i];

    moveWall(wall, dt);
    syncWallSprites(wall);

    // remove when out of screen
    if (isWallOffScreen(wall)) {
      destroyWall(wall, container);
      walls.splice(i, 1);
    }
  }

  const last = walls[walls.length - 1];
  if (shouldCreateNextWall(last, app.screen.width)) {
    createWall(app, container);
  }
}

export function getWalls(): readonly Wall[] {
  return walls;
}

export function resetWalls(container: Container): void {
  for (const wall of walls) {
    destroyWall(wall, container);
  }
  walls.length = 0;
}
