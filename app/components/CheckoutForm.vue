<template>
  <form class="checkout-form" @submit.prevent="openReviewModal">
    <div>
      <small>ЗАВЪРШВАНЕ НА ПОРЪЧКАТА</small>
      <h1>Данни за доставка.</h1>
      <p>
        Попълнете данните за доставка. Няма нужда от регистрация.
      </p>
    </div>

    <section class="checkout-block">
      <h2>Контакт</h2>

      <div class="checkout-grid">
        <label>
          Име *
          <input v-model="form.name" required autocomplete="name" placeholder="Вашето име" />
        </label>

        <label>
          Телефон *
          <input v-model="form.phone" required autocomplete="tel" placeholder="+359..." />
        </label>

        <label class="full">
          Имейл <span>(по желание)</span>
          <input v-model="form.email" type="email" autocomplete="email" placeholder="you@example.com" />
        </label>
      </div>

      <p class="checkout-help">
        Ще използваме телефона само при нужда от връзка относно доставката.
      </p>
    </section>

    <section class="checkout-block">
      <h2>Доставка</h2>
      <span data-testid="active-delivery-method" style="display:none">{{ form.deliveryMethod }}</span>

      <div class="checkout-methods delivery-methods">
        <button
          v-for="method in region.deliveryMethods"
          :key="method.id"
          type="button"
          :data-testid="`delivery-method-${method.id}`"
          class="checkout-method"
          :class="{ active: form.deliveryMethod === method.id }"
          @click="selectDeliveryMethod(method)"
        >
          <strong>{{ method.title }}</strong>
          <span>{{ method.description }}</span>
        </button>
      </div>

      <div v-if="form.deliveryMethod === 'econt-office'" class="checkout-grid">
        <label class="full city-autocomplete">
          Град *
          <input
            v-model="cityQuery"
            required
            autocomplete="address-level2"
            data-testid="checkout-city-input"
            placeholder="Започнете да пишете: Видин"
          />

          <div v-if="cityQuery && !selectedCityKey" class="city-suggestions">
            <button
              v-for="city in econtCities"
              :key="city.id"
              type="button"
              data-testid="checkout-city-option"
              @click="selectEcontCity(city)"
            >
              <strong>{{ city.name }}</strong>
              <span v-if="city.postCode">{{ city.postCode }}</span>
            </button>

            <p v-if="!citiesLoading && !econtCities.length" class="notes">
              Няма намерени градове.
            </p>

            <p v-if="citiesLoading" class="notes">
              Зареждане...
            </p>
          </div>
        </label>

        <div
          v-if="officePickerOpen"
          class="office-list full"
        >
          <div class="office-list-head">
            <strong>Офис *</strong>
            <span v-if="officesLoading">Зареждане...</span>
            <span v-else-if="selectedCityKey">{{ econtOffices.length }} офиса</span>
            <span v-else>Първо изберете град</span>
          </div>

          <input
            v-if="econtOffices.length > 8"
            v-model="officeQuery"
            class="office-search"
            type="search"
            placeholder="Търсете офис, адрес или код..."
          />

          <button
            v-for="office in filteredEcontOffices"
            :key="office.id"
            type="button"
            class="office-option"
            data-testid="checkout-office-option"
            :class="{ active: selectedOfficeKey === String(office.id) }"
            @click="selectEcontOfficeById(String(office.id))"
          >
            <div>
              <strong>{{ office.name }}</strong>
              <span>{{ office.address }}</span>
            </div>
            <small>{{ office.code }}</small>
          </button>
        </div>

        <div
          v-if="!officePickerOpen && form.rawOfficeText"
          class="selected-office full"
        >
          <strong>Избран офис</strong>
          <p>{{ form.officeName || form.rawOfficeText }}</p>
          <small>{{ form.officeAddress }}</small>

          <button
            type="button"
            class="change-office"
            @click="officePickerOpen = true"
          >
            Смени офис
          </button>
        </div>

        <label class="full">
          Бележки към поръчката
          <textarea
            v-model="form.notes"
            autocomplete="off"
            placeholder="Предпочитан час за доставка, код на входа и др."
          />
        </label>
      </div>

      <div v-else class="checkout-grid">
        <label>
          Град *
          <input v-model="form.cityName" data-testid="checkout-address-city" required autocomplete="address-level2" placeholder="София" />
        </label>

        <label v-if="form.deliveryMethod !== 'address'">
          Офис *
          <input
            v-model="form.rawOfficeText"
            required
            autocomplete="shipping street-address"
            placeholder="Име или адрес на офис"
          />
        </label>

        <label v-else>
          Адрес *
          <input
            v-model="form.address"
            data-testid="checkout-address-line"
            required
            autocomplete="shipping street-address"
            placeholder="Улица, номер, вход, апартамент"
          />
        </label>

        <label class="full">
          Бележки към поръчката
          <textarea
            v-model="form.notes"
            autocomplete="off"
            placeholder="Предпочитан час за доставка, код на входа и др."
          />
        </label>
      </div>
    </section>

    <section class="checkout-block">
      <h2>Плащане</h2>

      <article
        v-for="method in region.paymentMethods"
        :key="method.id"
        class="checkout-method payment-method"
        :class="{ active: form.paymentMethod === method.id }"
        @click="selectPaymentMethod(method.id)"
      >
        <strong>{{ method.title }}</strong>
        <span>{{ method.description }}</span>
      </article>
    </section>

    <button class="checkout-submit" type="submit" :disabled="!canSubmit">
      {{ isSubmitting ? 'Изпращане...' : 'Преглед на поръчката • ' + formatMoney(cart.total) }}
    </button>

    <p class="checkout-note">
      Ще се свържем с вас при нужда относно доставката.
    </p>
  </form>

  <div
    v-if="showReviewModal"
    class="review-modal-backdrop"
    @click.self="showReviewModal = false"
  >
    <section class="review-modal">
      <header>
        <small>ПОТВЪРЖДЕНИЕ</small>
        <h2>Преглед на поръчката</h2>
      </header>

      <div class="review-section">
        <strong>Контакт</strong>
        <p>{{ form.name }}</p>
        <p>{{ form.phone }}</p>
        <p v-if="form.email">{{ form.email }}</p>
      </div>

      <div class="review-section">
        <strong>Доставка</strong>
        <p>{{ form.deliveryProvider === 'econt' ? 'Еконт офис' : form.deliveryProvider }}</p>
        <p>{{ form.officeName || form.rawOfficeText || form.address }}</p>
        <small>{{ form.officeAddress || form.cityName }}</small>
      </div>

      <div class="review-section">
        <strong>Плащане</strong>
        <p>{{ form.paymentMethod === 'cash-on-delivery' ? 'Наложен платеж' : form.paymentMethod }}</p>
      </div>

      <div class="review-section">
        <strong>Продукти</strong>
        <p v-for="item in cart.items" :key="item.slug">
          {{ item.name }} × {{ item.quantity }}
        </p>
      </div>

      <div class="review-total">
        <span>Общо</span>
        <strong>{{ formatMoney(cart.total) }}</strong>
      </div>

      <footer class="review-actions">
        <button type="button" class="review-secondary" @click="showReviewModal = false">
          Назад
        </button>

        <button type="button" class="review-primary" :disabled="isSubmitting" @click="placeOrder">
          {{ isSubmitting ? 'Изпращане...' : 'Потвърди поръчката' }}
        </button>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
