import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from '../../../assets/assets-keys';
import { DIRECTION } from '../../../common/direction';
import { HandlePlayerInputType } from '../../../types/battle-menu-types';
import { exhaustiveGuard } from '../../../utils/guard';

enum BATTLE_MENU_OPTIONS {
    FIGHT = 'FIGHT',
    SWITCH = 'SWITCH',
    ITEM = 'ITEM',
    FLEE = 'FLEE',
}

const battleUiTextStyle = {
    color: 'black',
    fontSize: '30px',
};

const BATTLE_MENU_CURSOR_POS = {
    x: 42,
    y: 38,
};

export class BattleMenu {
    #scene: Phaser.Scene;
    #mainBattleMenuContainerGameObject: Phaser.GameObjects.Container;
    #moveSelectionSubBattleMenuPhaserContainerGameObject: Phaser.GameObjects.Container;
    #battleTextGameObjectLine1: Phaser.GameObjects.Text;
    #battleTextGameObjectLine2: Phaser.GameObjects.Text;
    #mainBattleMenuCursorPhaserGameObject: Phaser.GameObjects.Image;
    #attackBattleMenuCursorPhaserGameObject: Phaser.GameObjects.Image;
    #selectedBattleMenuOption: BATTLE_MENU_OPTIONS;

    constructor(scene: Phaser.Scene) {
        this.#scene = scene;
        this.#createMainInfoPane();
        this.#createMainBattleMenu();
        this.#createMonsterAttackSubMenu();
        this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    }

    handlePlayerInput(input: HandlePlayerInputType) {
        // console.log(input);
        if (input === 'OK') {
            this.showMonsterAttackSubMenu();
            this.hideMainBattleMenu();
            return;
        }
        if (input === 'CANCEL') {
            this.hideMonsterAttackSubMenu();
            this.showMainBattleMenu();
            return;
        }

        this.#updateSelectedBattleMenuOptionFromInput(input);
        this.#moveMainBattleCursor();

        // console.log(this.#selectedBattleMenuOption);
    }

    showMonsterAttackSubMenu() {
        this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
    }

    hideMonsterAttackSubMenu() {
        this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
    }

    showMainBattleMenu() {
        this.#mainBattleMenuContainerGameObject.setAlpha(1);
        this.#battleTextGameObjectLine1.setAlpha(1);
        this.#battleTextGameObjectLine2.setAlpha(1);

        this.#mainBattleMenuCursorPhaserGameObject.setPosition(
            BATTLE_MENU_CURSOR_POS.x,
            BATTLE_MENU_CURSOR_POS.y,
        );

