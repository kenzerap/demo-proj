export interface DragDropChange<T> {
  data: T[];
  previousIndex: number;
  currentIndex: number;
}