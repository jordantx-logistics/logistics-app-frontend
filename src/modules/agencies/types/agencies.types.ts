import type { RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **agencies**, derivados del contrato OpenAPI (`generated/`
 * + helpers de `core/api/types`, ADR-0008): nada escrito a mano. El módulo solo
 * afina la opcionalidad que el backend no declara (`required`).
 */

/** `GET /api/v1/organization/agencies` — agencias configuradas (sin paginar). */
export type ListAgenciesResponse = ResponseOf<'/api/v1/organization/agencies', 'get'>

/** Fila de agencia. */
export type Agency = Required<NonNullable<ListAgenciesResponse['data']>[number]>

/** `POST /api/v1/organization/agencies`. */
export type CreateAgencyPayload = RequestOf<'/api/v1/organization/agencies', 'post'>

/** Respuesta del alta de agencia. */
export type CreateAgencyResponse = ResponseOf<'/api/v1/organization/agencies', 'post'>
