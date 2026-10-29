import { DeleteStatus } from './enums/delete-status.enum';

export function checkCustomerStatus(customer: any): string {
  if (customer.party_status === 'UNCONFIRMED') {
    return 'Unconfirmed';
  }

  if (customer.delete_status === DeleteStatus.AWAITING_DELETION) {
    return 'Awaiting Deletion';
  }

  if (customer.is_blocked && customer.is_fraud) {
    return 'Fraud & Blocked';
  }

  if (customer.is_blocked) {
    return 'Blocked';
  }

  if (customer.is_fraud) {
    return 'Fraud';
  }

  return 'Active';
}
