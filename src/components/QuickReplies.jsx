import React from 'react'
import { motion } from 'framer-motion'

export default function QuickReplies({ options, onSelect, disabled }) {
  if (disabled) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 px-1 py-2 justify-center"
    >
      {options.map((opt) => (
        <button
          key={typeof opt === 'string' ? opt : opt.id}
          onClick={() => onSelect(opt)}
          className="bg-white border border-wa-green text-wa-green-dark text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-wa-green hover:text-white transition-all duration-150 active:scale-95"
        >
          {typeof opt === 'string' ? opt : opt.label}
        </button>
      ))}
    </motion.div>
  )
}

export function SlotPicker({ slots, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-2 px-1 py-2"
    >
      {slots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => onSelect(slot)}
          className="bg-white border border-gray-200 rounded-xl p-3 text-left shadow-sm hover:border-wa-green hover:bg-green-50 transition-all duration-150 active:scale-95"
        >
          <p className="text-xs text-gray-500">{slot.day}, {slot.date}</p>
          <p className="font-semibold text-gray-800 text-sm">{slot.time}</p>
        </button>
      ))}
    </motion.div>
  )
}

export function DayPicker({ days, selected, onToggle }) {
  return (
    <div className="flex gap-1.5 flex-wrap py-1">
      {days.map((d) => (
        <button
          key={d}
          onClick={() => onToggle(d)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
            selected.includes(d)
              ? 'bg-wa-green text-white border-wa-green'
              : 'bg-white text-gray-600 border-gray-300 hover:border-wa-green'
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  )
}
