<template>
  <section id="science" class="science-section">
    <div class="science-head">
      <div>
        <div class="eyebrow soft">{{ t('science.badge') }}</div>
        <h2>{{ t('science.title') }}</h2>
      </div>
      <p>{{ t('science.subtitle') }}</p>
    </div>

    <div class="signal-grid">
      <article v-for="signal in signals" :key="signal.key" class="signal-card">
        <div class="signal-orb" :class="signal.class"></div>
        <div>
          <h3>{{ t(`science.signals.${signal.key}.title`) }}</h3>
          <strong>{{ t(`science.signals.${signal.key}.formula`) }}</strong>
          <p>{{ t(`science.signals.${signal.key}.description`) }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const signals = [
  { key: 'glow', class: 'signal-orange' },
  { key: 'hydration', class: 'signal-green' },
  { key: 'plump', class: 'signal-pink' },
  { key: 'repair', class: 'signal-violet' },
  { key: 'calm', class: 'signal-red' },
  { key: 'firmness', class: 'signal-forest' },
  { key: 'youth', class: 'signal-yellow' },
  { key: 'radiance', class: 'signal-blue' },
]
</script>
