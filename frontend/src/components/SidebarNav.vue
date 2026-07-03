<script setup>
import { ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import AppIcon from "./AppIcon.vue";

defineProps({
  items: {
    type: Array,

    required: true,
  },
});

const emit = defineEmits(["logout"]);

const route = useRoute();

const router = useRouter();

const collapsed = ref(false);

const isGroupActive = (item) =>
  item.children?.some((child) => child.route === route.name);

const navigateTo = (routeName) => {
  router.push({ name: routeName });
};
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <div class="sidebar__top">
      <div class="brand-card">
        <div class="brand-card__mark">
          <AppIcon name="church" />
        </div>

        <div v-if="!collapsed" class="brand-card__text">
          <strong>Comunidade</strong>

          <strong>São Pedro Chanel</strong>
        </div>

        <button
          type="button"
          class="sidebar-toggle"
          :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'"
          @click="collapsed = !collapsed"
        >
          <AppIcon :name="collapsed ? 'sidebarExpand' : 'sidebarCollapse'" />
        </button>
      </div>

      <nav class="sidebar__nav" aria-label="Menu principal">
        <template v-for="item in items" :key="item.id">
          <div v-if="item.children" class="nav-group">
            <button
              type="button"
              class="nav-item"
              :class="{ 'nav-item--active': isGroupActive(item) }"
              @click="navigateTo(item.children[0].route)"
            >
              <AppIcon :name="item.icon" />

              <span>{{ item.label }}</span>
            </button>

            <div v-if="!collapsed && isGroupActive(item)" class="nav-submenu">
              <button
                v-for="child in item.children"
                :key="child.id"
                type="button"
                class="submenu-item"
                :class="{ 'submenu-item--active': child.route === route.name }"
                @click="navigateTo(child.route)"
              >
                <span>{{ child.label }}</span>
              </button>
            </div>
          </div>

          <button
            v-else
            type="button"
            class="nav-item"
            :class="{ 'nav-item--active': item.route === route.name }"
            @click="navigateTo(item.route)"
          >
            <AppIcon :name="item.icon" />

            <span>{{ item.label }}</span>
          </button>
        </template>
      </nav>
    </div>

    <button
      type="button"
      class="nav-item nav-item--logout"
      @click="emit('logout')"
    >
      <AppIcon name="logout" />

      <span>Sair</span>
    </button>
  </aside>
</template>
