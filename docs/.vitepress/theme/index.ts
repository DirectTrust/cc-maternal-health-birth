import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import type { Theme } from 'vitepress'
import DraftBanner from './DraftBanner.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'layout-top': () => h(DraftBanner) })
} satisfies Theme
