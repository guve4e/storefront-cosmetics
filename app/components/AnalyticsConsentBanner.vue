<template>
  <div v-if="consent === 'unknown'" class="consent-banner">
    <div>
      <strong>{{ t('analyticsConsent.title') }}</strong>
      <p>{{ t('analyticsConsent.description') }}</p>
    </div>

    <div class="consent-actions">
      <button type="button" class="consent-secondary" @click="reject">
        {{ t('analyticsConsent.reject') }}
      </button>

      <button type="button" class="consent-primary" @click="accept">
        {{ t('analyticsConsent.accept') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { consent, accept, reject } = useAnalyticsConsent()
</script>

<style scoped>
.consent-banner {
  position: fixed;
  z-index: 1000;
  right: 1rem;
  bottom: 1rem;
  max-width: 420px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 20px;
  background: rgba(12, 12, 18, .92);
  backdrop-filter: blur(18px);
  color: white;
  box-shadow: 0 24px 80px rgba(0,0,0,.35);
}

.consent-banner p {
  margin: .35rem 0 0;
  opacity: .78;
  line-height: 1.4;
}

.consent-actions {
  display: flex;
  gap: .75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.consent-actions button {
  border: 0;
  border-radius: 999px;
  padding: .65rem 1rem;
  cursor: pointer;
}

.consent-primary {
  background: white;
  color: #111;
}

.consent-secondary {
  background: rgba(255,255,255,.12);
  color: white;
}

@media (max-width: 767px) {
  .consent-banner {
    right: .75rem;
    left: .75rem;
    bottom: .75rem;
    max-width: none;
    padding: .85rem;
  }

  .consent-banner p {
    display: none;
  }

  .consent-actions {
    margin-top: .75rem;
  }
}
</style>
