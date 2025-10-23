const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: 'arcade', arcade: { gravity: { y: 1000 }, debug: false } },
  scene: [BootScene, Level1, Level2, GameOverScene]
};

const game = new Phaser.Game(config);

// BootScene and full game.js code goes here
// (Use the complete game.js provided earlier with all asset URLs)
