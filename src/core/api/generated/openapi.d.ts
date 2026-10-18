/**
 * GENERADO — NO EDITAR A MANO.
 *
 * Tipos del contrato OpenAPI del backend (`GET /docs.openapi`).
 * Generado con `pnpm gen:api` desde http://localhost:8000/docs.openapi
 * Ver `spec/09-decisiones/ADR-0008-openapi-tipos-generados.md`.
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
        /**
         * @description The ID of the agency.
         * @example 1
         */
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
        /**
         * @description The ID of the permission.
         * @example 564
         */
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
        /**
         * @description The ID of the role.
         * @example 564
         */
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
        /**
         * @description The ID of the role.
         * @example 564
         */
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
        /**
         * @description The ID of the user.
         * @example 1
         */
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
          /**
           * @description Must be a valid email address.
           * @example gbailey@example.net
           */
          email: string
          /** @example |]|{+- */
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
            /** @example true */
            success?: boolean
            /** @example Successfully authenticated. */
            message?: string
            data?: {
              user?: {
                /** @example 1 */
                id?: number
                /** @example Admin */
                name?: string
                /** @example admin@test.com */
                email?: string
              }
              /**
               * @example [
               *       "admin"
               *     ]
               */
              roles?: string[]
              /**
               * @example [
               *       "orders.create"
               *     ]
               */
              permissions?: string[]
              /**
               * @example [
               *       1
               *     ]
               */
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
          /**
           * @description Must be a valid email address.
           * @example gbailey@example.net
           */
          email: string
          /** @example |]|{+- */
          password: string
          /**
           * @description Must not be greater than 100 characters.
           * @example v
           */
          device_name: string
          /**
           * @description Must not be greater than 50 characters.
           * @example d
           */
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
            /** @example true */
            success?: boolean
            /** @example Token issued successfully. */
            message?: string
            data?: {
              /** @example 1|plainTextToken */
              token?: string
              /** @example Bearer */
              token_type?: string
              /** @example 2592000 */
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
          /**
           * @description Must be a valid email address.
           * @example gbailey@example.net
           */
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
            /** @example true */
            success?: boolean
            /** @example If the email is registered, we have sent the reset link. */
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
          /**
           * @description Token received by email.
           * @example 7a1f0c9d
           */
          token: string
          /**
           * @description Account email.
           * @example admin@test.com
           */
          email: string
          /**
           * @description New password (at least 8 characters).
           * @example NuevaClave123
           */
          password: string
          /**
           * @description Repeat of the new password.
           * @example NuevaClave123
           */
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
            /** @example true */
            success?: boolean
            /** @example Password reset successfully. */
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
            /** @example true */
            success?: boolean
            /** @example User retrieved successfully. */
            message?: string
            data?: {
              user?: {
                /** @example 1 */
                id?: number
                /** @example Admin */
                name?: string
                /** @example admin@test.com */
                email?: string
              }
              /**
               * @example [
               *       "admin"
               *     ]
               */
              roles?: string[]
              /**
               * @example [
               *       "orders.create"
               *     ]
               */
              permissions?: string[]
              /**
               * @example [
               *       1
               *     ]
               */
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
            /** @example true */
            success?: boolean
            /** @example Successfully logged out. */
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
            /** @example true */
            success?: boolean
            /** @example Successfully logged out from all devices. */
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
            /**
             * @example [
             *       {
             *         "id": 7,
             *         "tax_id": "20151757680",
             *         "business_name": "Hirthe Inc S.A.C.",
             *         "trade_name": "Hauck-Leuschke",
             *         "address": "544 Aglae Ridge Apt. 067\nLefflerhaven, TX 58408-7043",
             *         "contact_email": "pauline09@labadie.com",
             *         "contact_phone": "417-663-0574",
             *         "created_at": "2026-10-18T21:31:29.000000Z"
             *       },
             *       {
             *         "id": 8,
             *         "tax_id": "20445197905",
             *         "business_name": "King-Fahey S.A.C.",
             *         "trade_name": "Balistreri, Torp and Doyle",
             *         "address": "759 Eileen Street Apt. 985\nNorth Jacquesmouth, MI 49722",
             *         "contact_email": "bcruickshank@kovacek.info",
             *         "contact_phone": "(469) 693-1854",
             *         "created_at": "2026-10-18T21:31:29.000000Z"
             *       }
             *     ]
             */
            data?: {
              /** @example 7 */
              id?: number
              /** @example 20151757680 */
              tax_id?: string
              /** @example Hirthe Inc S.A.C. */
              business_name?: string
              /** @example Hauck-Leuschke */
              trade_name?: string
              /**
               * @example 544 Aglae Ridge Apt. 067
               *     Lefflerhaven, TX 58408-7043
               */
              address?: string
              /** @example pauline09@labadie.com */
              contact_email?: string
              /** @example 417-663-0574 */
              contact_phone?: string
              /** @example 2026-10-18T21:31:29.000000Z */
              created_at?: string
            }[]
            /** @example true */
            success?: string
            /** @example Companies retrieved successfully. */
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
          /**
           * @description Must not be greater than 50 characters.
           * @example b
           */
          tax_id: string
          /**
           * @description Must not be greater than 200 characters.
           * @example n
           */
          business_name: string
          /**
           * @description Must not be greater than 200 characters.
           * @example g
           */
          trade_name?: string | null
          /** @example architecto */
          address?: string | null
          /**
           * @description Must be a valid email address.
           * @example zbailey@example.net
           */
          contact_email?: string | null
          /**
           * @description Must not be greater than 20 characters.
           * @example iyvdljnikhwaykcm
           */
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
              /** @example 9 */
              id?: number
              /** @example 20055437432 */
              tax_id?: string
              /** @example Price Ltd S.A.C. */
              business_name?: string
              /** @example Dare Group */
              trade_name?: string
              /**
               * @example 334 Fritsch Knoll
               *     Careymouth, IA 64310-6432
               */
              address?: string
              /** @example matilda.feeney@leffler.info */
              contact_email?: string
              /** @example 337-329-5127 */
              contact_phone?: string
              /** @example 2026-10-18T21:31:29.000000Z */
              created_at?: string
            }
            /** @example true */
            success?: string
            /** @example Company created successfully. */
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
            /**
             * @example [
             *       {
             *         "id": 30,
             *         "document_type": "DNI",
             *         "document_number": "51757680",
             *         "first_name": "Noah",
             *         "last_name": "Cronin",
             *         "email": "emelie.baumbach@example.net",
             *         "phone": "203-867-3351",
             *         "created_at": "2026-10-18T21:31:29.000000Z"
             *       },
             *       {
             *         "id": 31,
             *         "document_type": "DNI",
             *         "document_number": "70917515",
             *         "first_name": "Daryl",
             *         "last_name": "VonRueden",
             *         "email": "feeney.demarcus@example.com",
             *         "phone": "559.897.7788",
             *         "created_at": "2026-10-18T21:31:29.000000Z"
             *       }
             *     ]
             */
            data?: {
              /** @example 30 */
              id?: number
              /** @example DNI */
              document_type?: string
              /** @example 51757680 */
              document_number?: string
              /** @example Noah */
              first_name?: string
              /** @example Cronin */
              last_name?: string
              /** @example emelie.baumbach@example.net */
              email?: string
              /** @example 203-867-3351 */
              phone?: string
              /** @example 2026-10-18T21:31:29.000000Z */
              created_at?: string
            }[]
            /** @example true */
            success?: string
            /** @example Persons retrieved successfully. */
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
          /**
           * @description Must not be greater than 20 characters.
           * @example bngzmiyvdljnikhw
           */
          document_type: string
          /**
           * @description Must not be greater than 50 characters.
           * @example a
           */
          document_number: string
          /**
           * @description Must not be greater than 100 characters.
           * @example y
           */
          first_name: string
          /**
           * @description Must not be greater than 100 characters.
           * @example k
           */
          last_name: string
          /**
           * @description Must be a valid email address.
           * @example lyric80@example.com
           */
          email?: string | null
          /**
           * @description Must not be greater than 20 characters.
           * @example pwlvqwrsitcpscql
           */
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
              /** @example 32 */
              id?: number
              /** @example DNI */
              document_type?: string
              /** @example 67173351 */
              document_number?: string
              /** @example Ashlynn */
              first_name?: string
              /** @example Mitchell */
              last_name?: string
              /** @example tleuschke@example.net */
              email?: string
              /** @example 646-329-5127 */
              phone?: string
              /** @example 2026-10-18T21:31:29.000000Z */
              created_at?: string
            }
            /** @example true */
            success?: string
            /** @example Person created successfully. */
            message?: string
          }
        }
      }
    }
  }
  listLogisticsOrders: {
    parameters: {
      query?: {
        /**
         * @description Page to return.
         * @example 2
         */
        page?: number
        /**
         * @description Rows per page (1..100, por defecto 15).
         * @example 15
         */
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
            /**
             * @example [
             *       {
             *         "id": 1,
             *         "ticket_number": "ORD-0000001",
             *         "ticket_code": "M5FOJEMY",
             *         "status": "pending",
             *         "weight_kg": "10.000",
             *         "total_amount": "30.00",
             *         "sender_id": 1,
             *         "receiver_id": 2,
             *         "origin_agency_id": 1,
             *         "destination_agency_id": 1,
             *         "created_at": "2026-10-16T05:13:12.000000Z"
             *       },
             *       {
             *         "id": 1,
             *         "ticket_number": "ORD-0000001",
             *         "ticket_code": "M5FOJEMY",
             *         "status": "pending",
             *         "weight_kg": "10.000",
             *         "total_amount": "30.00",
             *         "sender_id": 1,
             *         "receiver_id": 2,
             *         "origin_agency_id": 1,
             *         "destination_agency_id": 1,
             *         "created_at": "2026-10-16T05:13:12.000000Z"
             *       }
             *     ]
             */
            data?: {
              /** @example 1 */
              id?: number
              /** @example ORD-0000001 */
              ticket_number?: string
              /** @example M5FOJEMY */
              ticket_code?: string
              /** @example pending */
              status?: string
              /** @example 10.000 */
              weight_kg?: string
              /** @example 30.00 */
              total_amount?: string
              /** @example 1 */
              sender_id?: number
              /** @example 2 */
              receiver_id?: number
              /** @example 1 */
              origin_agency_id?: number
              /** @example 1 */
              destination_agency_id?: number
              /** @example 2026-10-16T05:13:12.000000Z */
              created_at?: string
            }[]
            links?: {
              /** @example /?page=1 */
              first?: string
              /** @example /?page=1 */
              last?: string
              /** @example null */
              prev?: string | null
              /** @example null */
              next?: string | null
            }
            meta?: {
              /** @example 1 */
              current_page?: number
              /** @example 1 */
              from?: number
              /** @example 1 */
              last_page?: number
              /**
               * @example [
               *       {
               *         "url": null,
               *         "label": "&laquo; Previous",
               *         "page": null,
               *         "active": false
               *       },
               *       {
               *         "url": "/?page=1",
               *         "label": "1",
               *         "page": 1,
               *         "active": true
               *       },
               *       {
               *         "url": null,
               *         "label": "Next &raquo;",
               *         "page": null,
               *         "active": false
               *       }
               *     ]
               */
              links?: {
                /** @example null */
                url?: string | null
                /** @example &laquo; Previous */
                label?: string
                /** @example null */
                page?: string | null
                /** @example false */
                active?: boolean
              }[]
              /** @example / */
              path?: string
              /** @example 15 */
              per_page?: number
              /** @example 2 */
              to?: number
              /** @example 2 */
              total?: number
            }
            /** @example true */
            success?: string
            /** @example Orders retrieved successfully. */
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
          /**
           * @description Must not be greater than 64 characters.
           * @example b
           */
          idempotency_key: string
          /** @example 16 */
          sender_id: number
          /** @example 16 */
          receiver_id: number
          /** @example 16 */
          origin_agency_id: number
          /** @example 16 */
          destination_agency_id: number
          /** @example Eius et animi quos velit et. */
          description?: string | null
          /**
           * @description Must be at least 0.
           * @example 60
           */
          weight_kg: number
          /**
           * @description Must be at least 0.
           * @example 42
           */
          volume_m3?: number | null
          /**
           * @description Must be at least 0.
           * @example 37
           */
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
              /** @example 1 */
              id?: number
              /** @example ORD-0000001 */
              ticket_number?: string
              /** @example M5FOJEMY */
              ticket_code?: string
              /** @example pending */
              status?: string
              /** @example 10.000 */
              weight_kg?: string
              /** @example 30.00 */
              total_amount?: string
              /** @example 1 */
              sender_id?: number
              /** @example 2 */
              receiver_id?: number
              /** @example 1 */
              origin_agency_id?: number
              /** @example 1 */
              destination_agency_id?: number
              /** @example 2026-10-16T05:13:12.000000Z */
              created_at?: string
            }
            /** @example true */
            success?: string
            /** @example Order created successfully. */
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
            /**
             * @example [
             *       {
             *         "id": 37,
             *         "code": "UWP##",
             *         "name": "Dare Group",
             *         "address": "99279 Kenyatta Knoll",
             *         "phone": "870-215-1024",
             *         "district": "Lefflerhaven",
             *         "is_active": true
             *       },
             *       {
             *         "id": 38,
             *         "code": "WVL##",
             *         "name": "Considine LLC",
             *         "address": "459 Hank Oval Apt. 905",
             *         "phone": "+1-747-759-6197",
             *         "district": "Beierburgh",
             *         "is_active": true
             *       }
             *     ]
             */
            data?: {
              /** @example 37 */
              id?: number
              /** @example UWP## */
              code?: string
              /** @example Dare Group */
              name?: string
              /** @example 99279 Kenyatta Knoll */
              address?: string
              /** @example 870-215-1024 */
              phone?: string
              /** @example Lefflerhaven */
              district?: string
              /** @example true */
              is_active?: boolean
            }[]
            /** @example true */
            success?: string
            /** @example Agencies retrieved successfully. */
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
          /**
           * @description Must not be greater than 10 characters.
           * @example bngzmi
           */
          code: string
          /**
           * @description Must not be greater than 150 characters.
           * @example y
           */
          name: string
          /**
           * @description Must not be greater than 255 characters.
           * @example v
           */
          address?: string | null
          /**
           * @description Must not be greater than 20 characters.
           * @example dljnikhwaykcmyuw
           */
          phone?: string | null
          /**
           * @description Must not be greater than 100 characters.
           * @example p
           */
          district?: string | null
          /** @example false */
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
              /** @example 39 */
              id?: number
              /** @example WLV## */
              code?: string
              /** @example Baumbach Ltd */
              name?: string
              /** @example 427 Predovic Ridge */
              address?: string
              /** @example +1.541.543.5490 */
              phone?: string
              /** @example Raynormouth */
              district?: string
              /** @example true */
              is_active?: boolean
            }
            /** @example true */
            success?: string
            /** @example Agency created successfully. */
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
        /**
         * @description The ID of the agency.
         * @example 1
         */
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
              /** @example 40 */
              id?: number
              /** @example QWR## */
              code?: string
              /** @example Leuschke, Bauch and Fritsch */
              name?: string
              /** @example 29606 Tromp Rue Apt. 161 */
              address?: string
              /** @example +12063337339 */
              phone?: string
              /** @example Daphneview */
              district?: string
              /** @example true */
              is_active?: boolean
            }
            /** @example true */
            success?: string
            /** @example Agency details retrieved successfully. */
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
        /**
         * @description The ID of the agency.
         * @example 1
         */
        id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /**
           * @description Must not be greater than 10 characters.
           * @example bngzmi
           */
          code: string
          /**
           * @description Must not be greater than 150 characters.
           * @example y
           */
          name: string
          /**
           * @description Must not be greater than 255 characters.
           * @example v
           */
          address?: string | null
          /**
           * @description Must not be greater than 20 characters.
           * @example dljnikhwaykcmyuw
           */
          phone?: string | null
          /**
           * @description Must not be greater than 100 characters.
           * @example p
           */
          district?: string | null
          /** @example true */
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
              /** @example 41 */
              id?: number
              /** @example SIT## */
              code?: string
              /** @example O'Keefe Inc */
              name?: string
              /** @example 4067 Stokes Place */
              address?: string
              /** @example +12063337339 */
              phone?: string
              /** @example Daphneview */
              district?: string
              /** @example true */
              is_active?: boolean
            }
            /** @example true */
            success?: string
            /** @example Agency updated successfully. */
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
        /**
         * @description The ID of the agency.
         * @example 1
         */
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
            /** @example true */
            success?: boolean
            /** @example Agency deactivated successfully. */
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
            /** @example true */
            success?: boolean
            /** @example Permissions retrieved successfully. */
            message?: string
            data?: {
              /**
               * @example [
               *       {
               *         "id": 1,
               *         "name": "orders.view",
               *         "guard_name": "web",
               *         "created_at": "2026-10-18T20:18:04.000000Z",
               *         "updated_at": "2026-10-18T20:18:04.000000Z"
               *       }
               *     ]
               */
              permissions?: {
                /** @example 1 */
                id?: number
                /** @example orders.view */
                name?: string
                /** @example web */
                guard_name?: string
                /** @example 2026-10-18T20:18:04.000000Z */
                created_at?: string
                /** @example 2026-10-18T20:18:04.000000Z */
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
          /**
           * @description Must not be greater than 255 characters.
           * @example b
           */
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
              /** @example 83 */
              id?: number
              /** @example Justina Gaylord */
              name?: string
              /** @example web */
              guard_name?: string
              /** @example 2026-10-18T21:31:31.000000Z */
              created_at?: string
              /** @example 2026-10-18T21:31:31.000000Z */
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
        /**
         * @description The ID of the permission.
         * @example 564
         */
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
              /** @example 82 */
              id?: number
              /** @example Pearl Hauck Sr. */
              name?: string
              /** @example web */
              guard_name?: string
              /** @example 2026-10-18T21:31:31.000000Z */
              created_at?: string
              /** @example 2026-10-18T21:31:31.000000Z */
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
        /**
         * @description The ID of the permission.
         * @example 564
         */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /**
           * @description Must not be greater than 255 characters.
           * @example b
           */
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
              /** @example 84 */
              id?: number
              /** @example Misael Runte */
              name?: string
              /** @example web */
              guard_name?: string
              /** @example 2026-10-18T21:31:31.000000Z */
              created_at?: string
              /** @example 2026-10-18T21:31:31.000000Z */
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
        /**
         * @description The ID of the permission.
         * @example 564
         */
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
            /** @example false */
            success?: boolean
            /** @example Resource not found. */
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
            /** @example true */
            success?: boolean
            /** @example Roles retrieved successfully. */
            message?: string
            data?: {
              /**
               * @example [
               *       {
               *         "id": 1,
               *         "name": "admin",
               *         "guard_name": "web",
               *         "permissions": [
               *           "orders.view",
               *           "orders.create"
               *         ],
               *         "created_at": "2026-10-18T20:18:04.000000Z",
               *         "updated_at": "2026-10-18T20:18:04.000000Z"
               *       }
               *     ]
               */
              roles?: {
                /** @example 1 */
                id?: number
                /** @example admin */
                name?: string
                /** @example web */
                guard_name?: string
                /**
                 * @example [
                 *       "orders.view",
                 *       "orders.create"
                 *     ]
                 */
                permissions?: string[]
                /** @example 2026-10-18T20:18:04.000000Z */
                created_at?: string
                /** @example 2026-10-18T20:18:04.000000Z */
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
          /**
           * @description Must not be greater than 255 characters.
           * @example b
           */
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
              /** @example 50 */
              id?: number
              /** @example Ms. Elisabeth Okuneva */
              name?: string
              /** @example web */
              guard_name?: string
              /** @example [] */
              permissions?: unknown[]
              /** @example 2026-10-18T21:31:30.000000Z */
              created_at?: string
              /** @example 2026-10-18T21:31:30.000000Z */
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
        /**
         * @description The ID of the role.
         * @example 564
         */
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
              /** @example 49 */
              id?: number
              /** @example Morgan Hirthe */
              name?: string
              /** @example web */
              guard_name?: string
              /** @example [] */
              permissions?: unknown[]
              /** @example 2026-10-18T21:31:30.000000Z */
              created_at?: string
              /** @example 2026-10-18T21:31:30.000000Z */
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
        /**
         * @description The ID of the role.
         * @example 564
         */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /**
           * @description Must not be greater than 255 characters.
           * @example b
           */
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
              /** @example 51 */
              id?: number
              /** @example Aleen O'Kon */
              name?: string
              /** @example web */
              guard_name?: string
              /** @example [] */
              permissions?: unknown[]
              /** @example 2026-10-18T21:31:30.000000Z */
              created_at?: string
              /** @example 2026-10-18T21:31:30.000000Z */
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
        /**
         * @description The ID of the role.
         * @example 564
         */
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
            /** @example false */
            success?: boolean
            /** @example Resource not found. */
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
        /**
         * @description The ID of the role.
         * @example 564
         */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /**
           * @description Ids de los permisos del catálogo.
           * @example [
           *       1,
           *       2,
           *       3
           *     ]
           */
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
              /** @example 52 */
              id?: number
              /** @example Ms. Audra Crooks II */
              name?: string
              /** @example web */
              guard_name?: string
              /** @example [] */
              permissions?: unknown[]
              /** @example 2026-10-18T21:31:31.000000Z */
              created_at?: string
              /** @example 2026-10-18T21:31:31.000000Z */
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
        /**
         * @description The ID of the user.
         * @example 1
         */
        id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /**
           * @description Must have at least 1 items.
           * @example []
           */
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
            /** @example false */
            success?: boolean
            /** @example The role ids field is required. */
            message?: string
            data?: {
              /**
               * @example [
               *       "The role ids field is required."
               *     ]
               */
              role_ids?: string[]
            }
            errors?: {
              /**
               * @example [
               *       "The role ids field is required."
               *     ]
               */
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
            /** @example true */
            success?: boolean
            /** @example System healthy. */
            message?: string
            data?: {
              /** @example ok */
              status?: string
              checks?: {
                database?: {
                  /** @example up */
                  status?: string
                  /** @example conexión "mysql" responde */
                  detail?: string
                  /** @example 0.6 */
                  latency_ms?: number
                }
                redis?: {
                  /** @example up */
                  status?: string
                  /** @example PONG de "redis" */
                  detail?: string
                  /** @example 0.3 */
                  latency_ms?: number
                }
                queue?: {
                  /** @example up */
                  status?: string
                  /** @example redis:default (0 pendientes) */
                  detail?: string
                  /** @example 0.4 */
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
            /** @example false */
            success?: boolean
            /** @example System degraded. */
            message?: string
            data?: {
              /** @example degraded */
              status?: string
              checks?: {
                database?: {
                  /** @example up */
                  status?: string
                  /** @example conexión "mysql" responde */
                  detail?: string
                  /** @example 0.6 */
                  latency_ms?: number
                }
                redis?: {
                  /** @example down */
                  status?: string
                  /** @example Connection refused */
                  detail?: string
                  /** @example 0.2 */
                  latency_ms?: number
                }
                queue?: {
                  /** @example up */
                  status?: string
                  /** @example redis:default (0 pendientes) */
                  detail?: string
                  /** @example 0.4 */
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
