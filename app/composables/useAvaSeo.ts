import { siteSeo } from '~/seo/site'
import { absoluteUrl, buildTitle, cleanDescription } from '~/utils/seo'

type SeoInput = {
  title?: string
  description?: string
  path?: string
  image?: string | null
  type?: 'website' | 'product'
}

export function useAvaSeo(input: SeoInput = {}) {
  const route = useRoute()

  const path = input.path || route.path
  const url = absoluteUrl(path)
  const title = buildTitle(input.title)
  const description = cleanDescription(input.description)
  const image = input.image ? absoluteUrl(input.image) : absoluteUrl(siteSeo.logo)

  useSeoMeta({
    title,
    description,

    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogImage: image,
    ogType: input.type === 'product' ? 'product' : 'website',
    ogSiteName: siteSeo.name,

    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  })

  useHead({
    link: [
      {
        rel: 'canonical',
        href: url,
      },
    ],
  })
}
