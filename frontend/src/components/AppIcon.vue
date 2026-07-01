<script setup>
import { computed } from 'vue'
import {
  Banknote,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleX,
  DollarSign,
  FileText,
  Gift,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  TrendingUp,
  User,
  UserCircle,
  UserPlus,
  Users,
  Wallet
} from '@lucide/vue'
import crossIcon from '../assets/icons/cruz.png'
import homeIcon from '../assets/icons/botao-de-inicio.png'

const imageIcons = {
  church: crossIcon,
  home: homeIcon
}

const iconMap = {
  userPlus: UserPlus,
  edit: Pencil,
  search: Search,
  trash: Trash2,
  money: Banknote,
  currency: DollarSign,
  report: FileText,
  reportFile: FileText,
  logout: LogOut,
  user: User,
  users: Users,
  gift: Gift,
  plus: Plus,
  sidebarCollapse: PanelLeftClose,
  sidebarExpand: PanelLeftOpen,
  cancel: CircleX,
  profile: UserCircle,
  bell: Bell,
  calendar: CalendarDays,
  wallet: Wallet,
  receipt: ReceiptText,
  trending: TrendingUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight
}

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: undefined
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  },
  color: {
    type: String,
    default: undefined
  }
})

const imageSrc = computed(() => imageIcons[props.name] ?? null)
const iconComponent = computed(() => iconMap[props.name] ?? null)

const imageStyle = computed(() => {
  if (!props.size) {
    return undefined
  }

  const value = typeof props.size === 'number' ? `${props.size}px` : props.size

  return {
    width: value,
    height: value
  }
})
</script>

<template>
  <img
    v-if="imageSrc"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="imageSrc"
    :style="imageStyle"
    alt=""
  />

  <component
    v-else-if="iconComponent"
    :is="iconComponent"
    aria-hidden="true"
    class="app-icon"
    :size="size"
    :stroke-width="strokeWidth"
    :color="color"
  />
</template>
