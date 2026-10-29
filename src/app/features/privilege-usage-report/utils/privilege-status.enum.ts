export enum PrivilegeStatusEnum {
  Published = 'Published',
  Unpublished = 'Unpublished',
}

export function privilegeStatusToBoolean(
  status: PrivilegeStatusEnum | string | null | undefined
): boolean | undefined {
  if (status === PrivilegeStatusEnum.Published) return true;
  if (status === PrivilegeStatusEnum.Unpublished) return false;
  return undefined;
}
