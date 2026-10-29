import { ValueCode } from '../../../models/value-code.model';

export enum ColumnType {
  DragDrop = 'dragDrop',
  Date = 'date',
  String = 'string',
  DateTime = 'datetime',
  Phone = 'phone',
  SecurityNo = 'securityNo',
  Number = 'number',
  Point = 'point',
  Custom = 'custom',
}

export interface TableColumn extends ValueCode {
  type: ColumnType;
  width?: string;
  isSortable?: boolean;
}
