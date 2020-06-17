import fs from 'fs'
import { spawnSync } from 'child_process'
import dayjs from 'dayjs'
import yaml from 'js-yaml'
import dotProp from 'dot-prop-immutable'

// eslint-disable-next-line require-await
export default async () => {
  if (process.env.BUILD === '1') {
    spawnSync(
      'node_modules/.bin/ts-node',
      [
        '-O',
        '{"module": "commonjs", "noImplicitAny": false}',
        'scripts/build.ts'
      ],
      {
        stdio: 'inherit'
      }
    )
  }

  const env = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'))

  return {
    mode: 'universal',
    target: 'static',
    /*
     ** Headers of the page
     */
    head: {
      title: env.title || process.env.npm_package_name || '',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: env.description || process.env.npm_package_description || ''
        }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      script: [
        (() => {
          const sidebarTwitter = dotProp.get(env, 'sidebar.twitter')
          if (sidebarTwitter) {
            return {
              src: 'https://platform.twitter.com/widgets.js',
              async: true,
              charset: 'utf-8'
            }
          }

          return []
        })(),
        (() => {
          const plausible = dotProp.get(env, 'analytics.plausible')
          if (plausible) {
            return {
              src: 'https://plausible.io/js/plausible.js',
              async: true,
              defer: true,
              'data-domain': plausible
            }
          }

          return []
        })()
      ]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: [],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
      '@nuxt/typescript-build',
      [
        '@nuxtjs/fontawesome',
        {
          component: 'fa',
          suffix: true,
          freeIcons: {
            solid: ['faSearch', 'faCaretRight', 'faCaretLeft', 'faAt'],
            brands: [
              'faTwitter',
              'faFacebookF',
              'faGithub',
              'faReddit',
              'faQuora'
            ]
          }
        }
      ]
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
      // Doc: https://buefy.github.io/#/documentation
      [
        'nuxt-buefy',
        {
          // css: false,
          materialDesignIcons: false,
          defaultIconPack: 'fa',
          defaultIconComponent: 'fa'
        }
      ],
      [
        'nuxt-mq',
        {
          defaultBreakpoint: 'desktop',
          breakpoints: {
            mobile: 500,
            tablet: 1024,
            desktop: Infinity
          }
        }
      ],
      // Doc: https://axios.nuxtjs.org/usage
      '@nuxtjs/axios'
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
      proxy: true
    },
    proxy: {
      '/.netlify/functions': 'http://localhost:9000'
    },
    serverMiddleware: [
      { path: '/serverMiddleware/post', handler: '~/serverMiddleware/post.js' },
      {
        path: '/serverMiddleware/search',
        handler: '~/serverMiddleware/search.js'
      }
    ],
    /*
     ** Build configuration
     */
    build: {
      /*
       ** You can extend webpack config here
       */
      // extend(config, ctx) {}
    },
    env: {
      'comment.remark42.host': dotProp.get(env, 'comment.remark42.host', ''),
      'comment.remark42.siteId': dotProp.get(
        env,
        'comment.remark42.siteId',
        ''
      ),
      'comment.remark42.maxShownComments': dotProp.get(
        env,
        'comment.remark42.maxShownComments',
        ''
      ),
      'comment.remark42.theme': dotProp.get(env, 'comment.remark42.theme', ''),
      'comment.remark42.locale': dotProp.get(
        env,
        'comment.remark42.locale',
        ''
      ),
      'social.twitter': dotProp.get(env, 'social.twitter', ''),
      'social.reddit': dotProp.get(env, 'social.reddit', ''),
      'social.quora': dotProp.get(env, 'social.quora', ''),
      'social.github': dotProp.get(env, 'social.github', ''),
      title: env.title,
      banner: env.banner,
      baseUrl: env.baseUrl,
      'author.url': dotProp.get(env, 'author.url', ''),
      'author.avatar': dotProp.get(env, 'author.avatar', ''),
      'author.email': dotProp.get(env, 'author.email', ''),
      'author.name': dotProp.get(env, 'author.name', ''),
      tabJson: JSON.stringify(env.tab || []),
      sidebarJson: JSON.stringify(env.sidebar || {}),
      'tag.listJson': dotProp.get(env, 'sidebar.tagCloud', '')
        ? fs.readFileSync('./build/tag.json', 'utf-8')
        : undefined,
      'tag.exclude': dotProp.get('env', 'tag.exclude', '')
    },
    generate: {
      crawler: false,
      async routes() {
        const routes = ['/', '/blog']

        const blog = new Set()
        const tag = new Map()

        /**
         *
         * @param {{ slug: string; date?: Date }} h
         */
        const getUrl = (h) => {
          if (h.date) {
            const d = dayjs(h.date).toDate()
            return `/post/${d.getFullYear().toString()}/${(d.getMonth() + 1)
              .toString()
              .padStart(2, '0')}/${h.slug}`
          }

          return `/post/${h.slug}`
        }

        // { tag?: string[]; date?: Date }
        Object.entries(await import('./build/raw.json'))
          .map(([slug, { tag, date }]) => ({
            slug,
            tag,
            date
          }))
          .map((f) => {
            const p = {
              slug: f.slug,
              date: f.date ? dayjs(f.date).toDate() : undefined
            }
            blog.add(p)
            routes.push(getUrl(p))

            /**
             * @type {string[]}
             */
            const ts = f.tag || []

            ts.map((t) => {
              const ts = tag.get(t) || new Set()
              ts.add(p)
              tag.set(t, ts)
            })
          })

        Array(Math.ceil(blog.size / 5))
          .fill(null)
          .map((_, i) => {
            if (i > 0) {
              routes.push(`/blog/${i + 1}`)
            }
          })

        Array.from(tag).map(([t, ts]) => {
          Array(Math.ceil(ts.size / 5))
            .fill(null)
            .map((_, i) => {
              if (i > 0) {
                routes.push(`/tag/${t}/${i + 1}`)
              } else {
                routes.push(`/tag/${t}`)
              }
            })
        })

        return routes
      }
    }
  }
}