        this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    }
    hideMainBattleMenu() {
        this.#mainBattleMenuContainerGameObject.setAlpha(0);
        this.#battleTextGameObjectLine1.setAlpha(0);
        this.#battleTextGameObjectLine2.setAlpha(0);
    }

    #createMainBattleMenu() {
        this.#battleTextGameObjectLine1 = this.#scene.add.text(
            20,
            468,
            'what should',
            battleUiTextStyle,
        );
        this.#battleTextGameObjectLine2 = this.#scene.add.text(
            20,
            512,
            `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
            battleUiTextStyle,
        );

        this.#mainBattleMenuCursorPhaserGameObject = this.#scene.add
            .image(
                BATTLE_MENU_CURSOR_POS.x,
                BATTLE_MENU_CURSOR_POS.y,
                UI_ASSET_KEYS.CURSOR,
                0,
            )
            .setOrigin(0.5)
            .setScale(2.5);

        this.#mainBattleMenuContainerGameObject = this.#scene.add.container(
            520,
            448,
            [
                this.#createMainInfoSubPane(),
                this.#scene.add.text(
                    55,
                    22,
                    BATTLE_MENU_OPTIONS.FIGHT,
                    battleUiTextStyle,
                ),
                this.#scene.add.text(
                    240,
                    22,
                    BATTLE_MENU_OPTIONS.SWITCH,
                    battleUiTextStyle,
                ),
                this.#scene.add.text(
                    55,
                    70,
                    BATTLE_MENU_OPTIONS.ITEM,
                    battleUiTextStyle,
                ),
                this.#scene.add.text(
                    240,
                    70,
                    BATTLE_MENU_OPTIONS.FLEE,
                    battleUiTextStyle,
                ),
                this.#mainBattleMenuCursorPhaserGameObject,
            ],
        );

        this.hideMainBattleMenu();
    }

    #createMonsterAttackSubMenu() {
        this.#attackBattleMenuCursorPhaserGameObject = this.#scene.add
            .image(
                42,
                38,
                UI_ASSET_KEYS.CURSOR,
                0,
            )
            .setOrigin(0.5)
            .setScale(2.5);

        this.#moveSelectionSubBattleMenuPhaserContainerGameObject =
            this.#scene.add.container(0, 448, [
                this.#scene.add.text(55, 22, 'slash', battleUiTextStyle),
                this.#scene.add.text(240, 22, 'growl', battleUiTextStyle),
                this.#scene.add.text(55, 70, '-', battleUiTextStyle),
                this.#scene.add.text(240, 70, '-', battleUiTextStyle),
                this.#attackBattleMenuCursorPhaserGameObject
            ]);

        this.hideMonsterAttackSubMenu();
    }

    #createMainInfoPane() {
        const padding = 4;
        const rectangleHeight = 124;
        this.#scene.add
            .rectangle(
                padding,
                this.#scene.scale.height - rectangleHeight - padding,
                this.#scene.scale.width - padding * 2,
                rectangleHeight,
                0xede4f3,
                1,
            )
            .setOrigin(0)
            .setStrokeStyle(8, 0xe4434a, 1);
    }

    #createMainInfoSubPane() {
        const rectangleWidth = 500;
        const rectangleHeight = 124;

        return this.#scene.add
            .rectangle(0, 0, rectangleWidth, rectangleHeight, 0xede4f3, 1)
            .setOrigin(0)
            .setStrokeStyle(8, 0x905ac2, 1);
    }

    #updateSelectedBattleMenuOptionFromInput(direction: DIRECTION) {
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
            switch (direction) {
                case DIRECTION.RIGHT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
                    return;

                case DIRECTION.DOWN:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
                    return;

                case DIRECTION.UP:
                case DIRECTION.LEFT:
                case DIRECTION.NONE:
                    return;

                default:
                    exhaustiveGuard(direction);
            }
            return;
        }
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
            switch (direction) {
                case DIRECTION.LEFT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
                    return;

                case DIRECTION.DOWN:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
                    return;

                case DIRECTION.UP:
                case DIRECTION.RIGHT:
                case DIRECTION.NONE:
                    return;

                default:
                    exhaustiveGuard(direction);
            }
            return;
        }
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
            switch (direction) {
                case DIRECTION.RIGHT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
                    return;

                case DIRECTION.UP:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
                    return;

                case DIRECTION.DOWN:
                case DIRECTION.LEFT:
                case DIRECTION.NONE:
                    return;

                default:
                    exhaustiveGuard(direction);
            }
            return;
        }
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
            switch (direction) {
                case DIRECTION.LEFT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
                    return;

                case DIRECTION.UP:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
                    return;

                case DIRECTION.DOWN:
                case DIRECTION.RIGHT:
                case DIRECTION.NONE:
                    return;

                default:
                    exhaustiveGuard(direction);
            }
            return;
        }
        exhaustiveGuard(this.#selectedBattleMenuOption);
    }

    #moveMainBattleCursor() {
        switch (this.#selectedBattleMenuOption) {
            case BATTLE_MENU_OPTIONS.FIGHT:
                this.#mainBattleMenuCursorPhaserGameObject.setPosition(
                    BATTLE_MENU_CURSOR_POS.x,
                    BATTLE_MENU_CURSOR_POS.y,
                );
                return;
            case BATTLE_MENU_OPTIONS.SWITCH:
                this.#mainBattleMenuCursorPhaserGameObject.setPosition(
                    228,
                    BATTLE_MENU_CURSOR_POS.y,
                );
                return;
            case BATTLE_MENU_OPTIONS.ITEM:
                this.#mainBattleMenuCursorPhaserGameObject.setPosition(
                    BATTLE_MENU_CURSOR_POS.x,
                    86,
                );
                return;
            case BATTLE_MENU_OPTIONS.FLEE:
                this.#mainBattleMenuCursorPhaserGameObject.setPosition(228, 86);
                return;

            default:
                exhaustiveGuard(this.#selectedBattleMenuOption);
        }
    }
}
