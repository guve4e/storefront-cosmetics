export const useAuroraStore = defineStore('aurora', () => {
  const skinTypes = ref<string[]>(['dry', 'sensitive'])
  const concerns = ref<string[]>(['redness', 'dryness'])
  const budget = ref(130)
  const routineRequestVersion = ref(0)

  function setSkinTypes(value: string[]) {
    skinTypes.value = value
  }

  function setConcerns(value: string[]) {
    concerns.value = value
  }

  function setBudget(value: number) {
    budget.value = value
  }

  function requestRoutine() {
    routineRequestVersion.value += 1
  }

  return {
    skinTypes,
    concerns,
    budget,
    routineRequestVersion,
    setSkinTypes,
    setConcerns,
    setBudget,
    requestRoutine,
  }
})
