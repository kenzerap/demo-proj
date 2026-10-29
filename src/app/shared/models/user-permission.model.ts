export interface UserPermission {
  data: {
    group_name: string;
    permissions: { [key: string]: string[] };
  };
  status_code: number;
}