type EcontCity = {
  id: number | string
  name: string
  postCode?: string
  countryCode?: string
}

type EcontOffice = {
  id: number | string
  code: string
  name: string
  address: string
  cityId?: number | string
  cityName?: string
}

const { currency, formatMoney } = useStoreCurrency()
const { region } = useCheckoutRegion()
const { t } = useI18n()
const localePath = useLocalePath()
const cart = useCartStore()
const analytics = useAnalytics()
const mounted = ref(false)
const showReviewModal = ref(false)

onMounted(() => {
  cart.load()
  mounted.value = true
})

const canSubmit = computed(() => {
  if (!mounted.value || cart.items.length === 0 || isSubmitting.value) return false
  if (!form.name.trim()) return false
  if (!form.phone.trim()) return false

  if (form.deliveryMethod === 'econt-office') {
    return Boolean(selectedCityKey.value && selectedOfficeKey.value && form.officeId)
  }

  if (form.deliveryMethod === 'speedy-office') {
    return Boolean(selectedCityKey.value && selectedOfficeKey.value && form.officeId)
  }

  if (form.deliveryMethod === 'address') {
    return Boolean(form.cityName.trim() && form.address.trim())
  }

  return false
})

const form = reactive({
  name: '',
  phone: '',
  email: '',
  city: '',
  country: region.value.country,
  deliveryProvider: 'econt',
  deliveryType: 'office',
  deliveryMethod: 'econt-office',
  cityName: '',
  officeId: null as string | null,
  officeName: '',
  officeCode: null as string | null,
  officeAddress: '',
  rawOfficeText: '',
  address: '',
  notes: '',
  paymentMethod: 'cash-on-delivery',
})


function selectDeliveryMethod(method: {
  id: string
  provider: string
  type: string
}) {
  selectDelivery(method.provider, method.type, method.id)

  analytics.deliverySelected({
    deliveryMethod: method.id,
  })
}

function selectPaymentMethod(methodId: string) {
  form.paymentMethod = methodId

  analytics.paymentSelected({
    paymentMethod: methodId,
  })
}

function selectDelivery(provider: string, type: string, methodId?: string) {
  form.deliveryProvider = provider
  form.deliveryType = type

  form.deliveryMethod = methodId || 'address'

  form.officeId = null
  form.officeName = ''
  form.officeCode = null
  form.officeAddress = ''
  form.rawOfficeText = ''
  form.address = ''

}


watch(
  region,
  (nextRegion) => {
    const firstDelivery = nextRegion.deliveryMethods[0]
    const firstPayment = nextRegion.paymentMethods[0]

    form.country = nextRegion.country

    if (firstDelivery) {
      selectDelivery(firstDelivery.provider, firstDelivery.type, firstDelivery.id)
    }

    if (firstPayment) {
      form.paymentMethod = firstPayment.id
    }
  },
  { immediate: true },
)

