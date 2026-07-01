export const navigationItems = [
  { id: 'inicio', label: 'Início', icon: 'home', route: 'dashboard' },
  {
    id: 'cadastro',
    label: 'Cadastro',
    icon: 'userPlus',
    children: [
      { id: 'cadastro-usuario', label: 'Usuário', route: 'user-registration' },
      { id: 'cadastro-contribuinte', label: 'Contribuinte', route: 'contributor-registration' }
    ]
  },
  {
    id: 'consulta',
    label: 'Consulta',
    icon: 'edit',
    children: [
      { id: 'consulta-usuario', label: 'Usuários', route: 'user-consultation' },
      { id: 'consulta-contribuinte', label: 'Contribuinte', route: 'contributor-consultation' }
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: 'money',
    children: [
      { id: 'financeiro-contribuicoes', label: 'Contribuições', route: 'finance-contribution' },
      { id: 'financeiro-oferta', label: 'Oferta', route: 'finance-offering' },
      { id: 'financeiro-despesas', label: 'Despesas', route: 'finance-expense' }
    ]
  },
  { id: 'relatorio', label: 'Relatório', icon: 'report', route: 'relatorio' }
]

export const screenTitles = {
  dashboard: 'Início',
  'user-registration': 'Cadastro de Usuário',
  'contributor-registration': 'Cadastro de Contribuinte',
  'user-consultation': 'Consulta de Usuários',
  'contributor-consultation': 'Consulta de Contribuintes',
  'finance-contribution': 'Contribuições',
  'finance-offering': 'Oferta',
  'finance-expense': 'Despesas',
  relatorio: 'Relatório',
  profile: 'Perfil'
}

export const quickActions = [
  {
    id: 'contribuinte',
    label: 'Cadastrar Contribuinte',
    targetRoute: 'contributor-registration'
  },
  {
    id: 'contribuicao',
    label: 'Registrar Contribuição',
    targetRoute: 'finance-contribution'
  }
]

export const monthlyRevenueSeries = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  values: [1800, 2100, 1950, 2600, 2300, 2500]
}

export const expenseDistribution = {
  labels: ['Agua e Energia', 'Limpeza', 'Manutencao', 'Material', 'Alimentacao'],
  data: [320, 180, 260, 140, 210],
  colors: ['#945a22', '#ad8866', '#c7a27d', '#d8c3aa', '#6d7386']
}

export const calendarEventsMock = [
  { id: 1, day: 5, label: 'Aniversario: Osvaldo' },
  { id: 2, day: 13, label: 'Aniversario: Milena' },
  { id: 3, day: 15, label: 'Aniversario: Evelyn' },
  { id: 4, day: 20, label: 'Aniversario: Yasmin' }
]

export const stats = [
  {
    id: 'contributors',
    label: 'Total de Contribuintes',
    value: '180',
    icon: 'user'
  },
  {
    id: 'amount',
    label: 'Total arrecadado no mês',
    value: 'R$ 2.500,50',
    icon: 'currency'
  }
]

export const birthdays = [
  { id: 1, name: 'Evelyn Isabel Teodoro', date: '15/05' },
  { id: 2, name: 'Milena Vanessa Marlene', date: '13/05' },
  { id: 3, name: 'Osvaldo Julio Bryan Teodoro', date: '05/05' },
  { id: 4, name: 'Yasmin Vera Rocha', date: '20/05' },
  { id: 5, name: 'Lúcia Isabelle Moreira', date: '31/05' }
]

export const userFormMock = {
  fullName: '',
  username: '',
  password: '',
  email: '',
  accessLevel: '',
  phone: ''
}

export const contributorFormMock = {
  fullName: '',
  address: '',
  phone: '',
  birthDate: '',
  profession: '',
  married: false,
  spouseName: '',
  spousePhone: '',
  spouseBirthDate: ''
}

