// Google Analytics 配置文件
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (!GA_TRACKING_ID) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// 为 window 对象添加 gtag 类型定义
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
} 