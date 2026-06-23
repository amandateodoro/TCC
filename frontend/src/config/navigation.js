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
      {
        id: 'financeiro-contribuicoes',
        label: 'Contribuições',
        screen: 'finance-contribution'
      },
      { id: 'financeiro-oferta', label: 'Oferta', screen: 'finance-offering' },
      {
        id: 'financeiro-despesas',
        label: 'Despesas',
        screen: 'finance-expense'
      }
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
