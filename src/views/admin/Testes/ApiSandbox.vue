<template>
  <div class="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow space-y-6">
    <h2 class="text-2xl font-bold mb-4">API Sandbox / Playground</h2>

    <!-- API Request Form -->
    <FormKit :actions="false" form-class="space-y-4" type="form" @submit="sendRequest">
      <!-- Endpoint -->
      <FormKit
        v-model="request.url"
        placeholder="Endpoint URL (مثال: /admin/products)"
        type="text"
        validation="required"
      />

      <!-- HTTP Method -->
      <FormKit
        v-model="request.method"
        :options="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"
        label="HTTP Method"
        type="select"
      />

      <!-- Headers -->
      <div class="space-y-2">
        <label class="font-semibold">Headers (key:value)</label>
        <div v-for="(h, i) in request.headers" :key="i" class="flex space-x-2 items-center">
          <FormKit v-model="h.key" placeholder="Key" type="text" />
          <FormKit v-model="h.value" placeholder="Value" type="text" />
          <button
            class="bg-red-500 text-white px-2 py-1 rounded"
            type="button"
            @click="request.headers.splice(i, 1)"
          >
            X
          </button>
        </div>
        <button
          class="bg-gray-500 text-white px-2 py-1 rounded mt-1"
          type="button"
          @click="request.headers.push({ key: '', value: '' })"
        >
          + Add Header
        </button>
      </div>

      <!-- Request Body -->
      <FormKit
        v-model="request.body"
        label="Request Body (JSON)"
        placeholder='{"name":"محصول تستی"}'
        rows="6"
        type="textarea"
      />

      <!-- Files -->
      <div>
        <label class="font-semibold">Files</label>
        <input class="border p-2 rounded w-full" multiple type="file" @change="handleFiles" />
      </div>

      <!-- Submit -->
      <FormKit :disabled="loading" outer-class="mt-4" type="submit">
        {{ loading ? 'در حال ارسال...' : 'Send Request' }}
      </FormKit>
    </FormKit>

    <!-- Auto-fill نمونه داده -->
    <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="autoFill">
      Auto-fill Sample
    </button>

    <!-- Debug Panel -->
    <div v-if="debug" class="mt-6 p-4 border rounded bg-gray-50 space-y-4">
      <h3 class="font-bold mb-2">Debug Panel</h3>
      <div>
        <strong>Request:</strong>
        <pre>{{ debug.request }}</pre>
      </div>
      <div>
        <strong>Response:</strong>
        <pre>{{ debug.response }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from '@/lib/axios' // axios instance پروژه که withCredentials آماده است

const auth = useAuthStore()
const loading = ref(false)
const debug = reactive({ request: null as any, response: null as any })

const request = reactive({
  url: '',
  method: 'GET',
  headers: [] as { key: string; value: string }[],
  body: '',
  files: [] as File[],
})

const handleFiles = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) request.files = Array.from(input.files)
}

const sendRequest = async () => {
  loading.value = true
  debug.request = null
  debug.response = null

  try {
    // headerهای دلخواه کاربر
    const headers: Record<string, string> = {}
    request.headers.forEach((h) => {
      if (h.key) headers[h.key] = h.value
    })

    let data: any = undefined
    if (request.method !== 'GET') {
      // parse body
      if (request.body) {
        try {
          data = JSON.parse(request.body)
        } catch {
          data = request.body
        }
      }

      // اگر فایل هست، همه چیزو FormData کنیم
      if (request.files.length) {
        const formData = new FormData()
        request.files.forEach((f) => formData.append(f.name, f))
        if (data && typeof data === 'object') {
          for (const key in data) formData.append(key, data[key])
        }
        data = formData
      }
    }

    debug.request = {
      url: request.url,
      method: request.method,
      headers,
      body: request.body,
      files: request.files.map((f) => f.name),
    }

    const res = await axios({
      url: request.url,
      method: request.method.toLowerCase(),
      headers,
      data,
    })

    debug.response = res.data
  } catch (err: any) {
    debug.response = err.response?.data || err.message
  } finally {
    loading.value = false
  }
}

const autoFill = () => {
  request.url = '/admin/products/14' // ✅ بدون /api
  request.method = 'PATCH'
  request.headers = [{ key: 'Content-Type', value: 'application/json' }]
  request.body = JSON.stringify({
    name: 'روژ لب HDS',
    base_price: 956000,
    stock_quantity: 20,
    unit: 'عدد',
    category_ids: [1, 2],
    discount_price: 96000,
    short_description: 'توضیح کوتاه روژ لب',
    long_description: 'توضیح کامل محصول برای سئو روژ لب',
    is_active: true,
    status: 'available', // ✅ اضافه شد
  })
}
</script>
