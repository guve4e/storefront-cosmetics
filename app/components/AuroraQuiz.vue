<template>
  <section id="aurora" class="aurora-quiz">
    <div class="aurora-quiz-shell">
      <div class="aurora-quiz-copy">
        <div class="eyebrow">MEET AURORA</div>
        <h2>Your personal skincare guide.</h2>
        <p>
          Aurora builds a ritual by understanding your skin first — then matching it
          with ingredients, budget and active offers.
        </p>
      </div>

      <div class="aurora-quiz-panel intelligent">
        <div class="aurora-status">
          <span></span>
          Aurora is listening
        </div>

        <div class="aurora-dialogue">
          <div class="aurora-bubble">
            {{ currentQuestion.prompt }}
          </div>

          <div v-if="selectedSummary" class="user-bubble">
            {{ selectedSummary }}
          </div>

          <div v-if="step > 0" class="aurora-bubble soft">
            {{ currentQuestion.context }}
          </div>
        </div>

        <div class="smart-options">
          <button
            v-for="option in currentQuestion.options"
            :key="option.value"
            :class="{ active: isSelected(option.value) }"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <button class="quiz-build" @click="nextStep">
          {{ isLastStep ? 'Build my routine' : 'Continue' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { formatMoney } = useStoreCurrency()
const step = ref(0)
const selectedSkinTypes = ref<string[]>(['dry', 'sensitive'])
const selectedConcerns = ref<string[]>(['redness'])
const selectedBudget = ref(130)

const aurora = useAuroraStore()

const questions = [
  {
    key: 'skin',
    prompt: 'How does your skin usually feel after cleansing?',
    context: 'Good. Skin feel tells Aurora where the routine should begin.',
    options: [
      { label: 'Dry or tight', value: 'dry' },
      { label: 'Sensitive', value: 'sensitive' },
      { label: 'Combination', value: 'combination' },
      { label: 'Oily', value: 'oily' },
    ],
  },
  {
    key: 'concerns',
    prompt: 'What should the routine focus on first?',
    context: 'Aurora will prioritize the strongest signal instead of stacking random actives.',
    options: [
      { label: 'Redness', value: 'redness' },
      { label: 'Dryness', value: 'dryness' },
      { label: 'Fine lines', value: 'fine-lines' },
      { label: 'Pigmentation', value: 'pigmentation' },
    ],
  },
  {
    key: 'budget',
    prompt: 'What routine budget feels comfortable?',
    context: 'Aurora will keep the routine focused and avoid unnecessary products.',
    options: [
      { label: formatMoney(100), value: 100 },
      { label: formatMoney(130), value: 130 },
      { label: formatMoney(200), value: 200 },
    ],
  },
]

const currentQuestion = computed(() => questions[step.value])
const isLastStep = computed(() => step.value === questions.length - 1)

const selectedSummary = computed(() => {
  if (step.value === 0) {
    return selectedSkinTypes.value.join(', ')
  }

  if (step.value === 1) {
    return selectedConcerns.value.join(', ')
  }

  return formatMoney(selectedBudget.value)
})

function isSelected(value: string | number) {
  if (currentQuestion.value.key === 'skin') {
    return selectedSkinTypes.value.includes(String(value))
  }

  if (currentQuestion.value.key === 'concerns') {
    return selectedConcerns.value.includes(String(value))
  }

  return selectedBudget.value === value
}

function selectOption(value: string | number) {
  if (currentQuestion.value.key === 'skin') {
    const item = String(value)

    if (selectedSkinTypes.value.includes(item)) {
      selectedSkinTypes.value = selectedSkinTypes.value.filter((x) => x !== item)
    } else {
      selectedSkinTypes.value = [...selectedSkinTypes.value, item]
    }

    return
  }

  if (currentQuestion.value.key === 'concerns') {
    const item = String(value)

    if (selectedConcerns.value.includes(item)) {
      selectedConcerns.value = selectedConcerns.value.filter((x) => x !== item)
    } else {
      selectedConcerns.value = [...selectedConcerns.value, item]
    }

    return
  }

  selectedBudget.value = Number(value)
}

function nextStep() {
  if (!isLastStep.value) {
    step.value += 1
    return
  }

  aurora.setSkinTypes(selectedSkinTypes.value)
  aurora.setConcerns(selectedConcerns.value)
  aurora.setBudget(selectedBudget.value)
  aurora.requestRoutine()

  document.querySelector('.aurora-routine')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>
