/**
 * Deep-merge saved project data into template defaults (nested objects only).
 * Arrays are replaced entirely when present in patch.
 */
export function mergeSiteData(defaults, patch) {
  if (patch === undefined || patch === null) return defaults;
  if (typeof patch !== 'object' || Array.isArray(patch)) return patch;

  const base = defaults && typeof defaults === 'object' && !Array.isArray(defaults) ? defaults : {};
  const out = { ...base };

  for (const key of Object.keys(patch)) {
    const pv = patch[key];
    const bv = base[key];

    if (Array.isArray(pv)) {
      out[key] = pv;
      continue;
    }
    if (pv !== null && typeof pv === 'object' && bv !== null && typeof bv === 'object' && !Array.isArray(bv)) {
      out[key] = mergeSiteData(bv, pv);
    } else {
      out[key] = pv;
    }
  }

  return out;
}
