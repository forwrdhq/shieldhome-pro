import Card from '@/components/ui/Card'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">Notification Settings</h2>
          <div className="space-y-4">
            {[
              'SMS alerts to rep on new lead',
              'Slack webhook notifications',
              'Stale lead alerts (daily)',
              'Welcome email to leads',
            ].map(setting => (
              <div key={setting} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700">{setting}</span>
                <div className="w-10 h-6 bg-[#00C853] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">System Info</h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">Configure environment variables in <code className="bg-gray-100 px-1 rounded">.env.local</code></p>
            <p className="text-gray-600">See deployment instructions in the README.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
