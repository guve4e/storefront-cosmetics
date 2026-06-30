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
          <span v-for="skinType in aurora.skinTypes" :key="`skin-${skinType}`">
            {{ labelForSkinType(skinType) }}
          </span>

          <span v-for="concern in aurora.concerns" :key="`concern-${concern}`">
            {{ labelForConcern(concern) }}
          </span>

          <span>Budget {{ formatMoney(aurora.budget) }}</span>
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

        <div v-if="data?.headline" class="aurora-message">
          <div class="aurora-name">Aurora</div>
          <p>{{ t(`auroraRoutine.headlines.${data.headline}`) }}</p>
        </div>

        <div v-else-if="pending" class="routine-loading">
          {{ t('auroraRoutine.loading') }}
        </div>

        <div class="routine-report-list">
          <article
            v-for="(item, index) in routine"
            :key="item.id"
            class="routine-report-item"
          >
            <div class="routine-step">
              <small>{{ index === 0 ? t('auroraRoutine.morning') : t('auroraRoutine.night') }}</small>
              <div class="routine-number">{{ index + 1 }}</div>
            </div>

            <div class="routine-report-main">
              <div class="routine-line">
                <span class="routine-role">{{ roleLabel(item.routineRole) }}</span>
                <span v-if="isPromo(item)" class="promo-badge">{{ t('auroraRoutine.promo') }}</span>
              </div>

              <h3>{{ item.name }}</h3>
              <p>{{ humanReason(item) }}</p>
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
          <div>
            <small>{{ t('auroraRoutine.complete') }}</small>
            <div>{{ routine.length }} {{ t('auroraRoutine.products') }}</div>
          </div>

          <div>
            <strong>{{ totalLabel }}</strong>
          </div>
        </div>

        <button class="routine-button" @click="addRoutine">
          {{ t('auroraRoutine.addRoutine') }} • {{ totalLabel }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { currency, formatMoney } = useStoreCurrency()
const { t } = useI18n()

const aurora = useAuroraStore()
const cart = useCartStore()

const routineBudget = computed(() => aurora.budget)
const routineSkinTypes = computed(() => aurora.skinTypes)
const routineConcerns = computed(() => aurora.concerns)
const routineRequestVersion = computed(() => aurora.routineRequestVersion)

const { data, pending } = await useAsyncData(
  'aurora-routine-preview',
  () =>
    $fetch('/api/aurora/recommendations/routine-preview', {
      method: 'POST',
      body: {
        skinTypes: routineSkinTypes.value,
        concerns: routineConcerns.value,
        currency: currency.value,
        maxTotal: routineBudget.value,
        limit: 2,
      },
    }),
  {
    watch: [routineRequestVersion],
  },
)

const routine = computed(() => data.value?.products ?? [])

const totalLabel = computed(() =>
  data.value ? formatMoney(data.value.total) : 'Aurora'
)


function labelForSkinType(value: string) {
  const labels: Record<string, string> = {
    dry: t('auroraRoutine.profile.dry'),
    sensitive: t('auroraRoutine.profile.sensitive'),
    combination: 'Combination',
    oily: 'Oily',
  }

  return labels[value] ?? value
}

function labelForConcern(value: string) {
  const labels: Record<string, string> = {
    redness: t('auroraRoutine.profile.redness'),
    dryness: 'Dryness',
    'fine-lines': 'Fine lines',
    pigmentation: 'Pigmentation',
  }

  return labels[value] ?? value
}


function addRoutine() {
  for (const item of routine.value) {
    if (!item.primaryVariant || !item.price) {
      continue
    }

    cart.add({
      variantId: item.primaryVariant.id,
      slug: item.slug,
      name: item.name,
      image: `/images/products/${item.slug}/cart.png`,
      price: item.price.finalPrice,
      quantity: 1,
    })
  }
}

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
