<script lang="ts" setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cart = useCartStore()

const addToCart = () => {
  // مقداردهی امن — quantity پیشفرض 1
  cart.addItem(
    {
      id: props.product.id,
      name: props.product.name,
      price: Number(props.product.price) || 0,
      image: props.product.image || null,
      slug: props.product.slug,
      category: props.product.category,
    },
    1,
  )
}
</script>
