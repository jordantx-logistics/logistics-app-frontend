import type { RequestOf, ResponseOf } from '@/core/api/types'

/**
 * Tipos del módulo **customers**, derivados del contrato OpenAPI (`generated/`
 * + helpers de `core/api/types`, ADR-0008): nada escrito a mano. El módulo solo
 * afina la opcionalidad que el backend no declara (`required`).
 */

// ---------------------------------------------------------------------------
// Personas (`/api/v1/customer/persons`)
// ---------------------------------------------------------------------------

/** `GET /api/v1/customer/persons` — personas registradas (sin paginar). */
export type ListPersonsResponse = ResponseOf<'/api/v1/customer/persons', 'get'>

/** Fila de persona (el contrato no marca `required`, la capa API sí). */
export type Person = Required<NonNullable<ListPersonsResponse['data']>[number]>

/** `POST /api/v1/customer/persons`. */
export type CreatePersonPayload = RequestOf<'/api/v1/customer/persons', 'post'>

/** Respuesta del alta de persona. */
export type CreatePersonResponse = ResponseOf<'/api/v1/customer/persons', 'post'>

// ---------------------------------------------------------------------------
// Empresas (`/api/v1/customer/companies`)
// ---------------------------------------------------------------------------

/** `GET /api/v1/customer/companies` — clientes corporativos (sin paginar). */
export type ListCompaniesResponse = ResponseOf<'/api/v1/customer/companies', 'get'>

/** Fila de empresa. */
export type Company = Required<NonNullable<ListCompaniesResponse['data']>[number]>

/** `POST /api/v1/customer/companies`. */
export type CreateCompanyPayload = RequestOf<'/api/v1/customer/companies', 'post'>

/** Respuesta del alta de empresa. */
export type CreateCompanyResponse = ResponseOf<'/api/v1/customer/companies', 'post'>
