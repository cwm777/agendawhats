import React, { useRef, useEffect } from 'react'
import { ArrowLeft, Phone, Video, MoreVertical, Smile, Paperclip, Mic } from 'lucide-react'

export default function WhatsAppShell({ title, subtitle, avatar, children, onBack }) {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-100 overflow-hidden" style={{ maxWidth: 430, margin: '0 auto' }}>
      {/* Status bar */}
      <div className="bg-wa-teal text-white text-xs px-4 py-1 flex justify-between items-center" style={{ paddingTop: 'env(safe-area-inset-top, 4px)' }}>
        <span className="font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <span>●●●●</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-wa-teal text-white px-2 py-2 flex items-center gap-2 shadow-md">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="w-9 h-9 rounded-full bg-wa-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {avatar || title?.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">{title}</p>
          <p className="text-xs text-green-200 leading-tight truncate">{subtitle || 'online'}</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors"><Video size={20} /></button>
          <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors"><Phone size={20} /></button>
          <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto wa-bg" id="chat-scroll">
        <div className="py-3 px-3 space-y-1 min-h-full">
          {children}
          <div style={{ height: 8 }} />
        </div>
      </div>

      {/* Input bar (decorative) */}
      <div className="bg-gray-100 px-2 py-2 flex items-center gap-2 border-t border-gray-200">
        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
          <Smile size={20} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-400 text-sm flex-1">Mensagem</span>
          <Paperclip size={20} className="text-gray-400 flex-shrink-0" />
        </div>
        <button className="w-10 h-10 bg-wa-green rounded-full flex items-center justify-center shadow-sm">
          <Mic size={20} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export function ChatScrollAnchor() {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  })
  return <div ref={ref} />
}
