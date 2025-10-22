import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/overview',
    name: 'Overview',
    component: () => import('../views/OverviewView.vue')
  },
  {
    path: '/economic-indicators',
    name: 'EconomicIndicators',
    component: () => import('../views/EconomicIndicatorsView.vue')
  },
  {
    path: '/public-sector',
    name: 'PublicSector',
    component: () => import('../views/PublicSectorView.vue')
  },
  {
    path: '/debt-analysis',
    name: 'DebtAnalysis',
    component: () => import('../views/DebtAnalysisView.vue')
  },
  {
    path: '/data-visualization',
    name: 'DataVisualization',
    component: () => import('../views/DataVisualizationView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
