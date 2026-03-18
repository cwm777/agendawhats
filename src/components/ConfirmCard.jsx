import React from 'react'
import { CalendarCheck, Clock, MapPin, CreditCard, User } from 'lucide-react'

export default function ConfirmCard({ appointment }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-green-100 max-w-[280px]">
      <div className="bg-gradient-to-r from-wa-teal to-wa-green-dark p-3 text-white">
        <div className="flex items-center gap-2">
          <CalendarCheck size={18} />
          <span className="font-semibold text-sm">Consulta Confirmada ✅</span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <Row icon={<User size={14} className="text-wa-green-dark" />} label={appointment.doctor} />
        <Row icon={<CalendarCheck size={14} className="text-wa-green-dark" />} label={appointment.date} />
        <Row icon={<Clock size={14} className="text-wa-green-dark" />} label={appointment.time} />
        <Row icon={<MapPin size={14} className="text-wa-green-dark" />} label={appointment.address} />
        <div className="border-t border-gray-100 pt-2 mt-2">
          <Row icon={<CreditCard size={14} className="text-green-600" />} label={`Pago: R$ ${appointment.value},00`} valueClass="text-green-600 font-semibold" />
        </div>
        <p className="text-[10px] text-gray-400 text-center pt-1">
          Você receberá um lembrete 24h antes 🔔
        </p>
      </div>
    </div>
  )
}

function Row({ icon, label, valueClass }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex-shrink-0">{icon}</span>
      <span className={`text-xs text-gray-700 ${valueClass || ''}`}>{label}</span>
    </div>
  )
}
