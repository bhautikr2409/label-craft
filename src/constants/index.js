/** Max PDF size allowed for in-browser processing (25 MB). */
export const MAX_PDF_BYTES = 25 * 1024 * 1024;

/** Max number of PDFs that can be merged in one session. */
export const MAX_MERGE_FILES = 20;

/** Max combined size of all PDFs selected for merge (100 MB). */
export const MAX_MERGE_TOTAL_BYTES = 100 * 1024 * 1024;

/** Max size for a single image when converting Image → PDF (15 MB). */
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

/** Max number of images that can be converted into one PDF. */
export const MAX_IMAGE_FILES = 30;

export const ZOOM = {
  MIN: 0.5,
  MAX: 3,
  STEP: 0.2,
  DEFAULT: 1,
};

export const MIN_CROP_SIZE = 10;

/** Support inbox used by the contact form. */
export const CONTACT_EMAIL = 'bhautikrakholiyawork@gmail.com';
