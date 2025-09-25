import { Scene } from 'phaser';
import { SCENE_KEYS } from './scene-keys';
import { BATTLE_ASSET_KEYS, BATTLE_BACKGROUND_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS } from '../assets/assets-keys';

const BATTLE_MENU_OPTIONS = {
    FIGHT: 'FIGHT',
    SWITCH: 'SWITCH',
    ITEM: 'ITEM',
    FLEE: 'FLEE'
}

const battleUiTextStyle = {
    color: 'black',
    fontSize: '30px'
}

export class BattleScene extends Scene {
    constructor() {
        super({
            key: SCENE_KEYS.BATTLE_SCENE
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
        console.log(this.textures.get(BATTLE_BACKGROUND_ASSET_KEYS.FOREST));

        // create main background
        this.add.image(0, 0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0);

        // render out the player and enimies
        this.add.image(768, 144, MONSTER_ASSET_KEYS.CARNODUSK, 0);
        this.add.image(256, 316, MONSTER_ASSET_KEYS.IGUANIGNITE, 0).setFlipX(true)

        // crating the healthbar container
        const playerMonstarName = this.add.text(30, 20, MONSTER_ASSET_KEYS.IGUANIGNITE, {
            color: '#7e3d3f',
            fontSize: '32px',
        })
        // Containerise the whole hp bar thing
        this.add.container(556, 318, [
            this.add.image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
            playerMonstarName,
            this.crateHealthBar(34, 34),
            this.add.text(35 + playerMonstarName.width, 23, 'L5', {
                color: '#ed474b',
                fontSize: '28px',
            }),
            this.add.text(30, 55, 'HP', {
                color: '#ed474b',
                fontSize: '28px',
                fontStyle: 'italic'
            }),
            this.add.text(443, 80, '25/25', {
                color: '#ed474b',
                fontSize: '28px',
                fontStyle: 'italic'
            }).setOrigin(1, 0),
        ])

        // Creating the enemy healthbar container
        const enemyMonstarName = this.add.text(30, 20, MONSTER_ASSET_KEYS.CARNODUSK, {
            color: '#7e3d3f',
            fontSize: '32px',
        })
        // Containerise the whole hp bar thing
        this.add.container(0, 0, [
            this.add.image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(1, 0.8),
            enemyMonstarName,
            this.crateHealthBar(34, 34),
            this.add.text(35 + enemyMonstarName.width, 23, 'L5', {
                color: '#ed474b',
                fontSize: '28px',
            }),
            this.add.text(30, 55, 'HP', {
                color: '#ed474b',
                fontSize: '28px',
                fontStyle: 'italic'
            }),
        ])

        // crating the manu options
        this.createMainInfoPane();
        this.add.container(520, 448, [
            this.createMainInfoSubPane(),
            this.add.text(55, 22, BATTLE_MENU_OPTIONS.FIGHT, battleUiTextStyle),
            this.add.text(240, 22, BATTLE_MENU_OPTIONS.SWITCH, battleUiTextStyle),
            this.add.text(55, 70, BATTLE_MENU_OPTIONS.ITEM, battleUiTextStyle),
            this.add.text(240, 70, BATTLE_MENU_OPTIONS.FLEE, battleUiTextStyle),
        ])

        this.add.container(0, 448, [
            this.add.text (55, 22, 'slash', battleUiTextStyle),
            this.add.text (240, 22, 'growl', battleUiTextStyle),
            this.add.text (55, 70, '-', battleUiTextStyle),
            this.add.text (240, 70, '-', battleUiTextStyle),
        ])
    }

    // custom method for creating the full healthbar 
    crateHealthBar(x: number, y: number) {
        const scaleY = 0.7;

        const left_cap = this.add.image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP).setOrigin(0, 0.5).setScale(1, scaleY); // setScale is used to minimise the size of the health bar
        const middle = this.add.image(left_cap.x + left_cap.width, y, HEALTH_BAR_ASSET_KEYS.MIDDLE).setOrigin(0, 0.5).setScale(1, scaleY);
        middle.displayWidth = 360; // this helps to extend the middle portion of the healthbar
        const right_cap = this.add.image(middle.x + middle.displayWidth, y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP).setOrigin(0, 0.5).setScale(1, scaleY);

        return this.add.container(x, y, [left_cap, middle, right_cap]);
    }

    createMainInfoPane() {
        const padding = 4;
        const rectangleHeight = 124
        this.add.rectangle(padding, this.scale.height - rectangleHeight - padding, this.scale.width - padding * 2, rectangleHeight, 0xede4f3, 1).setOrigin(0).setStrokeStyle(8, 0xe4434a, 1);
    }


    createMainInfoSubPane() {
        const rectangleWidth = 500;
        const rectangleHeight = 124;

        return this.add.rectangle(0, 0, rectangleWidth, rectangleHeight, 0xede4f3, 1).setOrigin(0).setStrokeStyle(8, 0x905ac2, 1)
    }
}
