const STORAGE_KEY = "name-generator-drafts";

/**
 * Load all drafts from localStorage.
 * Returns { activeDraft: string|null, drafts: Record<string, {name, examples, settings}> }
 */
export function loadDrafts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDrafts(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function clearAllDrafts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
