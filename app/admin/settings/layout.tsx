'use client';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-6">
      {children}
    </div>
  )
} 