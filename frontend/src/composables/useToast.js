import Toast from '../components/Toast.js'

export function showToast(message, type = 'default') {
  if (!message) {
    return
  }

  new Toast({ message, type })
}
