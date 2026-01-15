import SettingsForm from '@/components/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-gold-500">Settings</h1>
          <p className="text-gray-400">Manage your account, preferences, and notifications.</p>
        </div>
      </div>

      <SettingsForm />
    </div>
  );
}
