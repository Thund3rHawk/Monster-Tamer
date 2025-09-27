import * as Phaser from 'phaser';
import { Preload } from './scenes/preload-scene';
import { BattleScene } from './scenes/battle-scene';

const config = {
  type: Phaser.AUTO,
  pixelArt: false,
  scale: {
    parent: 'game-container',
    width: 1024,
    height: 576,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#000',
  scene: [Preload, BattleScene],
};

const StartGame = (parent: string) => {
  return new Phaser.Game({ ...config, parent });
};

document.addEventListener('DOMContentLoaded', () => {
  StartGame('game-container');
});
