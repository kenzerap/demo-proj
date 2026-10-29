export const brands = [
  {
    brand_id: 1,
    brand_name_english: 'Example Brand English',
    brand_name_thai: 'Example Brand Thai',
  },
  {
    brand_id: 3,
    brand_name_english: 'hoangtest111 en',
    brand_name_thai: 'hoangtest111 th',
  },
  {
    brand_id: 4,
    brand_name_english: 'hoangtestEN',
    brand_name_thai: 'hoangtestTH',
  },
];

export const validateInvalid = {
  valid: false,
  gap_rows: [],
  duplicated_rows: [1, 2, 3, 4],
  invalid_rows: [],
  total_rows: 4,
};

export const validateValid = {
  valid: true,
  gap_rows: [],
  duplicated_rows: [],
  invalid_rows: [],
  total_rows: 4,
};

// privilege/inventories/save
export const createInventorySuccess = {
  inventory_id: 7,
  inventory_name: 'hoangtest12',
  description: 'hoangtest12',
  brand_id: 1,
  inventory_type: 'UPLOAD_CODE',
  status: 'INACTIVE',
  expire_date_time: '2025-04-10T16:19:00Z',
};

// privilege/inventories/7/upload-code/summary
export const getInventoryUploadCodeSummarySuccess = {
  inventory_id: 7,
  inventory_name: 'hoangtest12',
  brand_id: 1,
  brand_name: 'Example Brand Thai',
  ready_to_use: 10,
  reserved: 20,
  redeemed: 40,
  used: 5,
  created_date: '2025-04-03T16:22:45.424589Z',
  updated_date: '2025-04-03T16:22:45.424589Z',
  expire_date_time: '2025-04-10T16:19:00Z',
};

// privilege/inventories/7/upload-code
export const uploadCodeInventorySuccess = [
  {
    upload_code_id: 1,
    code_name: 'test upload',
    description: 'Test upload',
    quantity: 100,
    created_date: '2025-01-01T14:24:16.000545+07:00',
    created_by: 'John Doe',
  },
];
