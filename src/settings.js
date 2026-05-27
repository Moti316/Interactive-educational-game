// settings.js — Parent dashboard.
// Behind PIN. Shows: profiles list, stars per profile, export/import, Drive status.

import { createButton } from './ui/button.js';
import { speak, attachSpeakOnHover } from './audio.js';
import * as profiles from './profiles.js';
import { getAvatarById } from './ui/avatar-picker.js';
import { downloadBackup, importFromFile } from './backup.js';
import { getDriveStatus, startDriveAuth, signOutDrive, syncNow } from './sync/drive-sync.js';
import { TASKS } from './tasks.js';
import { clearPin } from './pin-entry.js';

export function renderSettings({ onBack } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'screen screen-settings';

  // Header
  const header = document.createElement('div');
  header.className = 'screen-header';
  const title = document.createElement('h1');
  title.className = 'screen-title';
  title.textContent = 'הגדרות הורים';
  attachSpeakOnHover(title, 'הגדרות הורים');
  header.append(title);
  const back = createButton({
    label: '🏠', ariaLabel: 'חזרה למסך פתיחה', variant: 'icon',
    onClick: () => onBack && onBack(),
  });
  header.append(back);
  wrap.append(header);

  const grid = document.createElement('div');
  grid.className = 'settings-grid';

  // Section: profiles
  grid.append(createProfilesSection());
  // Section: backup / restore
  grid.append(createBackupSection());
  // Section: drive sync
  grid.append(createDriveSection());
  // Section: advanced
  grid.append(createAdvancedSection());

  wrap.append(grid);
  return wrap;
}

function makeSection(titleText) {
  const card = document.createElement('section');
  card.className = 'settings-card';
  const h = document.createElement('h2');
  h.className = 'settings-card-title';
  h.textContent = titleText;
  attachSpeakOnHover(h, titleText);
  card.append(h);
  return card;
}

function createProfilesSection() {
  const card = makeSection('פרופילים');
  const list = profiles.listChildren();
  if (list.length === 0) {
    const p = document.createElement('p');
    p.className = 'settings-empty';
    p.textContent = 'אין פרופילים עדיין.';
    card.append(p);
    return card;
  }
  const ul = document.createElement('ul');
  ul.className = 'settings-profile-list';
  for (const p of list) {
    const li = document.createElement('li');
    li.className = 'settings-profile-row';
    const av = getAvatarById(p.avatarId);
    const img = document.createElement('img');
    img.src = `assets/avatars/${av.file}`;
    img.alt = av.name;
    img.className = 'settings-profile-avatar';
    const meta = document.createElement('div');
    meta.className = 'settings-profile-meta';
    const name = document.createElement('div');
    name.className = 'settings-profile-name';
    name.textContent = p.name;
    const stats = document.createElement('div');
    stats.className = 'settings-profile-stats';
    const completed = (p.completedTasks || []).length;
    stats.textContent = `${p.stars || 0} ⭐  ·  ${completed} משימות`;
    meta.append(name, stats);

    const remove = createButton({
      label: 'מחק', variant: 'secondary',
      onClick: () => {
        const ok = confirm(`למחוק את הפרופיל של "${p.name}"? לא ניתן לבטל.`);
        if (!ok) return;
        profiles.remove(p.id);
        speak('הפרופיל נמחק');
        li.remove();
      },
    });
    li.append(img, meta, remove);
    ul.append(li);
  }
  card.append(ul);
  return card;
}

