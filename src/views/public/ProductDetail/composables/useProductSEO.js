import { computed } from 'vue'
import { useHead } from '@vueuse/head'

export function useProductSEO(product) {
  const headData = computed(() => {
    if (!product.value) return {}

    const p = product.value
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://beautily.ir'
    const currentUrl =
      typeof window !== 'undefined' ? window.location.href : `${baseUrl}/product/${p.slug || p.id}`
    const brandName = 'بیوتیلی'

    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: p.name,
      image: p.images?.gallery?.[0]?.url || p.images?.thumbnail?.url || '',
      description: p.seo?.meta_description || p.short_description || '',
      sku: p.sku || p.id,
      brand: { '@type': 'Brand', name: p.brand?.name || brandName },
      offers: {
        '@type': 'Offer',
        url: currentUrl,
        priceCurrency: 'IRR',
        price: p.prices?.final || p.prices?.base || 0,
        itemCondition: 'https://schema.org/NewCondition',
        availability:
          p.status?.is_active && p.stock?.quantity > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      },
    }

    if (p.reviews_count > 0 && p.rating > 0) {
      productSchema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: p.rating,
        reviewCount: p.reviews_count,
      }
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: brandName, item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'محصولات', item: `${baseUrl}/products` },
      ],
    }

    if (p.primary_category || (p.categories && p.categories.length > 0)) {
      const mainCat = p.primary_category || p.categories[0]
      breadcrumbSchema.itemListElement.push({
        '@type': 'ListItem',
        position: 3,
        name: mainCat.name,
        item: `${baseUrl}/category/${mainCat.slug}`,
      })
      breadcrumbSchema.itemListElement.push({
        '@type': 'ListItem',
        position: 4,
        name: p.name,
        item: currentUrl,
      })
    } else {
      breadcrumbSchema.itemListElement.push({
        '@type': 'ListItem',
        position: 3,
        name: p.name,
        item: currentUrl,
      })
    }

    let faqSchema = null
    if (p.faqs && p.faqs.length > 0) {
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: p.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    }

    const schemaScripts = [
      {
        key: 'schema-product',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(productSchema),
      },
      {
        key: 'schema-breadcrumb',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbSchema),
      },
    ]
    if (faqSchema)
      schemaScripts.push({
        key: 'schema-faq',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqSchema),
      })

    return {
      title: p.seo?.meta_title || `${p.name} - ${brandName}`,
      meta: [
        { name: 'description', content: p.seo?.meta_description || p.short_description || '' },
        { name: 'robots', content: p.seo?.robots || 'index, follow' },
      ],
      link: [{ rel: 'canonical', href: p.seo?.canonical_url || currentUrl }],
      script: schemaScripts,
    }
  })

  useHead(headData)
}
