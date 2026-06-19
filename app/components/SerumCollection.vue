<template>
  <section id="serums" class="collection">
    <div class="section-head">
      <div>
        <div class="eyebrow soft">The Crystal Pure™ collection</div>
        <h2>Eight signals. One intelligent ritual.</h2>
      </div>
      <p>
        Each serum has its own landing page, so Facebook ads can send people
        directly to the right formula.
      </p>
    </div>

    <div class="cards">
      <NuxtLink
        v-for="serum in serums"
        :key="serum.slug"
        class="serum-card"
        :to="localePath(`/serums/${serum.slug}`)"
      >
        <div class="bottle" :class="serum.colorClass"></div>
        <div class="type">{{ serum.signal }}</div>
        <h3>{{ locale === 'bg' ? serum.bgName : serum.name }}</h3>
        <p>{{ locale === 'bg' ? serum.bgTitle : serum.title }}</p>
        <div class="card-bottom">
          <strong>{{ serum.price }}</strong>
          <span class="fake-button">View</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { serums } from '~/data/serums'

const localePath = useLocalePath()
const { locale } = useI18n()
</script>
