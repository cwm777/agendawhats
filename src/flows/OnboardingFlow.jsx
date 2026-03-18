import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WhatsAppShell, { ChatScrollAnchor } from '../components/WhatsAppShell.jsx'
import ChatBubble, { TypingIndicator, SystemMessage } from '../components/ChatBubble.jsx'
import QuickReplies, { DayPicker } from '../components/QuickReplies.jsx'
import { CheckCircle, ExternalLink } from 'lucide-react'

const STEP = {
  WELCOME: 0,
  NAME: 1,
  SPECIALTY: 2,
  REGISTER: 3,
  DAYS: 4,
  HOURS: 5,
  PRICE: 6,
  POLICY: 7,
  POLICY_HOURS: 8,
  POLICY_PENALTY: 9,
  DONE: 10,
}

export default function OnboardingFlow({ onBack }) {
  const [messages, setMessages] = useState([])
  const [step, setStep] = useState(STEP.WELCOME)
  const [typing, setTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [currentOptions, setCurrentOptions] = useState(null)
  const [selectedDays, setSelectedDays] = useState([])
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [profile, setProfile] = useState({})
  const now = '09:41'

  const addBot = (content, delay = 600) => {
    return new Promise(resolve => {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { id: Date.now() + Math.random(), type: 'bot', content, time: now }])
        resolve()
      }, delay)
    })
  }

  const addUser = (text) => {
    setMessages(m => [...m, { id: Date.now(), type: 'user', text, time: now }])
    setCurrentOptions(null)
    setShowInput(false)
    setShowDayPicker(false)
  }

  useEffect(() => {
    const run = async () => {
      await addBot('Olá! 👋 Bem-vindo ao *SecretarIA*! 🗓️\n\nVou ajudar você a configurar sua agenda inteligente em poucos passos.\n\nQual é o seu nome completo?', 900)
      setShowInput(true)
      setStep(STEP.NAME)
    }
    run()
  }, [])

  const handleInput = async () => {
    if (!inputValue.trim()) return
    const val = inputValue.trim()
    setInputValue('')

    if (step === STEP.NAME) {
      addUser(val)
      setProfile(p => ({ ...p, name: val }))
      await addBot(`Prazer, *${val}*! 😊\n\nQual é a sua especialidade?`, 700)
      setCurrentOptions(['specialty'])
      setStep(STEP.SPECIALTY)
    } else if (step === STEP.REGISTER) {
      addUser(val)
      setProfile(p => ({ ...p, register: val }))
      await addBot('Ótimo! Agora vamos configurar sua disponibilidade. 📅\n\nQuais *dias da semana* você atende?', 700)
      setShowDayPicker(true)
      setStep(STEP.DAYS)
    } else if (step === STEP.PRICE) {
      const num = val.replace(/\D/g, '')
      addUser(`R$ ${num},00`)
      setProfile(p => ({ ...p, price: num }))
      await addBot('Entendido! Agora, vamos definir sua *política de cancelamento* 📋\n\nEscolha uma opção:', 700)
      setCurrentOptions(['policy'])
      setStep(STEP.POLICY)
    } else if (step === STEP.POLICY_HOURS) {
      addUser(`${val}h`)
      setProfile(p => ({ ...p, policyHours: val }))
      await addBot(`Reembolso integral para cancelamentos feitos com até *${val}h* de antecedência.\n\nQual a *multa* para cancelamentos fora do prazo? (%)`, 700)
      setShowInput(true)
      setStep(STEP.POLICY_PENALTY)
    } else if (step === STEP.POLICY_PENALTY) {
      addUser(`${val}%`)
      setProfile(p => ({ ...p, policyPenalty: val }))
      await showDone({ ...profile, policyHours: profile.policyHours, policyPenalty: val })
    }
  }

  const handleSpecialty = async (opt) => {
    addUser(opt)
    setProfile(p => ({ ...p, specialty: opt }))
    const label = opt === 'Psicologia' ? 'CRP' : opt === 'Nutrição' ? 'CRN' : opt === 'Medicina' ? 'CRM' : 'Número de registro'
    await addBot(`Qual é o seu *${label}*?`, 700)
    setShowInput(true)
    setStep(STEP.REGISTER)
  }

  const handleDaysDone = async () => {
    if (selectedDays.length === 0) return
    addUser(selectedDays.join(', '))
    setProfile(p => ({ ...p, days: selectedDays }))
    await addBot('Quais *horários* você atende?', 700)
    setCurrentOptions(['hours'])
    setStep(STEP.HOURS)
  }

  const handleHours = async (opt) => {
    addUser(opt)
    setProfile(p => ({ ...p, hours: opt }))
    await addBot('Qual é o *valor da consulta*? (somente números)', 700)
    setShowInput(true)
    setStep(STEP.PRICE)
  }

  const handlePolicy = async (opt) => {
    addUser(opt)
    if (opt === 'Personalizar') {
      await addBot('Defina o *prazo mínimo* para reembolso integral (em horas):', 700)
      setShowInput(true)
      setStep(STEP.POLICY_HOURS)
    } else {
      let hours = '24', penalty = '50'
      if (opt === 'Reembolso até 48h antes') { hours = '48'; penalty = '50' }
      if (opt === 'Sem reembolso') { hours = '0'; penalty = '100' }
      setProfile(p => ({ ...p, policyHours: hours, policyPenalty: penalty }))
      await showDone({ ...profile, policyHours: hours, policyPenalty: penalty })
    }
  }

  const showDone = async (p) => {
    const finalProfile = { ...profile, ...p }
    await addBot('Tudo configurado! 🎉 Veja o resumo:', 800)
    setMessages(m => [...m, { id: Date.now(), type: 'summary', profile: finalProfile, time: now }])
    await addBot(`Seu número de atendimento está ativo!\n\nCompartilhe o link abaixo com seus pacientes para que eles possam agendar diretamente pelo WhatsApp:`, 1000)
    setMessages(m => [...m, { id: Date.now(), type: 'link', time: now }])
    setStep(STEP.DONE)
    setCurrentOptions(['done'])
  }

  const renderOptions = () => {
    if (currentOptions?.[0] === 'specialty') return (
      <QuickReplies options={['Psicologia', 'Nutrição', 'Medicina', 'Outra']} onSelect={handleSpecialty} />
    )
    if (currentOptions?.[0] === 'hours') return (
      <QuickReplies options={['Manhã (8h–12h)', 'Tarde (13h–18h)', 'Integral (8h–18h)', 'Personalizado']} onSelect={handleHours} />
    )
    if (currentOptions?.[0] === 'policy') return (
      <QuickReplies options={['Reembolso até 24h antes', 'Reembolso até 48h antes', 'Sem reembolso', 'Personalizar']} onSelect={handlePolicy} />
    )
    if (currentOptions?.[0] === 'done') return (
      <QuickReplies options={['Ver meu painel']} onSelect={() => onBack('dashboard')} />
    )
    return null
  }

  return (
    <WhatsAppShell
      title="SecretarIA"
      subtitle="Configuração da agenda"
      avatar="AW"
      onBack={onBack}
    >
      <SystemMessage text="Configuração inicial" />

      {messages.map(msg => {
        if (msg.type === 'bot') return <ChatBubble key={msg.id} message={msg.content} time={msg.time} />
        if (msg.type === 'user') return <ChatBubble key={msg.id} message={msg.text} time={msg.time} isUser />
        if (msg.type === 'summary') return <SummaryCard key={msg.id} profile={msg.profile} time={msg.time} />
        if (msg.type === 'link') return <LinkCard key={msg.id} time={msg.time} />
        return null
      })}

      <AnimatePresence>
        {typing && <TypingIndicator key="typing" />}
      </AnimatePresence>

      {!typing && (
        <>
          {showDayPicker && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="px-1 py-2">
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <p className="text-xs text-gray-500 mb-2 font-medium">Selecione os dias:</p>
                <DayPicker
                  days={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
                  selected={selectedDays}
                  onToggle={d => setSelectedDays(s => s.includes(d) ? s.filter(x => x !== d) : [...s, d])}
                />
                <button
                  onClick={handleDaysDone}
                  disabled={selectedDays.length === 0}
                  className="mt-3 w-full bg-wa-green text-white text-sm font-semibold py-2 rounded-xl disabled:opacity-40"
                >
                  Confirmar dias selecionados
                </button>
              </div>
            </motion.div>
          )}

          {showInput && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="px-1 py-2">
              <div className="flex gap-2">
                <input
                  type={step === STEP.PRICE || step === STEP.POLICY_HOURS || step === STEP.POLICY_PENALTY ? 'number' : 'text'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleInput()}
                  placeholder={
                    step === STEP.NAME ? 'Ex: Dra. Ana Lima' :
                    step === STEP.REGISTER ? 'Ex: CRP 06/123456' :
                    step === STEP.PRICE ? 'Ex: 180' :
                    step === STEP.POLICY_HOURS ? 'Ex: 24' :
                    step === STEP.POLICY_PENALTY ? 'Ex: 50' : ''
                  }
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-wa-green shadow-sm"
                  autoFocus
                />
                <button
                  onClick={handleInput}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-wa-green rounded-full flex items-center justify-center disabled:opacity-40 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {renderOptions()}
        </>
      )}

      <ChatScrollAnchor />
    </WhatsAppShell>
  )
}

