import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, CheckCircle, CreditCard, Smartphone, Lock } from 'lucide-react'
import { pixCode } from '../data/mockData.js'

export default function PaymentModal({ amount, onSuccess, onClose }) {
  const [tab, setTab] = useState('pix')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => onSuccess(), 1800)
    }, 2000)
  }

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim()
  const formatExpiry = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-white w-full max-w-[430px] rounded-t-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Pagamento</h2>
            <p className="text-wa-green-dark font-semibold text-base">R$ {amount},00</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-1 px-5 pb-3">
          <Lock size={12} className="text-green-600" />
          <span className="text-xs text-green-600">Pagamento seguro e criptografado</span>
        </div>

        {/* Tabs */}
        <div className="flex mx-5 mb-4 bg-gray-100 rounded-xl p-1">
          <TabBtn active={tab === 'pix'} onClick={() => setTab('pix')} icon={<Smartphone size={15} />} label="PIX" />
          <TabBtn active={tab === 'card'} onClick={() => setTab('card')} icon={<CreditCard size={15} />} label="Cartão" />
        </div>

        <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: 'calc(92vh - 180px)' }}>
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <CheckCircle size={64} className="text-green-500" />
                </motion.div>
                <h3 className="font-bold text-xl text-gray-800">Pagamento confirmado!</h3>
                <p className="text-gray-500 text-sm text-center">Sua consulta foi agendada com sucesso.</p>
              </motion.div>
            ) : tab === 'pix' ? (
              <motion.div key="pix" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <PixView amount={amount} copied={copied} onCopy={handleCopy} loading={loading} onPay={handlePay} />
              </motion.div>
            ) : (
              <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CardView card={card} setCard={setCard} formatCard={formatCard} formatExpiry={formatExpiry} loading={loading} onPay={handlePay} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
        active ? 'bg-white shadow text-wa-green-dark' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}{label}
    </button>
  )
}

function PixView({ amount, copied, onCopy, loading, onPay }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-600 text-center">Escaneie o QR Code ou copie o código PIX para pagar</p>

      {/* QR Code simulado */}
      <div className="border-4 border-gray-800 rounded-xl p-2 bg-white shadow-md">
        <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <rect width="160" height="160" fill="white"/>
          {/* QR code pattern simulado */}
          {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
            const pattern = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]]
            return pattern[r][c] ? <rect key={`tl-${r}-${c}`} x={10+c*10} y={10+r*10} width="9" height="9" fill="black"/> : null
          }))}
          {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
            const pattern = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]]
            return pattern[r][c] ? <rect key={`tr-${r}-${c}`} x={80+c*10} y={10+r*10} width="9" height="9" fill="black"/> : null
          }))}
          {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
            const pattern = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]]
            return pattern[r][c] ? <rect key={`bl-${r}-${c}`} x={10+c*10} y={80+r*10} width="9" height="9" fill="black"/> : null
          }))}
          {/* middle dots */}
          {Array.from({length: 40}, (_,i) => (
            <rect key={`m-${i}`} x={10 + (Math.sin(i*2.3)*3+3)*10} y={10 + (Math.cos(i*1.7)*3+3)*10} width="9" height="9" fill="black" opacity="0.8"/>
          ))}
        </svg>
      </div>

      <div className="w-full">
        <p className="text-xs text-gray-500 mb-1.5 font-medium">Código PIX Copia e Cola</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 overflow-hidden">
            <p className="truncate">{pixCode.slice(0, 40)}...</p>
          </div>
          <button
            onClick={onCopy}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="w-full border-t border-gray-100 pt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Consulta Psicologia</span>
          <span className="font-semibold">R$ {amount},00</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Taxa</span>
          <span className="text-green-600 font-medium">Grátis</span>
        </div>
        <button
          onClick={onPay}
          disabled={loading}
          className="w-full bg-wa-green text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-wa-green-dark transition-colors disabled:opacity-70 shadow-md"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Processando...
            </>
          ) : (
            <>Confirmar Pagamento PIX</>
          )}
        </button>
      </div>
    </div>
  )
}

function CardView({ card, setCard, formatCard, formatExpiry, loading, onPay }) {
  const isValid = card.number.replace(/\s/g, '').length === 16 && card.name.length > 2 && card.expiry.length === 5 && card.cvv.length >= 3

  return (
    <div className="space-y-4">
      {/* Card preview */}
      <div className="bg-gradient-to-br from-wa-teal to-wa-green-dark rounded-2xl p-4 text-white shadow-md">
        <div className="flex justify-between items-start mb-6">
          <span className="text-xs opacity-70">AgendaWhats Pay</span>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-full bg-red-400 opacity-80" />
            <div className="w-6 h-6 rounded-full bg-yellow-300 opacity-80 -ml-2" />
          </div>
        </div>
        <p className="font-mono text-lg tracking-widest mb-3">
          {card.number || '•••• •••• •••• ••••'}
        </p>
        <div className="flex justify-between text-xs opacity-80">
          <span>{card.name || 'NOME DO TITULAR'}</span>
          <span>{card.expiry || 'MM/AA'}</span>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 font-medium block mb-1">Número do cartão</label>
        <input
          type="text"
          inputMode="numeric"
          value={card.number}
          onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
          placeholder="0000 0000 0000 0000"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-wa-green transition-colors"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium block mb-1">Nome no cartão</label>
        <input
          type="text"
          value={card.name}
          onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
          placeholder="NOME COMPLETO"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-wa-green transition-colors"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 font-medium block mb-1">Validade</label>
          <input
            type="text"
            inputMode="numeric"
            value={card.expiry}
            onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
            placeholder="MM/AA"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-wa-green transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 font-medium block mb-1">CVV</label>
          <input
            type="text"
            inputMode="numeric"
            value={card.cvv}
            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))}
            placeholder="•••"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-wa-green transition-colors"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Total</span>
          <span className="font-bold text-gray-800">R$ 180,00</span>
        </div>
        <button
          onClick={onPay}
          disabled={loading || !isValid}
          className="w-full bg-wa-green text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-wa-green-dark transition-colors disabled:opacity-50 shadow-md"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Processando...
            </>
          ) : (
            <><Lock size={16} /> Pagar R$ 180,00</>
          )}
        </button>
        {!isValid && <p className="text-xs text-gray-400 text-center mt-2">Preencha todos os campos para continuar</p>}
      </div>
    </div>
  )
}
