import React from 'react'
import { motion } from 'framer-motion'
import { CheckCheck } from 'lucide-react'

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-1 mb-1"
    >
      <div className="w-8 h-8 rounded-full bg-wa-green flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
        AL
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full block" />
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full block" />
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full block" />
      </div>
    </motion.div>
  )
}

export default function ChatBubble({ message, isUser = false, time, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-1 mb-1 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-wa-green flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mb-0.5">
          AL
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-3 py-2 shadow-sm relative ${
          isUser
            ? 'bg-wa-msg-out rounded-br-sm'
            : 'bg-white rounded-bl-sm'
        }`}
      >
        {message && (
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message}</p>
        )}
        {children}
        <div className={`flex items-center gap-1 mt-0.5 ${isUser ? 'justify-end' : 'justify-end'}`}>
          <span className="text-[10px] text-gray-400">{time || '09:41'}</span>
          {isUser && <CheckCheck size={12} className="text-blue-500" />}
        </div>
      </div>
    </motion.div>
  )
}

export function SystemMessage({ text }) {
  return (
    <div className="flex justify-center my-2">
      <span className="bg-[#e1f3fb] text-[#54656f] text-xs px-3 py-1 rounded-full shadow-sm">
        {text}
      </span>
    </div>
  )
}
