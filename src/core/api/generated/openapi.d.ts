/**
 * GENERADO — NO EDITAR A MANO.
 *
 * Tipos del contrato OpenAPI del backend, versionado en
 * `openapi/openapi.yaml` del repo `logistics-app-backend` (criterio 10 de
 * la Fase 1; ADR-0008): el CI compara esta derivación contra el contrato
 * commiteado y falla si hay deriva. Regenerar con `pnpm gen:api` (la ruta
 * concreta la fija `CONTRACT_PATH`; en el CI, el checkout adicional del
 * repo backend).
 */

export interface paths {
  '/api/v1/auth/login': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Login (web)
     * @description Authenticates against the session guard and sets the `HttpOnly` session
     *     cookie. Requires the CSRF cookie (`GET /sanctum/csrf-cookie`) first.
     */
    post: operations['loginweb']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/auth/token': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Issue Token (apps / PDA)
     * @description Returns an opaque token to send as `Authorization: Bearer <token>`.
     *     The plain value is shown only once.
     */
    post: operations['issueTokenappsPDA']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/auth/forgot-password': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Forgot Password
     * @description Sends the reset link when the email exists. The answer is neutral on
     *     purpose: it never reveals whether the account exists.
     */
    post: operations['forgotPassword']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/auth/reset-password': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Reset Password
     * @description Consumes the token from the email and sets the new password. Revokes
     *     every access token of the user.
     *
     *     `password_confirmation` is required by the validation rules (`confirmed`)
     *     but Scribe does not infer it from them, so it is declared by hand.
     */
    post: operations['resetPassword']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/auth/me': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Current User
     * @description Returns the authenticated user with roles, permissions and agency scope.
     */
    get: operations['currentUser']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/auth/logout': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Logout
     * @description Revokes the current access token (apps) and closes the session (web).
     */
    post: operations['logout']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/auth/logout-all': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Logout All Devices
     * @description Revokes every token of the user. A later request with a revoked token
     *     answers 401.
     */
    post: operations['logoutAllDevices']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/customer/companies': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Corporate Customers
     * @description Retrieves a list of all registered corporate clients.
     */
    get: operations['listCorporateCustomers']
    put?: never
    /**
     * Register Corporate Customer
     * @description Creates a new company record, typically requiring RUC formatting and business names.
     */
    post: operations['registerCorporateCustomer']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/customer/persons': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Individual Customers
     * @description Retrieves a list of all registered individual clients.
     */
    get: operations['listIndividualCustomers']
    put?: never
    /**
     * Register Individual Customer
     * @description Creates a new person record in the database using their personal document (e.g. DNI).
     */
    post: operations['registerIndividualCustomer']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/orders': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Logistics Orders
     * @description Returns the orders visible to the authenticated user, newest first, paginated with `page` and `per_page` (max 100).
     */
    get: operations['listLogisticsOrders']
    put?: never
    /**
     * Create Logistics Order
     * @description Registers a new order in the system, taking into account idempotency, customer and agency validations, and applies dynamic tariff pricing.
     *     Fires a background event when successful.
     */
    post: operations['createLogisticsOrder']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/organization/agencies': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Agencies
     * @description Retrieves all registered agencies configured in the system.
     */
    get: operations['listAgencies']
    put?: never
    /**
     * Create Agency
     * @description Registers a new branch location where packages can be originated or received.
     */
    post: operations['createAgency']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/organization/agencies/{id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the agency. */
        id: number
      }
      cookie?: never
    }
    /**
     * Request Agency Details
     * @description Retrieves detailed geographical and contact information for a specific agency.
     */
    get: operations['requestAgencyDetails']
    /**
     * Modify Agency
     * @description Updates an existing agency's contact information, active status, or configured properties.
     */
    put: operations['modifyAgency']
    post?: never
    /**
     * Delete Agency
     * @description Removes an agency from the system. (Warning: This action usually requires checking for relational integrity).
     */
    delete: operations['deleteAgency']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/permission/permissions': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List all permissions
     * @description El controlador envuelve la colección (`data.permissions`), y eso no se
     *     puede inferir de un `@apiResource`: la forma se documenta a mano para que
     *     el contrato no mienta (`spec/08-calidad/02-contrato-openapi-frontend.md`).
     */
    get: operations['listAllPermissions']
    put?: never
    /** Create a new permission */
    post: operations['createANewPermission']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/permission/permissions/{id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the permission. */
        id: string
      }
      cookie?: never
    }
    /** Retrieve a specific permission */
    get: operations['retrieveASpecificPermission']
    /** Update an existing permission */
    put: operations['updateAnExistingPermission']
    post?: never
    /** Delete a permission */
    delete: operations['deleteAPermission']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/permission/roles': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List all roles
     * @description El controlador envuelve la colección (`data.roles`), y eso no se puede
     *     inferir de un `@apiResource`: la forma se documenta a mano para que el
     *     contrato no mienta (`spec/08-calidad/02-contrato-openapi-frontend.md`).
     */
    get: operations['listAllRoles']
    put?: never
    /** Create a new role */
    post: operations['createANewRole']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/permission/roles/{id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the role. */
        id: string
      }
      cookie?: never
    }
    /** Retrieve a specific role */
    get: operations['retrieveASpecificRole']
    /** Update an existing role */
    put: operations['updateAnExistingRole']
    post?: never
    /** Delete a role */
    delete: operations['deleteARole']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/permission/roles/{id}/permissions': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the role. */
        id: string
      }
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Assign permissions to a role
     * @description Sustituye los permisos del rol por los que llegan (`syncPermissions`).
     */
    post: operations['assignPermissionsToARole']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/permission/users/{id}/roles': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        id: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Assign a role to a user */
    post: operations['assignARoleToAUser']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/health': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Readiness
     * @description Devuelve 200 si todas las dependencias responden y 503 con el detalle por
     *     dependencia si alguna está caída.
     */
    get: operations['readiness']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: never
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  loginweb: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must be a valid email address. */
          email: string
          password: string
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              user?: {
                id?: number
                name?: string
                email?: string
              }
              roles?: string[]
              permissions?: string[]
              agencies?: number[]
            }
          }
        }
      }
    }
  }
  issueTokenappsPDA: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must be a valid email address. */
          email: string
          password: string
          /** @description Must not be greater than 100 characters. */
          device_name: string
          /** @description Must not be greater than 50 characters. */
          platform?: string | null
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              token?: string
              token_type?: string
              expires_in?: number
            }
          }
        }
      }
    }
  }
  forgotPassword: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must be a valid email address. */
          email: string
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
          }
        }
      }
    }
  }
  resetPassword: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Token received by email. */
          token: string
          /** @description Account email. */
          email: string
          /** @description New password (at least 8 characters). */
          password: string
          /** @description Repeat of the new password. */
          password_confirmation: string
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
          }
        }
      }
    }
  }
  currentUser: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              user?: {
                id?: number
                name?: string
                email?: string
              }
              roles?: string[]
              permissions?: string[]
              agencies?: number[]
            }
          }
        }
      }
    }
  }
  logout: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
          }
        }
      }
    }
  }
  logoutAllDevices: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
          }
        }
      }
    }
  }
  listCorporateCustomers: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              tax_id?: string
              business_name?: string
              trade_name?: string
              address?: string
              contact_email?: string
              contact_phone?: string
              created_at?: string
            }[]
            success?: string
            message?: string
          }
        }
      }
    }
  }
  registerCorporateCustomer: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 50 characters. */
          tax_id: string
          /** @description Must not be greater than 200 characters. */
          business_name: string
          /** @description Must not be greater than 200 characters. */
          trade_name?: string | null
          address?: string | null
          /** @description Must be a valid email address. */
          contact_email?: string | null
          /** @description Must not be greater than 20 characters. */
          contact_phone?: string | null
        }
      }
    }
    responses: {
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              tax_id?: string
              business_name?: string
              trade_name?: string
              address?: string
              contact_email?: string
              contact_phone?: string
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  listIndividualCustomers: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              document_type?: string
              document_number?: string
              first_name?: string
              last_name?: string
              email?: string
              phone?: string
              created_at?: string
            }[]
            success?: string
            message?: string
          }
        }
      }
    }
  }
  registerIndividualCustomer: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 20 characters. */
          document_type: string
          /** @description Must not be greater than 50 characters. */
          document_number: string
          /** @description Must not be greater than 100 characters. */
          first_name: string
          /** @description Must not be greater than 100 characters. */
          last_name: string
          /** @description Must be a valid email address. */
          email?: string | null
          /** @description Must not be greater than 20 characters. */
          phone?: string | null
        }
      }
    }
    responses: {
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              document_type?: string
              document_number?: string
              first_name?: string
              last_name?: string
              email?: string
              phone?: string
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  listLogisticsOrders: {
    parameters: {
      query?: {
        /** @description Page to return. */
        page?: number
        /** @description Rows per page (1..100, por defecto 15). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              ticket_number?: string
              ticket_code?: string
              status?: string
              weight_kg?: string
              total_amount?: string
              sender_id?: number
              receiver_id?: number
              origin_agency_id?: number
              destination_agency_id?: number
              created_at?: string
            }[]
            links?: {
              first?: string
              last?: string
              prev?: string | null
              next?: string | null
            }
            meta?: {
              current_page?: number
              from?: number
              last_page?: number
              links?: {
                url?: string | null
                label?: string
                page?: string | null
                active?: boolean
              }[]
              path?: string
              per_page?: number
              to?: number
              total?: number
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  createLogisticsOrder: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 64 characters. */
          idempotency_key: string
          sender_id: number
          receiver_id: number
          origin_agency_id: number
          destination_agency_id: number
          description?: string | null
          /** @description Must be at least 0. */
          weight_kg: number
          /** @description Must be at least 0. */
          volume_m3?: number | null
          /** @description Must be at least 0. */
          declared_value?: number | null
        }
      }
    }
    responses: {
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              ticket_number?: string
              ticket_code?: string
              status?: string
              weight_kg?: string
              total_amount?: string
              sender_id?: number
              receiver_id?: number
              origin_agency_id?: number
              destination_agency_id?: number
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  listAgencies: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              code?: string
              name?: string
              address?: string
              phone?: string
              district?: string
              is_active?: boolean
            }[]
            success?: string
            message?: string
          }
        }
      }
    }
  }
  createAgency: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 10 characters. */
          code: string
          /** @description Must not be greater than 150 characters. */
          name: string
          /** @description Must not be greater than 255 characters. */
          address?: string | null
          /** @description Must not be greater than 20 characters. */
          phone?: string | null
          /** @description Must not be greater than 100 characters. */
          district?: string | null
          is_active?: boolean
        }
      }
    }
    responses: {
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              code?: string
              name?: string
              address?: string
              phone?: string
              district?: string
              is_active?: boolean
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  requestAgencyDetails: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the agency. */
        id: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              code?: string
              name?: string
              address?: string
              phone?: string
              district?: string
              is_active?: boolean
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  modifyAgency: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the agency. */
        id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 10 characters. */
          code: string
          /** @description Must not be greater than 150 characters. */
          name: string
          /** @description Must not be greater than 255 characters. */
          address?: string | null
          /** @description Must not be greater than 20 characters. */
          phone?: string | null
          /** @description Must not be greater than 100 characters. */
          district?: string | null
          is_active?: boolean
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              code?: string
              name?: string
              address?: string
              phone?: string
              district?: string
              is_active?: boolean
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  deleteAgency: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the agency. */
        id: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
          }
        }
      }
    }
  }
  listAllPermissions: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              permissions?: {
                id?: number
                name?: string
                guard_name?: string
                created_at?: string
                updated_at?: string
              }[]
            }
          }
        }
      }
    }
  }
  createANewPermission: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 255 characters. */
          name: string
        }
      }
    }
    responses: {
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              name?: string
              guard_name?: string
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  retrieveASpecificPermission: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the permission. */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              name?: string
              guard_name?: string
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  updateAnExistingPermission: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the permission. */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 255 characters. */
          name: string
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              name?: string
              guard_name?: string
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  deleteAPermission: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the permission. */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      404: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
          }
        }
      }
    }
  }
  listAllRoles: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              roles?: {
                id?: number
                name?: string
                guard_name?: string
                permissions?: string[]
                created_at?: string
                updated_at?: string
              }[]
            }
          }
        }
      }
    }
  }
  createANewRole: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 255 characters. */
          name: string
        }
      }
    }
    responses: {
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              name?: string
              guard_name?: string
              permissions?: unknown[]
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  retrieveASpecificRole: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the role. */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              name?: string
              guard_name?: string
              permissions?: unknown[]
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  updateAnExistingRole: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the role. */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 255 characters. */
          name: string
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              name?: string
              guard_name?: string
              permissions?: unknown[]
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  deleteARole: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the role. */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      404: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
          }
        }
      }
    }
  }
  assignPermissionsToARole: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the role. */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Ids de los permisos del catálogo. */
          permission_ids: number[]
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            data?: {
              id?: number
              name?: string
              guard_name?: string
              permissions?: unknown[]
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  assignARoleToAUser: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must have at least 1 items. */
          role_ids: Record<string, never>
        }
      }
    }
    responses: {
      422: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              role_ids?: string[]
            }
            errors?: {
              role_ids?: string[]
            }
          }
        }
      }
    }
  }
  readiness: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              status?: string
              checks?: {
                database?: {
                  status?: string
                  detail?: string
                  latency_ms?: number
                }
                redis?: {
                  status?: string
                  detail?: string
                  latency_ms?: number
                }
                queue?: {
                  status?: string
                  detail?: string
                  latency_ms?: number
                }
              }
            }
          }
        }
      }
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              status?: string
              checks?: {
                database?: {
                  status?: string
                  detail?: string
                  latency_ms?: number
                }
                redis?: {
                  status?: string
                  detail?: string
                  latency_ms?: number
                }
                queue?: {
                  status?: string
                  detail?: string
                  latency_ms?: number
                }
              }
            }
          }
        }
      }
    }
  }
}
