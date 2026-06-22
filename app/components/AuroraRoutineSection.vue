<template>
  <section class="aurora-routine">
    <div class="routine-shell">
      <div class="routine-copy">
        <div class="eyebrow soft">{{ t('auroraRoutine.badge') }}</div>
        <h2>{{ t('auroraRoutine.title') }}</h2>
        <p>
          {{ t('auroraRoutine.subtitle') }}
        </p>

        <div class="routine-profile">
          <span>{{ t('auroraRoutine.profile.dry') }}</span>
          <span>{{ t('auroraRoutine.profile.sensitive') }}</span>
          <span>{{ t('auroraRoutine.profile.redness') }}</span>
          <span>{{ t('auroraRoutine.profile.budget') }}</span>
        </div>
      </div>

      <div class="routine-card">
        <div class="routine-card-head">
          <div>
            <small>{{ t('auroraRoutine.selectedBy') }}</small>
            <h3>{{ t('auroraRoutine.routineTitle') }}</h3>
          </div>
          <strong>{{ totalLabel }}</strong>
        </div>

        <div v-if="pending" class="routine-loading">
          {{ t('auroraRoutine.loading') }}
        </div>

        <div v-else class="routine-list">
          <article
            v-for="(item, index) in routine"
            :key="item.id"
            class="routine-item"
          >
            <div class="routine-index">
              {{ index + 1 }}
            </div>

            <div class="routine-main">
              <div class="routine-line">
                <span class="routine-role">{{ roleLabel(item.routineRole) }}</span>
                <span v-if="isPromo(item)" class="promo-badge">{{ t('auroraRoutine.promo') }}</span>
              </div>

              <h3>{{ item.name }}</h3>
              <p>{{ humanReason(item) }}</p>

              <div class="benefit-row">
                <span
                  v-for="benefit in item.benefits?.slice(0, 3)"
                  :key="benefit.slug"
                >
                  {{ benefit.name }}
                </span>
              </div>
            </div>

            <div class="routine-price">
              <span v-if="isPromo(item)" class="old-price">
                {{ item.price.currency }} {{ item.price.regularPrice }}
              </span>
              <strong>{{ item.price?.currency }} {{ item.price?.finalPrice }}</strong>
            </div>
          </article>
        </div>

        <div class="routine-footer">
          <span>{{ t('auroraRoutine.total') }}</span>
          <strong>{{ totalLabel }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const testCustomerId = '4e3cbef1-cb25-4dea-973c-80ba64534999'

const { data, pending } = await useFetch(
  `/api/aurora/recommendations/customer/${testCustomerId}/routine`,
  {
    query: {
      currency: 'EUR',
      maxTotal: 130,
      limit: 2,
    },
  },
)

const routine = computed(() => data.value?.products ?? [])

const totalLabel = computed(() =>
  data.value ? `€${data.value.total}` : 'Aurora'
)

function isPromo(item: any) {
  return item.price?.source === 'promotion'
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    'barrier-comfort': 'Barrier Comfort',
    hydration: 'Hydration',
    treatment: 'Treatment',
    support: 'Support',
  }

  return t(`auroraRoutine.roles.${role}`)
}

function humanReason(item: any) {
  return t(`auroraRoutine.reasons.${item.reasonCode ?? 'profile_match'}`)
}
</script>
