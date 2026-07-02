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
  {
    id: 'relatorio',
    label: 'Relatório',
    icon: 'report',
    route: 'relatorio'
  }
]

export const screenTitles = {
  dashboard: 'Início',
  'user-registration': 'Cadastro de Usuário',
  'contributor-registration': 'Cadastro de Contribuinte',
  'user-consultation': 'Consulta de Usuários',
  'contributor-consultation': 'Consulta de Contribuintes',
  'user-edit': 'Editar Usuário',
  'contributor-edit': 'Editar Contribuinte',
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
