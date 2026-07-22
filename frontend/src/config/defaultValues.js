export const REQUIRED_FIELDS_MESSAGE = 'Preencha todos os campos obrigatórios.'

export const userFormDefaults = {
  fullName: '',
  username: '',
  password: '',
  email: '',
  accessLevel: '',
  phone: ''
}

export const contributorFormDefaults = {
  fullName: '',
  address: '',
  phone: '',
  birthDate: '',
  profession: '',
  married: false,
  spouseName: '',
  spousePhone: '',
  spouseBirthDate: '',
  spouseProfession: ''
}

export const financeContributionFormDefaults = {
  contributor: '',
  contributionType: '',
  amount: '',
  paymentMethod: '',
  paymentDate: '',
  observation: ''
}

export const financeOfferingFormDefaults = {
  totalAmount: '',
  celebrationType: '',
  date: '',
  observation: ''
}

export const financeExpenseFormDefaults = {
  category: '',
  observation: '',
  amount: '',
  date: ''
}

export const reportFormDefaults = {
  type: '',
  startDate: '',
  endDate: ''
}
