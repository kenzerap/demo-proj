import { ValueCode } from '@app/shared/models/value-code.model';

export enum CategoryCode {
  GroupByPrivilege = 'GROUP_BY_PRIVILEGE',
  GroupByShortcutMenu = 'GROUP_BY_SHORTCUT_MENU',
  GroupByHightlightCard = 'GROUP_BY_HIGHLIGHT_CARD',
}

export const categoryOptions: ValueCode<CategoryCode>[] = [
  { value: 'Group by Privilege', code: CategoryCode.GroupByPrivilege },
  { value: 'Group by shortcut menu', code: CategoryCode.GroupByShortcutMenu },
  {
    value: 'Group by highlight card',
    code: CategoryCode.GroupByHightlightCard,
  },
];
