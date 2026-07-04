import Toast from '../config/Toast.js'

export function showToast(message, type = 'default') {
  if (!message) {
    return
  }

  new Toast({ message, type })
}
