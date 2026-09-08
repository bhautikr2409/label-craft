import toast from 'react-hot-toast';
import { MAX_IMAGE_BYTES } from '../../../constants';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

function isImageFile(file) {
  if (IMAGE_TYPES.has(file.type)) return true;
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

/**
 * Validate a single logo / brand image.
 * @returns {boolean}
 */
export function validateLogoFile(file) {
  if (!file) {
    toast.error('Please choose a logo image.');
    return false;
  }
  if (!isImageFile(file)) {
    toast.error('Logo must be JPG, PNG, or WEBP.');
    return false;
  }
  if (file.size === 0) {
    toast.error('That image appears to be empty.');
    return false;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    toast.error(`Logo must be under ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB.`);
    return false;
  }
  return true;
}
