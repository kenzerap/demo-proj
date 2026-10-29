import { ValueCode } from "@app/shared/models/value-code.model";

export type GroupItem<T extends object> = T & ValueCode;

export interface GroupOption<T extends object = {}> {
  groupName: string;
  groupItems: GroupItem<T>[];
}
