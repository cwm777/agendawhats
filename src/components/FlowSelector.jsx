import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, UserPlus, LayoutDashboard, MessageCircle } from 'lucide-react'

const flows = [
  {
    id: 'patient',
    icon: <MessageCircle size={28} className="text-wa-green" />,
    title: 'Sou Paciente',
    subtitle: 'Agendar consulta via chat',
    badge: 'Demo interativo',
    color: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
  },
  {
    id: 'onboarding',
    icon: <UserPlus size={28} className="text-blue-500" />,
    title: 'Sou Profissional',
    subtitle: 'Configurar minha agenda',
    badge: 'Onboarding',
    color: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
  },
  {
    id: 'dashboard',
    icon: <LayoutDashboard size={28} className="text-purple-500" />,
    title: 'Painel do Profissional',
    subtitle: 'Gerencie agendamentos',
    badge: 'Dashboard',
    color: 'from-purple-50 to-violet-50',
    border: 'border-purple-200',
  },
]

export default function FlowSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wa-teal to-wa-green-dark flex flex-col items-center justify-center px-5 py-10" style={{ maxWidth: 430, margin: '0 auto' }}>
      {/* Logo area */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-4">
          <span className="text-4xl">📅</span>
        </div>
        <h1 className="text-3xl font-bold text-white">AgendaWhats</h1>
        <p className="text-green-200 mt-1 text-sm">Gestão de agenda para profissionais de saúde</p>
      </motion.div>

      {/* Flow cards */}
      <div className="w-full space-y-3">
        {flows.map((flow, i) => (
          <motion.button
            key={flow.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
            onClick={() => onSelect(flow.id)}
            className={`w-full bg-gradient-to-r ${flow.color} border ${flow.border} rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-left`}
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              {flow.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-gray-800 text-base">{flow.title}</h3>
                <span className="text-[10px] bg-white/70 text-gray-500 px-2 py-0.5 rounded-full font-medium border border-gray-200">
                  {flow.badge}
                </span>
              </div>
              <p className="text-sm text-gray-500">{flow.subtitle}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-green-200 text-xs">Mockup funcional · Dados simulados</p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="text-white/60 text-[10px]">✓ Agendamento conversacional</span>
          <span className="text-white/60 text-[10px]">✓ Pagamento antecipado</span>
          <span className="text-white/60 text-[10px]">✓ Sem no-show</span>
        </div>
      </motion.div>
    </div>
  )
}
