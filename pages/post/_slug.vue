<template lang="pug">
PostFull(:post="post")
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import PostFull from '@/components/PostFull.vue'

@Component({
  components: {
    PostFull
  },
  layout: 'blog',
  async asyncData({ app, params }) {
    const { title, image, tag, html, excerptMarkdown } = (await app.$axios.$get(
      `/serverMiddleware/post`,
      {
        params: {
          slug: params.slug
        }
      }
    ))!

    return {
      post: {
        title,
        image,
        tag,
        html,
        excerptMarkdown
      }
    }
  }
})
export default class PostPage extends Vue {
  post: any = {}

  head() {
    let {
      title = '',
      header = {},
      excerptMarkdown: description = ''
    } = this.post
    title = `${title} - ${process.env.title}`

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: (header.keyword || header.tag || []).join(', ')
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: header.image
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: title
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: description
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: header.image
        }
      ]
    }
  }
}
</script>
