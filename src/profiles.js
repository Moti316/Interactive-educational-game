// profiles.js — Profile CRUD (CHG-005 v1, child profiles only for now).
// Parent profiles + PIN + voice recordings come in next iteration.

import * as storage from './storage.js';

const STORAGE_KEY = 'profiles';
const ACTIVE_KEY = 'activeProfileId';

function uuid() {
  return (crypto.randomUUID && crypto.randomUUID()) ||
         `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function list() {
  return storage.get(STORAGE_KEY, []) || [];
}

export function listChildren() {
  return list().filter(p => !p.kind || p.kind === 'child');
}

export function get(id) {
  return list().find(p => p.id === id) || null;
}

export function create({ name, gender = 'neutral', avatarId = 1, kind = 'child' }) {
  const trimmed = (name || '').trim();
  if (!trimmed) throw new Error('שם נדרש');
  const profile = {
    id: uuid(),
    kind,
    name: trimmed,
    gender,
    avatarId: Number(avatarId) || 1,
    createdAt: new Date().toISOString(),
    stars: 0,
    completedTasks: [],
  };
  const arr = list();
  arr.push(profile);
  storage.set(STORAGE_KEY, arr);
  return profile.id;
}

export function update(id, props) {
  const arr = list();
  const idx = arr.findIndex(p => p.id === id);
  if (idx === -1) return false;
  arr[idx] = { ...arr[idx], ...props, id }; // id immutable
  storage.set(STORAGE_KEY, arr);
  return true;
}

export function remove(id) {
  const arr = list();
  const next = arr.filter(p => p.id !== id);
  if (next.length === arr.length) return false;
  storage.set(STORAGE_KEY, next);
  if (getActiveId() === id) storage.remove(ACTIVE_KEY);
  return true;
}

export function setActive(id) {
  if (!get(id)) return false;
  storage.set(ACTIVE_KEY, id);
  return true;
}

export function getActiveId() {
  return storage.get(ACTIVE_KEY, null);
}

export function getActive() {
  const id = getActiveId();
  return id ? get(id) : null;
}

export function clearActive() {
  storage.remove(ACTIVE_KEY);
}

// Game progression helpers ----------------------------------------------------

export function addStars(id, count = 1) {
  const p = get(id);
  if (!p) return false;
  return update(id, { stars: (p.stars || 0) + count });
}

export function markTaskComplete(id, taskId) {
  const p = get(id);
  if (!p) return false;
  const tasks = p.completedTasks || [];
  if (tasks.includes(taskId)) return true; // idempotent
  return update(id, { completedTasks: [...tasks, taskId] });
}
