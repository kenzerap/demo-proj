import { FormGroup } from '@angular/forms';

export const checkIsRedeemedCode = (codeForm: FormGroup): boolean => {
  const formValue = codeForm.getRawValue();
  const isSharedRedeemedCode =
    !!formValue.is_share_quota_allocation && !!formValue.sharedRedeemedQuota;
  const isSingleRedeemedCode = (formValue.codes || []).some((code: any) => {
    return code.redeemed_quota;
  });

  return isSharedRedeemedCode || isSingleRedeemedCode;
};
