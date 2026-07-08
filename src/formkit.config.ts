import { defineFormKitConfig } from '@formkit/vue'
import type { FormKitNode } from '@formkit/core'
import { rootClasses } from './formkit.theme'

// قانون سفارشی
function realMinLength(node: FormKitNode, min: string | number): boolean {
  const raw = node.value ?? ''
  const str = typeof raw === 'string' ? raw : String(raw)
  return [...str].length >= Number(min)
}
Object.assign(realMinLength, { skipEmpty: false, force: true })

export default defineFormKitConfig({
  rules: { realMinLength },
  config: {
    classes: {
      input: 'formkit-input',
    },
    rootClasses,
  },
})
