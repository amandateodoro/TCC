export const navigationItems = [
  { id: 'inicio', label: 'Início', icon: 'home', screen: 'dashboard' },
  {
    id: 'cadastro',
    label: 'Cadastro',
    icon: 'userPlus',
    children: [
      { id: 'cadastro-usuario', label: 'Usuário', screen: 'user-registration' },
      {
        id: 'cadastro-contribuinte',
        label: 'Contribuinte',
        screen: 'contributor-registration'
      }
    ]
  },
  {
    id: 'consulta',
    label: 'Consulta',
    icon: 'edit',
    children: [
      { id: 'consulta-usuario', label: 'Usuários', screen: 'user-consultation' },
      {
        id: 'consulta-contribuinte',
        label: 'Contribuinte',
        screen: 'contributor-consultation'
      }
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: 'money',
    children: [
      { id: 'financeiro-entradas', label: 'Entradas', screen: 'finance-income' },
      { id: 'financeiro-saidas', label: 'Saídas', screen: 'finance-expense' }
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
    targetScreen: 'finance-income'
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
  { id: 1, name: 'Nome 1', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Usuário' },
  { id: 2, name: 'Nome 2', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Usuário' },
  { id: 3, name: 'Nome 3', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Usuário' },
  { id: 4, name: 'Nome 4', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Administrador' },
  { id: 5, name: 'Nome 5', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Administrador' },
  { id: 6, name: 'Nome 6', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Usuário' },
  { id: 7, name: 'Nome 7', phone: '(69) 00000-0000', birthDate: '00/00/0000', accessLevel: 'Usuário' }
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
  { id: 13, name: 'Nome 7', phone: '(69) 00000-0000', birthDate: '00/00/0000' }
]

export const financeIncomeFormMock = {
  category: '',
  description: '',
  amount: '',
  date: ''
}

export const financeExpenseFormMock = {
  category: '',
  description: '',
  amount: '',
  date: ''
}

export const reportFormMock = {
  type: '',
  startDate: '',
  endDate: ''
}

export const financeCategoryOptions = [
  'Dízimos',
  'Oferta',
  'Água e Energia',
  'Limpeza e Higiene',
  'Material de Escritório',
  'Manutenção',
  'Alimentação'
]

export const reportTypeOptions = [
  'Arrecadação mensal',
  'Pagamentos',
  'Contribuintes ativos',
  'Resumo financeiro'
]

export const financeIncomeRows = [
  { id: 1, category: 'Dízimos', description: 'Contribuições de domingo', paymentDate: '00/00/0000', amount: 'R$ 220,00' },
  { id: 2, category: 'Oferta', description: 'Campanha solidária', paymentDate: '00/00/0000', amount: 'R$ 150,00' },
  { id: 3, category: 'Dízimos', description: 'Depósito semanal', paymentDate: '00/00/0000', amount: 'R$ 320,00' },
  { id: 4, category: 'Oferta', description: 'Evento especial', paymentDate: '00/00/0000', amount: 'R$ 180,00' }
]

export const financeExpenseRows = [
  {
    id: 1,
    category: 'Água e Energia',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 2,
    category: 'Limpeza e Higiene',
    description: 'Duis aute irure dolor in reprehend',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 3,
    category: 'Limpeza e Higiene',
    description: 'Duis aute irure dolor in reprehend',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 4,
    category: 'Material de Escritório',
    description: 'Phasellus eu massa a neque dignissim tincidunt at sed ligula',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 5,
    category: 'Manutenção',
    description: 'Morbi nec dui ut sapien cursus convallis.',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 6,
    category: 'Alimentação',
    description: 'Integer at ipsum at purus luctus iaculis',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  },
  {
    id: 7,
    category: 'Manutenção',
    description: 'Morbi nec dui ut sapien cursus convallis.',
    paymentDate: '00/00/0000',
    amount: 'R$ 10,00'
  }
]
