import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { getI18n, type Locale } from './i18n'
import { setDayjsLocale } from './utils/dayjs'
import './styles/main.css'

const app = createApp(App)
app.use(createPinia())
const i18n = getI18n()
app.use(i18n)
app.use(router)

// The active dayjs locale must be settled before the first paint — views render
// `fromNow()` synchronously, and switching language after mount would show one
// frame of stale-language timestamps.
await setDayjsLocale(i18n.global.locale.value as Locale)

app.mount('#app')
