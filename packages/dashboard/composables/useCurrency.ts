import { DEFAULT_USD_TO_EUR, convertCost, formatCost } from '@trimly/core/browser'
import { computed, ref } from 'vue'

type Currency = 'USD' | 'EUR'

const currency = ref<Currency>('USD')
const usdToEur = ref<number>(DEFAULT_USD_TO_EUR)

export function useCurrency() {
  const locale = computed(() => (currency.value === 'EUR' ? 'fr-FR' : 'en-US'))

  function setCurrency(c: Currency) {
    currency.value = c
    if (typeof localStorage !== 'undefined') localStorage.setItem('trimly.currency', c)
  }

  function setRate(rate: number) {
    if (!Number.isFinite(rate) || rate <= 0) return
    usdToEur.value = rate
    if (typeof localStorage !== 'undefined') localStorage.setItem('trimly.fxRate', String(rate))
  }

  function init() {
    if (typeof localStorage === 'undefined') return
    currency.value = (localStorage.getItem('trimly.currency') as Currency) ?? 'USD'
    const rate = Number(localStorage.getItem('trimly.fxRate'))
    if (Number.isFinite(rate) && rate > 0) usdToEur.value = rate
  }

  function fmtCost(costUsd: number): string {
    return formatCost(
      convertCost(costUsd, currency.value, usdToEur.value),
      currency.value,
      locale.value,
    )
  }

  function fmtCost5(costUsd: number): string {
    return formatCost(
      convertCost(costUsd, currency.value, usdToEur.value),
      currency.value,
      locale.value,
      5,
    )
  }

  return { currency, usdToEur, locale, setCurrency, setRate, init, fmtCost, fmtCost5 }
}
