import axios from '@/lib/axios'
import { stringify } from 'qs'

export type StatsParams = {
  from?: string
  to?: string
  interval?: 'hour' | 'day' | 'week' | 'month'
  level?: string[] | string
  type?: string[] | string
  search?: string
}

export async function fetchLogStats(params: StatsParams) {
  // اگر level/type آرایه است، به comma-separated تبدیل کن تا backend آماده‌اش باشه
  const clean = { ...params }
  if (Array.isArray(params.level)) clean.level = params.level.join(',')
  if (Array.isArray(params.type)) clean.type = params.type.join(',')

  const qs = stringify(clean, { arrayFormat: 'comma' })
  const { data } = await axios.get(`/admin/logs/stats?${qs}`)
  return data
}
