<template lang="pug">
div.page-social
  b-navbar-item(v-if="twitter" :href="twitter" target="_blank" rel="noopener nofollow")
    fa(:icon="['fab', 'twitter']") Twitter
  b-navbar-item(v-if="reddit" :href="reddit" target="_blank" rel="noopener nofollow")
    fa(:icon="['fab', 'reddit']") Reddit
  b-navbar-item(v-if="quora" :href="quora" target="_blank" rel="noopener nofollow")
    fa(:icon="['fab', 'quora']") Quora
  b-navbar-item(v-if="github" :href="github" target="_blank" rel="noopener nofollow")
    fa(:icon="['fab', 'github']") GitHub
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class PageSocial extends Vue {
  twitter = process.env['social.twitter']
  reddit = process.env['social.reddit']
  quora = process.env['social.quora']
  github = process.env['social.github']
}
</script>

<style lang="scss" scoped>
.page-social {
  height: 100%;
  display: inline-flex;
  justify-content: center;
}
</style>
