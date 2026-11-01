import type { RequestOf, ResponseOf } from '@/core/api/types'

/** Tipos del módulo **tariffs**, derivados del contrato OpenAPI (ADR-0008). */

type ListTariffsResponse = ResponseOf<'/api/v1/logistics/tariffs', 'get'>

export type Tariff = Required<NonNullable<ListTariffsResponse['data']>[number]>

export type TariffPayload = RequestOf<'/api/v1/logistics/tariffs', 'post'>

type ListZonesResponse = ResponseOf<'/api/v1/logistics/zones', 'get'>

export type Zone = Required<NonNullable<ListZonesResponse['data']>[number]>

export type ZonePayload = RequestOf<'/api/v1/logistics/zones', 'post'>

type ListLocationsResponse = ResponseOf<'/api/v1/logistics/locations', 'get'>

export type Location = Required<NonNullable<ListLocationsResponse['data']>[number]>

export type LocationPayload = RequestOf<'/api/v1/logistics/locations/{id}', 'put'>

type ListCoveragesResponse = ResponseOf<'/api/v1/logistics/agency-coverages', 'get'>

export type Coverage = Required<NonNullable<ListCoveragesResponse['data']>[number]>

export type CoveragePayload = RequestOf<'/api/v1/logistics/agency-coverages', 'post'>

export interface PageMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface Page<Row> {
  rows: Row[]
  meta: PageMeta
}
