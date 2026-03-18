import React, { useState } from 'react'
import FlowSelector from './components/FlowSelector.jsx'
import PatientFlow from './flows/PatientFlow.jsx'
import OnboardingFlow from './flows/OnboardingFlow.jsx'
import DashboardView from './flows/DashboardView.jsx'

export default function App() {
  const [view, setView] = useState('home')

  const handleBack = (target) => {
    setView(target === 'dashboard' ? 'dashboard' : 'home')
  }

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-full" style={{ maxWidth: 430 }}>
        {view === 'home' && <FlowSelector onSelect={setView} />}
        {view === 'patient' && <PatientFlow onBack={() => setView('home')} />}
        {view === 'onboarding' && <OnboardingFlow onBack={handleBack} />}
        {view === 'dashboard' && <DashboardView onBack={() => setView('home')} />}
      </div>
    </div>
  )
}
