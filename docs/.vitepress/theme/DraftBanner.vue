<script setup lang="ts">
import { useData } from 'vitepress'

// Rendered into the default theme's `layout-top` slot. Only shown when the build was
// started with DOCS_CHANNEL=draft (see config.mts), which the deploy workflow sets for
// the develop branch only -- so authors never have to add or remove it by hand.
const { theme } = useData()
</script>

<template>
  <div v-if="theme.draft" class="draft-banner" role="note">
    <strong>DRAFT</strong>
    <span>
      Working draft of an upcoming version. Not the published standard.
      <a v-if="theme.publishedUrl" class="vp-raw" :href="theme.publishedUrl">View the current published version</a>
    </span>
  </div>
</template>

<style scoped>
/* Fixed above the nav bar; config.mts sets --vp-layout-top-height to this height so the
   default theme pushes the nav, sidebar and content down by the same amount. */
.draft-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--vp-z-index-layout-top);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: var(--vp-layout-top-height);
  padding: 0 16px;
  background-color: #b45309;
  color: #ffffff;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
}

.draft-banner strong {
  letter-spacing: 0.08em;
}

.draft-banner a {
  margin-left: 6px;
  color: inherit;
  text-decoration: underline;
}
</style>
