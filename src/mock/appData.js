export const navigationItems = [
  { id: 'inicio', label: 'Início', icon: 'home', screen: 'dashboard' },
  {
    id: 'cadastro',
    label: 'Cadastro',
    icon: 'userPlus',
    children: [
      { id: 'cadastro-usuario', label: 'Usuário', screen: 'user-registration' },
      { id: 'cadastro-contribuinte', label: 'Contribuinte', screen: 'contributor-registration' }
    ]
  },
  {
    id: 'consulta',
    label: 'Consulta',
    icon: 'edit',
    children: [
      { id: 'consulta-usuario', label: 'Usuários', screen: 'user-consultation' },
      { id: 'consulta-contribuinte', label: 'Contribuinte', screen: 'contributor-consultation' }
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: 'money',
    children: [
      { id: 'financeiro-contribuicoes', label: 'Contribuições', screen: 'finance-contribution' },
      { id: 'financeiro-oferta', label: 'Oferta', screen: 'finance-offering' },
      { id: 'financeiro-despesas', label: 'Despesas', screen: 'finance-expense' }
    ]
  },
  { id: 'relatorio', label: 'Relatório', icon: 'report', screen: 'relatorio' }
]

export const quickActions = [
  {
    id: 'contribuinte',
    label: 'Cadastrar Contribuinte',
    targetScreen: 'contributor-registration'
  },
  {
    id: 'contribuicao',
    label: 'Registrar Contribuição',
    targetScreen: 'finance-contribution'
  }
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
  { id: 1, name: 'Evelyn Isabel Souza', date: '15/05' },
  { id: 2, name: 'Milena Vanessa Marlene', date: '13/05' },
  { id: 3, name: 'Osvaldo Julio Bryan Souza', date: '05/05' },
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
