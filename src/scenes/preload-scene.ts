import { Scene } from 'phaser';
import { SCENE_KEYS } from './scene-keys';
import { BATTLE_ASSET_KEYS, BATTLE_BACKGROUND_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS } from '../assets/assets-keys';

export class Preload extends Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE
        });
        console.log(SCENE_KEYS.PRELOAD_SCENE);
    }

    preload() {
        const monsterTammerAssetsPath = 'assets/images/monster-tamer'
        const kennysAssetsPath = 'assets/images/kenneys-assets'

        // battle backgrounds
        this.load.image(BATTLE_BACKGROUND_ASSET_KEYS.FOREST, `${monsterTammerAssetsPath}/battle-backgrounds/forest-background.png`);

        //battle assets    
        this.load.image(BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND, `${kennysAssetsPath}/ui-space-expansion/custom-ui.png`);

        //health bar assets    
        this.load.image(HEALTH_BAR_ASSET_KEYS.RIGHT_CAP, `${kennysAssetsPath}/ui-space-expansion/barHorizontal_green_right.png`);
        this.load.image(HEALTH_BAR_ASSET_KEYS.MIDDLE, `${kennysAssetsPath}/ui-space-expansion/barHorizontal_green_mid.png`);
        this.load.image(HEALTH_BAR_ASSET_KEYS.LEFT_CAP, `${kennysAssetsPath}/ui-space-expansion/barHorizontal_green_left.png`);

        //monstar assets
        this.load.image(MONSTER_ASSET_KEYS.IGUANIGNITE, `${monsterTammerAssetsPath}/monsters/iguanignite.png`);
        this.load.image(MONSTER_ASSET_KEYS.CARNODUSK, `${monsterTammerAssetsPath}/monsters/carnodusk.png`);

    }

    create() {
        this.scene.start(SCENE_KEYS.BATTLE_SCENE)
    }
}
