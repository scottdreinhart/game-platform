import React, { createContext, useMemo, useState } from 'react'

interface SoundContextType {
  muted: boolean
  setMuted: (muted: boolean) => void
}

export const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false)

  const value = useMemo(() => ({ muted, setMuted }), [muted])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSoundContext() {
  const context = React.useContext(SoundContext)
  if (!context) {
    throw new Error('useSoundContext must be used within SoundProvider')
  }
  return context
}
