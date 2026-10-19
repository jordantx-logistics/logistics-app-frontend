import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAsyncData } from '@/core/composables/useAsyncData'

import * as usersApi from '../api/users.api'
import type { CreateUserPayload, User, UserStatus } from '../types/users.types'

/** Filas por página del listado de usuarios (lo pagina el backend). */
export const PER_PAGE = 15

/**
 * Estado del módulo **users**: el listado paginado y las mutaciones.
 *
 * El filtrado y la paginación los hace el backend (`GET /identity/users` es un
 * paginador de Laravel), así que el store guarda la **última consulta** y
 * `load()` la reenvía con los cambios. Cada mutación recarga el listado, como en
 * el resto de módulos.
 */
export const useUsersStore = defineStore('users', () => {
  const query = ref<usersApi.UserListQuery>({ page: 1, per_page: PER_PAGE })

  const users = useAsyncData(() => usersApi.listUsers(query.value))

  /** Carga (o recarga) el listado con los filtros indicados. */
  async function load(next: usersApi.UserListQuery = {}): Promise<void> {
    query.value = { ...query.value, ...next }
    await users.load()
  }

  /** Da de alta un usuario y deja el listado al día. */
  async function createUser(payload: CreateUserPayload): Promise<User> {
    const created = await usersApi.createUser(payload)
    await users.load()

    return created
  }

  /** Suspende, reactiva o da de baja al usuario (UC-06). */
  async function changeStatus(id: number, status: UserStatus): Promise<void> {
    await usersApi.changeUserStatus(id, { status })
    await users.load()
  }

  /** Levanta el bloqueo por intentos fallidos (UC-07). */
  async function unlock(id: number): Promise<void> {
    await usersApi.unlockUser(id)
    await users.load()
  }

  return {
    users,
    query,
    load,
    createUser,
    changeStatus,
    unlock,
  }
})
