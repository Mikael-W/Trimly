<script setup lang="ts">
import { formatCost } from '@trimly/core'

const props = defineProps<{
  value: number
  currency?: 'USD' | 'EUR'
}>()

const currency = computed(() => props.currency ?? 'USD')
const locale = computed(() => (currency.value === 'EUR' ? 'fr-FR' : 'en-US'))
const formatted = computed(() => formatCost(props.value, currency.value, locale.value))
</script>

<template>
  <span>{{ formatted }}</span>
</template>
