export interface CreateEditPopupAnnouncementQueryParams {
  id: number;
  bannerName: string;
  bannerDescription: string;
  isPublished: boolean;
  targetGroupId: number;
  pageId: number;
  publishType: string;
  startDateTime: string;
  endDateTime: string;
  dontShowButton: boolean;
  destinationType: string;
  destinationValue: string;
  frequencyCap: number;
  frequencyPeriod: string;
  createdBy: string;
  tierList: { id: number; is_included: boolean }[];
  segmentList: { id: number; is_included: boolean }[];
}
