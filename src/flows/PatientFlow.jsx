import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import WhatsAppShell, { ChatScrollAnchor } from '../components/WhatsAppShell.jsx'
import ChatBubble, { TypingIndicator, SystemMessage } from '../components/ChatBubble.jsx'
import QuickReplies, { SlotPicker } from '../components/QuickReplies.jsx'
import PaymentModal from '../components/PaymentModal.jsx'
import ConfirmCard from '../components/ConfirmCard.jsx'
import { professional, availableSlots, faqAnswers } from '../data/mockData.js'

const STEP = {
  WELCOME: 'welcome',
  MAIN_MENU: 'main_menu',
  SPECIALTY: 'specialty',
  SLOTS: 'slots',
  SLOT_CHOSEN: 'slot_chosen',
  PAYMENT_PROMPT: 'payment_prompt',
  POLICY: 'policy',
  PAYMENT_OPEN: 'payment_open',
  CONFIRMED: 'confirmed',
  FAQ_MENU: 'faq_menu',
  FAQ_ANSWER: 'faq_answer',
  CANCEL_MENU: 'cancel_menu',
  CANCEL_DONE: 'cancel_done',
}

function useTypingDelay(callback, delay) {
  useEffect(() => {
    const t = setTimeout(callback, delay)
    return () => clearTimeout(t)
  }, [])
}

