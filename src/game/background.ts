import { Assets, Sprite, type Application } from "pixi.js";

let bgSprite: Sprite | null = null;

export async function createBackground(app: Application): Promise<void> {
  await Assets.load("bg-image.jpg");

  bgSprite = Sprite.from("bg-image.jpg");
  resizeBackground(app);

  app.stage.addChildAt(bgSprite, 0);
}

export function resizeBackground(app: Application): void {
  if (!bgSprite) return;
  bgSprite.width = app.screen.width;
  bgSprite.height = app.screen.height;
  bgSprite.x = 0;
  bgSprite.y = 0;
}

