import { Application, Graphics } from "pixi.js";

async function initGame(): Promise<void> {
  const app = new Application();
  await app.init({
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  const background = new Graphics();

  function drawBackground(): void {
    background.clear();
    background.rect(0, 0, app.screen.width, app.screen.height);
    background.fill(0x87ceeb);
  }

  drawBackground();

  app.stage.addChild(background);
  window.addEventListener("resize", drawBackground);

  const character = new Graphics();
  const characterSize = 20;
  const characterSpeed = 2;

  function drawCharacter(): void {
    character.clear();
    character.circle(0, 0, characterSize);
    character.fill(0xffd700);
  }

  function setCharacterInitialPosition(): void {
    character.x = characterSize * 2;
    character.y = app.screen.height / 2;
  }

  drawCharacter()
  setCharacterInitialPosition();

  app.stage.addChild(character);

  function moveCharacter(delta: number): void {
    character.x += characterSpeed * delta;
  }

  // function handleCharacterBounds(): void {
  //   if (character.x > app.screen.width + characterSize) {
  //     character.x = -characterSize;
  //   }
  // }

  function update(delta: number): void {
    moveCharacter(delta);
    // handleCharacterBounds();
  }

  app.ticker.add((ticker) => {
    update(ticker.deltaTime);
  });
}

initGame();