export default function PatientFlow({ onBack }) {
  const [messages, setMessages] = useState([])
  const [step, setStep] = useState(STEP.WELCOME)
  const [typing, setTyping] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [chosenSlot, setChosenSlot] = useState(null)
  const [currentOptions, setCurrentOptions] = useState(null)
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
  }

  // Welcome flow
  useEffect(() => {
    const run = async () => {
      await addBot('👋 Olá! Sou o assistente da *Dra. Ana Lima* 👩‍⚕️\n\nComo posso ajudar você hoje?', 900)
      setCurrentOptions(['main_menu'])
      setStep(STEP.MAIN_MENU)
    }
    run()
  }, [])

  const handleMainMenu = async (opt) => {
    addUser(opt)
    if (opt === 'Agendar consulta') {
      await addBot('Ótimo! Qual especialidade você precisa? 🩺', 700)
      setCurrentOptions(['specialty'])
      setStep(STEP.SPECIALTY)
    } else if (opt === 'Dúvidas sobre procedimentos') {
      await addBot('Claro! Sobre o que você tem dúvidas? 💬', 700)
      setCurrentOptions(['faq_menu'])
      setStep(STEP.FAQ_MENU)
    } else if (opt === 'Cancelar / Reagendar') {
      await addBot('Entendi. Você tem a seguinte consulta agendada:\n\n📅 Terça, 25/03 às 14h00\n👩‍⚕️ Dra. Ana Lima\n\nO que deseja fazer?', 700)
      setCurrentOptions(['cancel_menu'])
      setStep(STEP.CANCEL_MENU)
    }
  }

  const handleSpecialty = async (opt) => {
    addUser(opt)
    await addBot(`Perfeito! Aqui estão os horários disponíveis com a Dra. Ana Lima esta semana 📅`, 700)
    setCurrentOptions(['slots'])
    setStep(STEP.SLOTS)
  }

  const handleSlot = async (slot) => {
    addUser(slot.label)
    setChosenSlot(slot)
    await addBot(
      `Ótimo! Você escolheu:\n📅 ${slot.day}, ${slot.date} às ${slot.time}\n\nA consulta custa *R$ ${professional.consultationPrice},00*.\n\nPara confirmar o agendamento, é necessário realizar o pagamento antecipado. Isso garante sua vaga e evita cancelamentos de última hora. 🔒`,
      900
    )
    setCurrentOptions(['payment_prompt'])
    setStep(STEP.PAYMENT_PROMPT)
  }

  const handlePaymentPrompt = async (opt) => {
    addUser(opt)
    if (opt === 'Ver política de cancelamento') {
      await addBot(
        `📋 *Política de Cancelamento:*\n\n✅ Cancelamento até *24h antes*:\nReembolso integral (100%)\n\n⚠️ Cancelamento após 24h:\nMulta de *50%* do valor da consulta\n\n🔄 Alternativa: Reagendamento gratuito a qualquer momento!`,
        800
      )
      await addBot('Deseja prosseguir com o pagamento?', 600)
      setCurrentOptions(['after_policy'])
      setStep(STEP.POLICY)
    } else {
      setShowPayment(true)
      setStep(STEP.PAYMENT_OPEN)
    }
  }

  const handleAfterPolicy = async (opt) => {
    addUser(opt)
    if (opt === 'Pagar agora') {
      setShowPayment(true)
      setStep(STEP.PAYMENT_OPEN)
    } else {
      await addBot('Tudo bem! Quando quiser agendar, é só me chamar 😊', 600)
      setCurrentOptions(['main_menu'])
      setStep(STEP.MAIN_MENU)
    }
  }

  const handlePaymentSuccess = async () => {
    setShowPayment(false)
    addUser('✅ Pagamento realizado')
    await addBot('Pagamento confirmado! 🎉 Sua consulta está garantida:', 800)
    setMessages(m => [...m, {
      id: Date.now(),
      type: 'confirm_card',
      appointment: {
        doctor: `${professional.name} — ${professional.specialty}`,
        date: `${chosenSlot?.day}, ${chosenSlot?.date}`,
        time: `${chosenSlot?.time}`,
        address: professional.address,
        value: professional.consultationPrice,
      },
      time: now
    }])
    await addBot('Você receberá um lembrete 24h antes da consulta. Até lá! 😊', 1200)
    setCurrentOptions(['back_home'])
    setStep(STEP.CONFIRMED)
  }

  const handleFaq = async (opt) => {
    addUser(opt)
    const answer = faqAnswers[opt]
    await addBot(answer, 700)
    await addBot('Posso ajudar com mais alguma coisa?', 500)
    setCurrentOptions(['main_menu'])
    setStep(STEP.MAIN_MENU)
  }

  const handleCancel = async (opt) => {
    addUser(opt)
    if (opt === 'Cancelar consulta') {
      await addBot(
        `Sua consulta está dentro do prazo de 24h. O reembolso de *R$ 180,00* será processado em até 5 dias úteis na forma de pagamento original. ✅\n\nConsulta cancelada com sucesso!`,
        900
      )
    } else {
      await addBot('Ótimo! Aqui estão os novos horários disponíveis 📅', 700)
      setCurrentOptions(['slots'])
      setStep(STEP.SLOTS)
      return
    }
    await addBot('Posso ajudar com mais alguma coisa?', 600)
    setCurrentOptions(['main_menu'])
    setStep(STEP.MAIN_MENU)
  }

  const handleBackHome = async () => {
    await addBot('Olá novamente! Como posso ajudar? 😊', 600)
    setCurrentOptions(['main_menu'])
    setStep(STEP.MAIN_MENU)
  }

  const renderOptions = () => {
    if (!currentOptions) return null
    const opts = currentOptions[0]

    if (opts === 'main_menu') return (
      <QuickReplies
        options={['Agendar consulta', 'Dúvidas sobre procedimentos', 'Cancelar / Reagendar']}
        onSelect={handleMainMenu}
      />
    )
    if (opts === 'specialty') return (
      <QuickReplies
        options={['Psicologia', 'Nutrição', 'Clínica Geral']}
        onSelect={handleSpecialty}
      />
    )
    if (opts === 'slots') return (
      <SlotPicker slots={availableSlots} onSelect={handleSlot} />
    )
    if (opts === 'payment_prompt') return (
      <QuickReplies
        options={['Pagar agora', 'Ver política de cancelamento']}
        onSelect={handlePaymentPrompt}
      />
    )
    if (opts === 'after_policy') return (
      <QuickReplies
        options={['Pagar agora', 'Agendarei depois']}
        onSelect={handleAfterPolicy}
      />
    )
    if (opts === 'faq_menu') return (
      <QuickReplies
        options={['Como é uma consulta', 'Quanto tempo dura', 'Preciso de encaminhamento']}
        onSelect={handleFaq}
      />
    )
    if (opts === 'cancel_menu') return (
      <QuickReplies
        options={['Cancelar consulta', 'Reagendar consulta']}
        onSelect={handleCancel}
      />
    )
    if (opts === 'back_home') return (
      <QuickReplies
        options={['Voltar ao início']}
        onSelect={handleBackHome}
      />
    )
    return null
  }

  return (
    <>
      <WhatsAppShell
        title={professional.name}
        subtitle={professional.specialty}
        avatar="AL"
        onBack={onBack}
      >
        <SystemMessage text="Hoje" />

        {messages.map(msg => {
          if (msg.type === 'bot') return (
            <ChatBubble key={msg.id} message={msg.content} time={msg.time} />
          )
          if (msg.type === 'user') return (
            <ChatBubble key={msg.id} message={msg.text} time={msg.time} isUser />
          )
          if (msg.type === 'confirm_card') return (
            <div key={msg.id} className="flex items-end gap-1 mb-1">
              <div className="w-8 h-8 rounded-full bg-wa-green flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mb-0.5">AL</div>
              <div>
                <ConfirmCard appointment={msg.appointment} />
                <div className="text-right pr-1">
                  <span className="text-[10px] text-gray-400">{msg.time}</span>
                </div>
              </div>
            </div>
          )
          return null
        })}

        <AnimatePresence>
          {typing && <TypingIndicator key="typing" />}
        </AnimatePresence>

        {!typing && renderOptions()}

        <ChatScrollAnchor />
      </WhatsAppShell>

      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            amount={professional.consultationPrice}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPayment(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