const isSubmitting = ref(false)
const econtCities = ref<EcontCity[]>([])
const econtOffices = ref<EcontOffice[]>([])
const citiesLoading = ref(false)
const officesLoading = ref(false)
const cityQuery = ref('')
const selectedCityKey = ref('')
const selectedOfficeKey = ref('')
const officePickerOpen = ref(true)
const officeQuery = ref('')
let citySearchTimer: ReturnType<typeof setTimeout> | null = null
let lastCitySearch = ''


watch(
  cityQuery,
  (query) => {
    const q = query.trim()

    if (
      selectedCityKey.value &&
      form.cityName &&
      q === form.cityName
    ) {
      return
    }

    selectedCityKey.value = ''
    selectedOfficeKey.value = ''
    form.cityName = ''
    form.officeId = null
    form.officeCode = null
    form.officeName = ''
    form.officeAddress = ''
    form.rawOfficeText = ''
    officeQuery.value = ''
    econtCities.value = []
    econtOffices.value = []

    if (citySearchTimer) clearTimeout(citySearchTimer)

    if (form.deliveryMethod !== 'econt-office') return
    if (q.length < 3) return
    if (q === lastCitySearch) return

    citySearchTimer = setTimeout(async () => {
      lastCitySearch = q
      citiesLoading.value = true

      try {
        econtCities.value = await $fetch<EcontCity[]>(
          `/api/shipping/cities?provider=${form.deliveryProvider}&query=${encodeURIComponent(q)}`,
        )
      } finally {
        citiesLoading.value = false
      }
    }, 350)
  },
)


async function selectEcontCity(city: EcontCity) {
  selectedCityKey.value = String(city.id)
  cityQuery.value = city.name
  form.cityName = city.name

  officePickerOpen.value = true
  selectedOfficeKey.value = ''
  form.officeId = null
  form.officeCode = null
  form.officeName = ''
  form.officeAddress = ''
  form.rawOfficeText = ''
  econtOffices.value = []
  officeQuery.value = ''

  officesLoading.value = true

  try {
    econtOffices.value = await $fetch<EcontOffice[]>(
      `/api/shipping/offices?provider=${form.deliveryProvider}&cityId=${encodeURIComponent(String(city.id))}`,
    )
  } finally {
    officesLoading.value = false
  }
}



const filteredEcontOffices = computed(() => {
  const q = officeQuery.value.trim().toLowerCase()

  if (!q) return econtOffices.value

  return econtOffices.value.filter((office) => {
    const haystack = [
      office.name,
      office.address,
      office.code,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(q)
  })
})

function selectEcontOfficeById(id: string) {
  selectedOfficeKey.value = id
  officePickerOpen.value = false

  const office = econtOffices.value.find(
    (item) => String(item.id) === selectedOfficeKey.value,
  )

  if (!office) return

  form.officeId = String(office.id)
  form.officeCode = office.code ? String(office.code) : null
  form.officeName = office.name || ''
  form.officeAddress = office.address || ''
  form.rawOfficeText = [office.name, office.code, office.address]
    .filter(Boolean)
    .join(', ')
}


function openReviewModal() {
  if (!canSubmit.value) return

  analytics.checkoutReviewed({
    deliveryMethod: form.deliveryMethod,
    paymentMethod: form.paymentMethod,
  })

  showReviewModal.value = true
}

async function placeOrder() {
  if (!canSubmit.value) return

  isSubmitting.value = true

  try {
    const order = await $fetch('/api/orders/storefront', {
      method: 'POST',
      body: {
        storeSlug: 'ava-cosmetica',
        currency: currency.value,
        contact: {
          name: form.name,
          phone: form.phone,
          email: form.email,
        },
        delivery: {
          country: form.country,
          deliveryProvider: form.deliveryProvider,
          deliveryType: form.deliveryType,
          deliveryMethod: form.deliveryMethod,
          cityName: form.cityName,
          cityId: selectedCityKey.value || null,
          officeId: form.officeId,
          officeName: form.officeName,
          officeCode: form.officeCode,
          officeAddress: form.officeAddress,
          rawOfficeText: form.rawOfficeText,
          address: form.address,
          notes: form.notes,
        },
        paymentMethod: form.paymentMethod,
        items: cart.items.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
        })),
      },
    })

    analytics.orderCreated({
      orderId: String((order as any).id ?? (order as any).orderNumber ?? ''),
      total: Number((order as any).total ?? cart.total),
      currency: currency.value,
      items: cart.items.map((item) => ({
        productId: item.variantId,
        slug: item.slug,
        variant: item.variantId,
        price: item.price,
        quantity: item.quantity,
      })),
    })

    sessionStorage.setItem('ava-last-order', JSON.stringify(order))

    cart.clear()
    navigateTo(localePath('/success'))
  } finally {
    isSubmitting.value = false
  }
}
</script>
