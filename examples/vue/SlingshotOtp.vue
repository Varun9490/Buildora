<script setup lang="ts">
import { ref } from "vue";
const root = ref<HTMLElement | null>(null);
</script>

<template>
  <div ref="root" class="buildora-slingshot-otp">
    <input v-for="i in 6" :key="i" :aria-label="`Digit ${i} of 6`" maxlength="1" inputmode="numeric" class="otp-digit" />
  </div>
</template>
