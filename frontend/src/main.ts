import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { getI18n } from './i18n'
import { setDayjsLocale } from './utils/dayjs'
import './styles/main.css'

const app = createApp(App)
app.use(createPinia())
const i18n = getI18n()
app.use(i18n)
app.use(router)

// The active dayjs locale must be settled before the first paint — views render
// `fromNow()` synchronously, and switching language after mount would show one
// frame of stale-language timestamps. Both locales are registered statically, so
// this await never waits on a chunk. The `.catch()` is belt-and-braces for a
// future locale that needs one — but read `utils/dayjs.ts` before adding it:
// `.catch()` guards a rejection, not a promise that never settles, and a locale
// loader that hangs here gates `app.mount()` and blanks the page for everyone.
await setDayjsLocale(i18n.global.locale.value).catch(() => {})

app.mount('#app')