export const consultationUserRows = [
  { id: 1, name: 'Nome 1', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Secretaria' },
  { id: 2, name: 'Nome 2', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Secretaria' },
  { id: 3, name: 'Nome 3', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Secretaria' },
  { id: 4, name: 'Nome 4', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Administrador' },
  { id: 5, name: 'Nome 5', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Administrador' },
  { id: 6, name: 'Nome 6', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Secretaria' },
  { id: 7, name: 'Nome 7', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Secretaria' }
]

export const consultationContributorRows = [
  { id: 1, name: 'Nome 1', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 2, name: 'Nome 2', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 3, name: 'Nome 3', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 4, name: 'Nome 4', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 5, name: 'Nome 5', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 6, name: 'Nome 6', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 7, name: 'Nome 7', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 8, name: 'Nome 8', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 9, name: 'Nome 9', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 10, name: 'Nome 10', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 11, name: 'Nome 11', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 12, name: 'Nome 12', phone: '(69) 00000-0000', birthDate: '00/00/0000' },
  { id: 13, name: 'Nome 13', phone: '(69) 00000-0000', birthDate: '00/00/0000' }
]

export const financeContributionFormMock = {
  contributor: '',
  contributionType: '',
  amount: '',
  paymentMethod: '',
  paymentDate: '',
  observation: ''
}

export const financeOfferingFormMock = {
  totalAmount: '',
  celebrationType: '',
  date: '',
  observation: ''
}

export const financeExpenseFormMock = {
  category: '',
  observation: '',
  amount: '',
  date: ''
}

export const reportFormMock = {
  type: '',
  startDate: '',
  endDate: ''
}

export const financeCategoryOptions = [
  'Água e Energia',
  'Limpeza e Higiene',
  'Material de Escritório',
  'Manutenção',
  'Alimentação'
]

export const contributionTypeOptions = [
  'Dízimo',
  'Contribuição voluntária'
]

export const celebrationTypeOptions = [
  'Santa Missa',
  'Celebração dominical',
  'Celebração especial',
  'Novena'
]

export const paymentMethodOptions = [
  'Dinheiro',
  'Pix',
  'Cartão'
]

export const reportTypeOptions = [
  'Aniversariantes',
  'Contribuições',
  'Despesas'
]

export const financeContributionRows = [
  { id: 1, category: 'Dízimo', observation: 'Contribuições de domingo', paymentDate: '00/00/0000', amount: 'R$ 220,00' },
  { id: 2, category: 'Contribuição voluntária', observation: 'Campanha solidária', paymentDate: '00/00/0000', amount: 'R$ 150,00' },
  { id: 3, category: 'Dízimo', observation: 'Depósito semanal', paymentDate: '00/00/0000', amount: 'R$ 320,00' },
  { id: 4, category: 'Contribuição voluntária', observation: 'Evento especial', paymentDate: '00/00/0000', amount: 'R$ 180,00' }
]

export const financeOfferingRows = [
  { id: 1, category: 'Santa Missa', observation: 'Oferta da celebração da manhã', paymentDate: '00/00/0000', amount: 'R$ 420,00' },
  { id: 2, category: 'Celebração dominical', observation: 'Oferta da noite', paymentDate: '00/00/0000', amount: 'R$ 380,00' },
  { id: 3, category: 'Novena', observation: 'Oferta especial dos fiéis', paymentDate: '00/00/0000', amount: 'R$ 210,00' }
]

export const financeExpenseRows = [
  {
    id: 1,
    category: 'Água e Energia',
    observation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 2,
    category: 'Limpeza e Higiene',
    observation: 'Duis aute irure dolor in reprehenderit',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 3,
    category: 'Limpeza e Higiene',
    observation: 'Duis aute irure dolor in reprehenderit',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 4,
    category: 'Material de Escritório',
    observation: 'Phasellus eu massa a neque dignissim tincidunt at sed ligula',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 5,
    category: 'Manutenção',
    observation: 'Morbi nec dui ut sapien cursus convallis.',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 6,
    category: 'Alimentação',
    observation: 'Integer at ipsum at purus luctus iaculis',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 7,
    category: 'Manutenção',
    observation: 'Morbi nec dui ut sapien cursus convallis.',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  }
]
