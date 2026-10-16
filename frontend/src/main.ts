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
// frame of stale-language timestamps. Best-effort though: this awaits a
// dynamically-imported chunk, and an unguarded rejection would abort module
// evaluation and leave a permanently blank page. dayjs statically registers
// zh-cn at import, so a failed chunk degrades to Chinese timestamps, not a dead app.
await setDayjsLocale(i18n.global.locale.value as Locale).catch(() => {})

app.mount('#app')
