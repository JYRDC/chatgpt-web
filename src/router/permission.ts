import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()
    if (!authStore.token) {
      if (to.path === '/login')
        next()
      else
        next({ name: 'login' })
    }
    if (!authStore.session) {
      if (authStore.token && to.path === '/login')
        next({ name: 'Root' })
      try {
        await authStore.getSession()
        // if (String(data.auth) === 'false' && authStore.token)
        //   authStore.removeToken()
        if (to.path === '/500')
          next({ name: 'Root' })
        else
          next()
      }
      catch (error) {
        if (to.path !== '/500')
          next({ name: '500' })
        else
          next()
      }
    }
    else {
      next()
    }
  })
}
