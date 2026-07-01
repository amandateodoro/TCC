import Toast from '../vendor/toast/Toast.js'

export function showToast(message, type = 'default') {
  if (!message) {
    return
  }

  new Toast({ message, type })
}
