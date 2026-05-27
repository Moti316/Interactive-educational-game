// photo-store.js — Profile photos: validate, resize, store as Blob in IndexedDB.
// Per CLAUDE.md security: magic-bytes check (JPEG/PNG/WebP) + canvas re-encode.
// Never trust user-uploaded MIME-type. Output ≤200KB JPEG.

import { put, get, remove, stores } from './db.js';

const MAX_DIMENSION = 256;
const OUTPUT_QUALITY = 0.85;
const MAX_BYTES = 200 * 1024;
const ALLOWED_MAGIC = [
  [0xFF, 0xD8, 0xFF],                         // JPEG
  [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
  // WebP: "RIFF" .... "WEBP"
  [0x52, 0x49, 0x46, 0x46],
];

function checkMagicBytes(buffer) {
  const bytes = new Uint8Array(buffer).slice(0, 12);
  for (const sig of ALLOWED_MAGIC) {
    if (sig.every((b, i) => bytes[i] === b)) {
      // For RIFF, verify WEBP at offset 8
      if (sig[0] === 0x52 && bytes[8] !== 0x57) continue;
      return true;
    }
  }
  return false;
}

function loadImageFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image load failed')); };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error('canvas.toBlob failed')), type, quality);
  });
}

/**
 * Validate + resize + store a photo for a profile.
 * @param {string} profileId
 * @param {File|Blob} file
 * @returns {Promise<{ size: number, type: string }>}
 */
export async function storePhoto(profileId, file) {
  if (!file || !(file instanceof Blob)) throw new Error('No file');
  if (file.size > 10 * 1024 * 1024) throw new Error('הקובץ גדול מדי (מקסימום 10MB)');

  const buf = await file.slice(0, 16).arrayBuffer();
  if (!checkMagicBytes(buf)) throw new Error('סוג קובץ לא נתמך (תמונה בלבד)');

  const img = await loadImageFromBlob(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  let blob = await canvasToBlob(canvas, 'image/jpeg', OUTPUT_QUALITY);
  // Reduce quality if too large
  let q = OUTPUT_QUALITY;
  while (blob.size > MAX_BYTES && q > 0.4) {
    q -= 0.1;
    blob = await canvasToBlob(canvas, 'image/jpeg', q);
  }

  await put(stores.PHOTOS, profileId, blob);
  return { size: blob.size, type: blob.type };
}

export async function getPhotoURL(profileId) {
  const blob = await get(stores.PHOTOS, profileId);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function hasPhoto(profileId) {
  const blob = await get(stores.PHOTOS, profileId);
  return Boolean(blob);
}

export async function removePhoto(profileId) {
  return remove(stores.PHOTOS, profileId);
}
