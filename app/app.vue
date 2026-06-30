<template>
  <NuxtPage />
    <AnalyticsConsentBanner />
</template>

<script setup lang="ts">
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: locale,
  },
})
</script>
