<script setup>
import { computed } from 'vue'
import {
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Church,
  CircleX,
  DollarSign,
  FileText,
  Gift,
  Home,
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
  UserPlus,
  Users,
  Wallet
} from '@lucide/vue'

const iconMap = {
  church: Church,
  home: Home,
  userPlus: UserPlus,
  edit: Pencil,
  search: Search,
  trash: Trash2,
  money: Banknote,
  currency: DollarSign,
  report: FileText,
  reportFile: FileText,
  logout: LogOut,
  users: Users,
  gift: Gift,
  plus: Plus,
  sidebarCollapse: PanelLeftClose,
  sidebarExpand: PanelLeftOpen,
  cancel: CircleX,
  profile: User,
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

const iconComponent = computed(() => iconMap[props.name] ?? null)
</script>

<template>
  <component
    v-if="iconComponent"
    :is="iconComponent"
    aria-hidden="true"
    class="app-icon"
    :size="size"
    :stroke-width="strokeWidth"
    :color="color"
  />
</template>