function createBackupSection() {
  const card = makeSection('גיבוי וייבוא');
  const desc = document.createElement('p');
  desc.className = 'settings-desc';
  desc.textContent = 'שמור את כל הנתונים לקובץ או טען קובץ קודם.';
  card.append(desc);

  const row = document.createElement('div');
  row.className = 'settings-row';

  const exportBtn = createButton({
    label: 'ייצוא נתונים', variant: 'primary',
    onClick: async () => {
      try {
        const fname = await downloadBackup();
        speak('הגיבוי נשמר');
        status.textContent = `נשמר: ${fname}`;
      } catch (err) {
        console.error(err);
        status.textContent = 'שגיאה: ' + (err.message || 'לא ידוע');
      }
    },
  });

  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = '.json,application/json';
  importInput.className = 'settings-file-input';
  importInput.id = 'import-input';

  const importBtn = createButton({
    label: 'ייבוא נתונים', variant: 'secondary',
    onClick: () => importInput.click(),
  });

  importInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const res = await importFromFile(file);
      status.textContent = `נטענו: ${res.profiles} פרופילים, ${res.photos} תמונות`;
      speak('הייבוא הושלם');
    } catch (err) {
      console.error(err);
      status.textContent = 'שגיאה: ' + (err.message || 'קובץ לא תקין');
      speak('הייבוא נכשל');
    }
  });

  row.append(exportBtn, importBtn, importInput);
  card.append(row);

  const status = document.createElement('div');
  status.className = 'settings-status';
  card.append(status);
  return card;
}

function createDriveSection() {
  const card = makeSection('סנכרון Google Drive');
  const desc = document.createElement('p');
  desc.className = 'settings-desc';
  card.append(desc);

  const row = document.createElement('div');
  row.className = 'settings-row';
  card.append(row);

  const status = document.createElement('div');
  status.className = 'settings-status';
  card.append(status);

  const refresh = () => {
    const st = getDriveStatus();
    row.replaceChildren();
    if (!st.configured) {
      desc.textContent = 'דרוש OAuth Client ID מ-Google Cloud (ראה PARENT-GUIDE.md).';
      const help = createButton({
        label: 'איך מגדירים?', variant: 'secondary',
        onClick: () => { speak('פתח את PARENT-GUIDE שבתיקיית docs'); },
      });
      row.append(help);
      return;
    }
    desc.textContent = st.signedIn
      ? `מחובר כ-${st.email || 'משתמש'}.`
      : 'הסנכרון מאפשר לשמור התקדמות בענן ולהמשיך מכל מחשב.';
    if (st.signedIn) {
      row.append(createButton({
        label: 'סנכרן עכשיו', variant: 'primary',
        onClick: async () => {
          status.textContent = 'מסנכרן…';
          try {
            const r = await syncNow();
            status.textContent = r.ok ? `סונכרן (${r.profiles} פרופילים)` : 'שגיאה';
          } catch (e) { status.textContent = 'שגיאה: ' + (e.message || ''); }
        },
      }));
      row.append(createButton({
        label: 'התנתק', variant: 'secondary',
        onClick: () => { signOutDrive(); refresh(); },
      }));
    } else {
      row.append(createButton({
        label: 'התחבר ל-Google', variant: 'primary',
        onClick: () => startDriveAuth(),
      }));
    }
  };
  refresh();
  return card;
}

function createAdvancedSection() {
  const card = makeSection('הגדרות מתקדמות');
  const desc = document.createElement('p');
  desc.className = 'settings-desc';
  desc.textContent = `סה"כ ${TASKS.length} משימות זמינות.`;
  card.append(desc);

  const row = document.createElement('div');
  row.className = 'settings-row';

  row.append(createButton({
    label: 'אפס PIN', variant: 'secondary',
    onClick: () => {
      const ok = confirm('לאפס PIN? תצטרך להגדיר חדש בכניסה הבאה.');
      if (!ok) return;
      clearPin();
      speak('PIN אופס');
    },
  }));

  row.append(createButton({
    label: 'אפס הכל', variant: 'secondary',
    onClick: () => {
      const ok = confirm('למחוק את כל הנתונים? לא ניתן לבטל.');
      if (!ok) return;
      const ok2 = confirm('אזהרה אחרונה: כל הפרופילים, ההתקדמות והתמונות יימחקו. להמשיך?');
      if (!ok2) return;
      // Clear local + photos
      import('./storage.js').then(s => s.clear());
      import('./db.js').then(d => d.clear(d.stores.PHOTOS));
      speak('הכל נמחק');
      setTimeout(() => location.reload(), 500);
    },
  }));

  card.append(row);
  return card;
}
