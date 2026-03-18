import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, DollarSign, Users, TrendingUp, Bell,
  Settings, ChevronRight, CheckCircle, XCircle, AlertCircle,
  Phone, MessageCircle, MoreVertical, ArrowLeft
} from 'lucide-react'
import { professional, mockAppointments } from '../data/mockData.js'

const STATUS = {
  confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle size={12} /> },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-600', icon: <XCircle size={12} /> },
}

const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

const weekSchedule = {
  'Seg': { '09:00': 'Maria S.', '11:00': 'João O.', '14:00': 'Paula R.' },
  'Ter': { '09:00': 'Carlos M.', '10:00': 'Rafael L.', '15:00': 'Fernanda C.' },
  'Qua': { '09:00': null, '14:00': 'Beatriz A.' },
  'Qui': { '10:00': 'Thiago N.', '15:00': 'Ana M.' },
  'Sex': { '09:00': 'Pedro S.', '11:00': 'Luciana F.' },
}

export default function DashboardView({ onBack }) {
  const [tab, setTab] = useState('today')
  const todayAppts = mockAppointments.slice(0, 3)
  const weekAppts = mockAppointments
  const monthRevenue = mockAppointments.filter(a => a.status === 'confirmed').reduce((s, a) => s + a.value, 0)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-wa-teal text-white px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button className="relative p-1.5 rounded-full hover:bg-white/10">
              <Bell size={20} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-400 rounded-full" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-white/10">
              <Settings size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-wa-green flex items-center justify-center text-white font-bold text-lg shadow-md">
            {professional.avatar}
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{professional.name}</h1>
            <p className="text-green-200 text-sm">{professional.specialty} · {professional.crp}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={<Users size={16} />} label="Hoje" value="3" sub="consultas" />
          <StatCard icon={<Calendar size={16} />} label="Semana" value="8" sub="agendados" />
          <StatCard icon={<DollarSign size={16} />} label="Mês" value={`R$${monthRevenue / 1000 | 0}k`} sub="receita" />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab navigation */}
        <div className="flex bg-white border-b border-gray-100 px-4 pt-1">
          {[['today', 'Hoje'], ['week', 'Semana'], ['agenda', 'Agenda']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                tab === key ? 'border-wa-green text-wa-green-dark' : 'border-transparent text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {tab === 'today' && (
            <>
              <SectionHeader title="Próximas consultas" action="Ver todas" />
              {todayAppts.map((apt, i) => (
                <AppointmentCard key={apt.id} apt={apt} index={i} />
              ))}
              <SectionHeader title="Resumo financeiro" />
              <FinanceSummary appointments={mockAppointments} />
            </>
          )}

          {tab === 'week' && (
            <>
              <SectionHeader title="Todos os agendamentos" action={`${weekAppts.length} total`} />
              {weekAppts.map((apt, i) => (
                <AppointmentCard key={apt.id} apt={apt} index={i} />
              ))}
            </>
          )}

          {tab === 'agenda' && (
            <>
              <SectionHeader title="Grade semanal" />
              <WeekGrid />
              <SectionHeader title="Configurações rápidas" />
              <QuickSettings />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 text-center">
      <div className="flex items-center justify-center gap-1 text-green-200 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-bold text-lg leading-tight">{value}</p>
      <p className="text-[10px] text-green-200">{sub}</p>
    </div>
  )
}

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-gray-700 text-sm">{title}</h2>
      {action && <span className="text-xs text-wa-green-dark font-medium">{action}</span>}
    </div>
  )
}

function AppointmentCard({ apt, index }) {
  const s = STATUS[apt.status]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wa-green to-wa-teal flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {apt.patient.split(' ').map(n => n[0]).slice(0,2).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{apt.patient}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock size={11} className="text-gray-400" />
          <span className="text-xs text-gray-500">{apt.date}</span>
          {apt.paid && (
            <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-medium">Pago</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${s.color}`}>
          {s.icon}{s.label}
        </span>
        <span className="text-xs font-semibold text-gray-700">R$ {apt.value}</span>
      </div>
      <div className="flex flex-col gap-1 ml-1">
        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><MessageCircle size={15} /></button>
        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><Phone size={15} /></button>
      </div>
    </motion.div>
  )
}

function FinanceSummary({ appointments }) {
  const confirmed = appointments.filter(a => a.status === 'confirmed')
  const cancelled = appointments.filter(a => a.status === 'cancelled')
  const revenue = confirmed.reduce((s, a) => s + a.value, 0)
  const pendingCount = appointments.filter(a => a.status === 'pending').length

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <FinRow label="Receita confirmada" value={`R$ ${revenue}`} color="text-green-600" />
        <FinRow label="Consultas realizadas" value={`${confirmed.length}`} color="text-blue-600" />
        <FinRow label="Cancelamentos" value={`${cancelled.length}`} color="text-red-500" />
        <FinRow label="Pendentes" value={`${pendingCount}`} color="text-yellow-600" />
      </div>
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-green-500" />
          <span className="text-xs text-gray-600">Taxa de no-show: <strong className="text-green-600">0%</strong> (vs 34% sem pagamento antecipado)</span>
        </div>
      </div>
    </div>
  )
}

function FinRow({ label, value, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2.5">
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <p className={`font-bold text-base ${color}`}>{value}</p>
    </div>
  )
}

function WeekGrid() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[380px]">
          {/* Day headers */}
          <div className="grid grid-cols-6 border-b border-gray-100">
            <div className="p-2 text-center text-[10px] text-gray-400 font-medium" />
            {weekDays.map(d => (
              <div key={d} className="p-2 text-center text-xs font-semibold text-gray-600 border-l border-gray-50">{d}</div>
            ))}
          </div>
          {/* Time rows */}
          {timeSlots.map(time => (
            <div key={time} className="grid grid-cols-6 border-b border-gray-50 last:border-0">
              <div className="p-1.5 text-center text-[9px] text-gray-400 self-center">{time}</div>
              {weekDays.map(day => {
                const patient = weekSchedule[day]?.[time]
                return (
                  <div key={day} className="p-1 border-l border-gray-50">
                    {patient !== undefined ? (
                      <div className={`rounded-lg px-1.5 py-1 text-[9px] font-medium leading-tight ${
                        patient ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-300 border border-dashed border-gray-200'
                      }`}>
                        {patient || 'Livre'}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QuickSettings() {
  const items = [
    { label: 'Disponibilidade', sub: 'Seg–Sex, 9h–17h', icon: <Calendar size={16} className="text-wa-green-dark" /> },
    { label: 'Valor da consulta', sub: 'R$ 180,00', icon: <DollarSign size={16} className="text-wa-green-dark" /> },
    { label: 'Política de cancelamento', sub: 'Reembolso até 24h antes · 50% multa', icon: <AlertCircle size={16} className="text-wa-green-dark" /> },
    { label: 'Notificações', sub: 'Ativadas · 24h antes', icon: <Bell size={16} className="text-wa-green-dark" /> },
  ]
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {items.map((item, i) => (
        <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${i > 0 ? 'border-t border-gray-50' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">{item.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800">{item.label}</p>
            <p className="text-xs text-gray-400 truncate">{item.sub}</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}
