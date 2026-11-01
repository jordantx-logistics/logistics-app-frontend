import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as ordersApi from '../api/orders.api'

/**
 * Estado del módulo **orders**: el listado paginado en el servidor. Aquí vive
 * la `page` actual (el loader la manda como query en cada recarga), para que el
 * paginador del servidor sea lo único que cambia la página.
 */
export const useOrdersStore = defineStore('orders', () => {
  const PER_PAGE = 15

  const page = ref(1)
  const status = ref('')

  const orders = useAsyncData(() =>
    ordersApi.listOrders({
      page: page.value,
      per_page: PER_PAGE,
      ...(status.value === '' ? {} : { status: status.value }),
    }),
  )

  /** Cambia de página y recarga del API (paginación del servidor). */
  function goToPage(next: number): void {
    page.value = next
    void orders.load()
  }

  /** Cambiar el filtro vuelve a la primera página. */
  function filterByStatus(next: string): void {
    status.value = next
    page.value = 1
    void orders.load()
  }

  return {
    PER_PAGE,
    page,
    status,
    orders,
    goToPage,
    filterByStatus,
  }
})
