import type { paths } from '@/core/api/generated/openapi'
import type { JsonOf, RequestOf, ResponseOf } from '@/core/api/types'

/** Tipos del módulo **reports**, derivados del contrato OpenAPI (ADR-0008). */

type CatalogResponse = ResponseOf<'/api/v1/reports/catalog', 'get'>

export type ReportDefinition = Required<NonNullable<CatalogResponse['data']>[number]>

export type ListExportsResponse = ResponseOf<'/api/v1/reports/exports', 'get'>

export type ReportExport = Required<NonNullable<ListExportsResponse['data']>[number]>

export type RequestExportPayload = RequestOf<'/api/v1/reports/exports', 'post'>

// Responde 202, que `ResponseOf` no contempla: la generación es asíncrona.
export type RequestExportResponse = JsonOf<
  paths['/api/v1/reports/exports']['post']['responses'][202]
>
