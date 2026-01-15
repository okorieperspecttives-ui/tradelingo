"use client";

import { useState } from 'react';
import { useTheme } from '@/lib/theme/ThemeContext';

export default function SettingsForm() {
  const { mode, setMode } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [locale, setLocale] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [notifications, setNotifications] = useState(true);

  function save() {
    // placeholder: would persist to DB
    alert('Settings saved (mock)');
  }

  return (
    <div className="bg-dark-card border border-gold-500/10 rounded-xl p-6 space-y-4">
      <h3 className="font-medium text-gold-500">Account Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm text-gray-400">Display name
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded bg-gray-900 border border-gray-800 text-white" />
        </label>
        <label className="text-sm text-gray-400">Locale
          <select value={locale} onChange={(e) => setLocale(e.target.value)} className="mt-1 w-full px-3 py-2 rounded bg-gray-900 border border-gray-800 text-white">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="ar">العربية</option>
          </select>
        </label>
        <label className="text-sm text-gray-400">Timezone
          <input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="mt-1 w-full px-3 py-2 rounded bg-gray-900 border border-gray-800 text-white" />
        </label>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Theme</label>
          <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} className="px-3 py-2 rounded border border-gold-500/20 text-gold-500">
            Toggle {mode === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input id="notif" type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="h-4 w-4" />
        <label htmlFor="notif" className="text-sm text-gray-400">Enable email notifications</label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={save} className="px-4 py-2 rounded bg-gold-500 text-black font-semibold">Save Changes</button>
      </div>
    </div>
  );
}
