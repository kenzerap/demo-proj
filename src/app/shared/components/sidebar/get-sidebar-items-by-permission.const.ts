import { sidebarItemsMenu } from '@app/shared/constants/sidebar-items-menu.const';
import { checkPermissionsAny } from '@app/shared/directives/has-permissions-directive';
import { SidebarItem } from '@app/shared/models/sidebar-item.model';

export const getSidebarItemsByPermission = (permissions: {
  [key: string]: string[];
}): SidebarItem[] => {
  const newSidebarItems: SidebarItem[] = [];
  sidebarItemsMenu.forEach((sidebarItem) => {
    if (checkPermissionsAny(permissions, sidebarItem.permissions || [])) {
      newSidebarItems.push({
        ...sidebarItem,
        childrens: (sidebarItem.childrens || []).filter((childItem) =>
          checkPermissionsAny(permissions, childItem.permissions || [])
        ),
      });
    }
  });

  return newSidebarItems;
};