function SummaryCard({ profile, time }) {
  return (
    <div className="flex items-end gap-1 mb-1">
      <div className="w-8 h-8 rounded-full bg-wa-green flex items-center justify-center text-white font-bold text-xs flex-shrink-0">AW</div>
      <div>
        <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm overflow-hidden max-w-[280px]">
          <div className="bg-gradient-to-r from-wa-teal to-wa-green p-3 text-white flex items-center gap-2">
            <CheckCircle size={16} />
            <span className="font-semibold text-sm">Configuração Completa</span>
          </div>
          <div className="p-3 space-y-1.5 text-xs">
            <Row label="Nome" value={profile.name} />
            <Row label="Especialidade" value={profile.specialty} />
            <Row label="Registro" value={profile.register} />
            <Row label="Dias" value={(profile.days || []).join(', ')} />
            <Row label="Horários" value={profile.hours} />
            <Row label="Valor" value={`R$ ${profile.price},00`} />
            <div className="border-t border-gray-100 pt-1.5 mt-1">
              <p className="text-gray-500 font-medium mb-1">Política de cancelamento:</p>
              <p className="text-gray-700">
                {profile.policyHours === '0'
                  ? 'Sem reembolso'
                  : `Reembolso integral até ${profile.policyHours}h antes`}
              </p>
              {profile.policyHours !== '0' && (
                <p className="text-gray-600">Multa de {profile.policyPenalty}% após o prazo</p>
              )}
            </div>
          </div>
        </div>
        <div className="text-right pr-1"><span className="text-[10px] text-gray-400">{time}</span></div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 w-20 flex-shrink-0">{label}:</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  )
}

function LinkCard({ time }) {
  return (
    <div className="flex items-end gap-1 mb-1">
      <div className="w-8 h-8 rounded-full bg-wa-green flex items-center justify-center text-white font-bold text-xs flex-shrink-0">AW</div>
      <div>
        <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm p-3 max-w-[260px]">
          <p className="text-xs text-gray-500 mb-2">Compartilhe com seus pacientes:</p>
          <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center gap-2">
            <ExternalLink size={14} className="text-wa-green-dark flex-shrink-0" />
            <span className="text-xs text-wa-green-dark font-medium break-all">wa.me/5511999998888?text=Oi</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">Toque para copiar</p>
        </div>
        <div className="text-right pr-1"><span className="text-[10px] text-gray-400">{time}</span></div>
      </div>
    </div>
  )
}
