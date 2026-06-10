const STORAGE_KEY = "name-generator-drafts";

/**
 * @typedef {Object} Draft
 * @property {string} id
 * @property {string} name
 * @property {string[]} examples
 * @property {{ count: number, minLength: number, maxLength: number, seed: string }} settings
 * @property {string[]} favorites
 */

/**
 * @typedef {{ activeDraftId: string, drafts: Record<string, Draft> }} DraftsState
 */

/**
 * @param {unknown} data
 * @returns {data is DraftsState}
 */
function validateState(data) {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.activeDraftId !== 'string') return false;
  if (!data.drafts || typeof data.drafts !== 'object') return false;
  for (const d of Object.values(data.drafts)) {
    if (!d || typeof d !== 'object') return false;
    if (typeof d.id !== 'string') return false;
    if (typeof d.name !== 'string') return false;
    if (!Array.isArray(d.examples)) return false;
    if (!d.settings || typeof d.settings !== 'object') return false;
    if (!Array.isArray(d.favorites)) return false;
  }
  return true;
}

export function loadDrafts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!validateState(parsed)) {
      console.warn("generator-db: invalid state structure", parsed);
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn("generator-db: failed to load drafts", err);
    return null;
  }
}

export function saveDrafts(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("generator-db: failed to save drafts", err);
  }
}

export function clearAllDrafts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("generator-db: failed to clear drafts", err);
  }
}
