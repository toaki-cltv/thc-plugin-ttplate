import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { createHeadController } from 'tanstack-head-controller'
import { thcMerge } from 'thc-plugin-merge'
import { thcTitleTemplate } from 'thc-plugin-ttplate'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    context: {
      ...createHeadController({
        plugins: [
          thcMerge(),
          thcTitleTemplate({
            siteName: "My App"
          })
        ]
      })
    },

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
