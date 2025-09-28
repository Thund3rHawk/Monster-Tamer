import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from '../../../assets/assets-keys';
import { DIRECTION } from '../../../common/direction';
import { HandlePlayerInputType } from '../../../types/battle-menu-types';
import { exhaustiveGuard } from '../../../utils/guard';
import { BATTLE_UI_TEXT_STYLE } from './battle-menu-config';
import {
  ACTIVE_BATTLE_MENU,
  ATATCK_MOVE_OPTIONS,
  BATTLE_MENU_OPTIONS,
} from './battle-menu-options';

export const BATTLE_MENU_CURSOR_POS = {
  x: 42,
  y: 38,
};

export const ATTACK_MENU_CURSOR_POS = {
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
  #selectedAttackMenuOption: ATATCK_MOVE_OPTIONS;
  #activeBattleMenu: ACTIVE_BATTLE_MENU;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
    this.#createMainInfoPane();
    this.#createMainBattleMenu();
    this.#createMonsterAttackSubMenu();
    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_1;
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

    this.#updateSelectionMoveMenuOptionFromInput(input);
    this.#moveMoveSelectBattleMenuCursor();
    // console.log(this.#selectedBattleMenuOption);
  }

  showMonsterAttackSubMenu() {
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT;
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
  }

  hideMonsterAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
  }

  showMainBattleMenu() {
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
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
      BATTLE_UI_TEXT_STYLE,
    );
    this.#battleTextGameObjectLine2 = this.#scene.add.text(
      20,
      512,
      `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
      BATTLE_UI_TEXT_STYLE,
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
          BATTLE_UI_TEXT_STYLE,
        ),
        this.#scene.add.text(
          240,
          22,
          BATTLE_MENU_OPTIONS.SWITCH,
          BATTLE_UI_TEXT_STYLE,
        ),
        this.#scene.add.text(
          55,
          70,
          BATTLE_MENU_OPTIONS.ITEM,
          BATTLE_UI_TEXT_STYLE,
        ),
        this.#scene.add.text(
          240,
          70,
          BATTLE_MENU_OPTIONS.FLEE,
          BATTLE_UI_TEXT_STYLE,
        ),
        this.#mainBattleMenuCursorPhaserGameObject,
      ],
    );

    this.hideMainBattleMenu();
  }

  #createMonsterAttackSubMenu() {
    this.#attackBattleMenuCursorPhaserGameObject = this.#scene.add
      .image(42, 38, UI_ASSET_KEYS.CURSOR, 0)
      .setOrigin(0.5)
      .setScale(2.5);

    this.#moveSelectionSubBattleMenuPhaserContainerGameObject =
      this.#scene.add.container(0, 448, [
        this.#scene.add.text(55, 22, 'slash', BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 22, 'growl', BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(55, 70, '-', BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 70, '-', BATTLE_UI_TEXT_STYLE),
        this.#attackBattleMenuCursorPhaserGameObject,
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
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
      return;
    }
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
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
      return;
    }
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

  #updateSelectionMoveMenuOptionFromInput(direction: DIRECTION) {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return;
    }
    if (this.#selectedAttackMenuOption === ATATCK_MOVE_OPTIONS.MOVE_1) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_2;
          return;
        case DIRECTION.DOWN:
          this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_3;
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
    if (this.#selectedAttackMenuOption === ATATCK_MOVE_OPTIONS.MOVE_2) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_1;
          return;
        case DIRECTION.DOWN:
          this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_4;
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
    if (this.#selectedAttackMenuOption === ATATCK_MOVE_OPTIONS.MOVE_3) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_4;
          return;
        case DIRECTION.UP:
          this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_1;
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
    if (this.#selectedAttackMenuOption === ATATCK_MOVE_OPTIONS.MOVE_4) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_3;
          return;
        case DIRECTION.UP:
          this.#selectedAttackMenuOption = ATATCK_MOVE_OPTIONS.MOVE_2;
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
    exhaustiveGuard(this.#selectedAttackMenuOption);
  }

  #moveMoveSelectBattleMenuCursor() {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return;
    }
    switch (this.#selectedAttackMenuOption) {
      case ATATCK_MOVE_OPTIONS.MOVE_1:
        this.#attackBattleMenuCursorPhaserGameObject.setPosition(
          ATTACK_MENU_CURSOR_POS.x,
          ATTACK_MENU_CURSOR_POS.y,
        );
        return;
      case ATATCK_MOVE_OPTIONS.MOVE_2:
        this.#attackBattleMenuCursorPhaserGameObject.setPosition(
          226,
          ATTACK_MENU_CURSOR_POS.y,
        );
        return;
      case ATATCK_MOVE_OPTIONS.MOVE_3:
        this.#attackBattleMenuCursorPhaserGameObject.setPosition(
          ATTACK_MENU_CURSOR_POS.x,
          86,
        );
        return;
      case ATATCK_MOVE_OPTIONS.MOVE_4:
        this.#attackBattleMenuCursorPhaserGameObject.setPosition(228, 86);
        return;
      default:
        exhaustiveGuard(this.#selectedAttackMenuOption);
    }
  }
}
