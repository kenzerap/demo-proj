export interface SidebarItem {
  title: string;
  code: string;
  iconImg?: string;
  isSelected?: boolean;
  childrens?: SidebarItem[];
  permissions: { feature: string; action: string }[];
}
