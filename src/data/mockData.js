export const professional = {
  name: 'Dra. Ana Lima',
  specialty: 'Psicóloga',
  crp: 'CRP 06/123456',
  phone: '(11) 99999-8888',
  address: 'Rua das Flores, 123 — Sala 45, São Paulo/SP',
  avatar: 'AL',
  consultationPrice: 180,
  policy: {
    refundHours: 24,
    penaltyPercent: 50,
    allowReschedule: true,
  },
  availability: {
    days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  },
}

export const availableSlots = [
  { id: 1, label: 'Segunda, 24/03 às 10h00', day: 'Segunda', date: '24/03', time: '10:00' },
  { id: 2, label: 'Terça, 25/03 às 14h00', day: 'Terça', date: '25/03', time: '14:00' },
  { id: 3, label: 'Quinta, 27/03 às 09h00', day: 'Quinta', date: '27/03', time: '09:00' },
  { id: 4, label: 'Sexta, 28/03 às 15h00', day: 'Sexta', date: '28/03', time: '15:00' },
]

export const mockAppointments = [
  { id: 1, patient: 'Maria Santos', date: 'Hoje, 09:00', value: 180, status: 'confirmed', paid: true },
  { id: 2, patient: 'João Oliveira', date: 'Hoje, 11:00', value: 180, status: 'confirmed', paid: true },
  { id: 3, patient: 'Fernanda Costa', date: 'Hoje, 14:00', value: 180, status: 'confirmed', paid: true },
  { id: 4, patient: 'Carlos Mendes', date: 'Amanhã, 09:00', value: 180, status: 'confirmed', paid: true },
  { id: 5, patient: 'Paula Rodrigues', date: 'Amanhã, 10:00', value: 180, status: 'pending', paid: false },
  { id: 6, patient: 'Rafael Lima', date: 'Amanhã, 14:00', value: 180, status: 'confirmed', paid: true },
  { id: 7, patient: 'Beatriz Alves', date: '26/03, 09:00', value: 180, status: 'cancelled', paid: false },
  { id: 8, patient: 'Thiago Nunes', date: '26/03, 15:00', value: 180, status: 'confirmed', paid: true },
]

export const faqAnswers = {
  'Como é uma consulta': 'A consulta dura 50 minutos. Você e a Dra. Ana conversarão sobre seus objetivos e necessidades. É um espaço acolhedor e sigiloso para você se expressar livremente. 🌱',
  'Quanto tempo dura': 'Cada sessão tem duração de 50 minutos. Sessões de avaliação inicial podem durar até 1h15. ⏱️',
  'Preciso de encaminhamento': 'Não! Você pode agendar diretamente. Não é necessário nenhum tipo de encaminhamento médico para consultas de psicologia. 📋',
}

export const pixCode = '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff817b5a85204000053039865406180.005802BR5915DRA ANA LIMA6009SAO PAULO62070503***6304B14F'
