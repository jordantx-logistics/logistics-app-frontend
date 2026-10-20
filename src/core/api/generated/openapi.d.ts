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
     * @description Creates a new company **and** its customer aggregate (`customers`), so it can be used
     *     as sender/receiver of an order. The RUC is validated (11 digits and check digit)
     *     in the use case, which answers with an `error_code`.
     */
    post: operations['registerCorporateCustomer']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/customers': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Customers
     * @description Returns customers, newest first, paginated with `page` and `per_page` (max 100).
     *     `q` searches by display name, document number or email.
     */
    get: operations['listCustomers']
    put?: never
    /**
     * Register Customer
     * @description Creates the customer aggregate and its backing person or company in one transaction.
     *     The document is unique per type and validated (RUC check digit included).
     */
    post: operations['registerCustomer']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/customers/{id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the customer. */
        id: number
      }
      cookie?: never
    }
    /** Show Customer */
    get: operations['showCustomer']
    /**
     * Update Customer
     * @description Updates contact data and the backing person/company. The document cannot be changed.
     */
    put: operations['updateCustomer']
    post?: never
    /**
     * Deactivate Customer
     * @description Soft-style deletion: sets `is_active = false`. Rejected with 409 while the
     *     customer has pending, confirmed or in-transit orders.
     */
    delete: operations['deactivateCustomer']
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
     * @description Creates a new person **and** its customer aggregate (`customers`), so the person can
     *     be used as sender/receiver of an order. Business rules (document format and
     *     uniqueness) run in the use case and answer with an `error_code`.
     */
    post: operations['registerIndividualCustomer']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/attendance': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Attendance
     * @description Lista las marcaciones visibles para el usuario, filtrables por empleado, agencia, estado y rango de fechas.
     */
    get: operations['listAttendance']
    put?: never
    /**
     * Register Attendance
     * @description Registra una marcación de entrada/salida de un empleado. Es idempotente por `idempotency_key`, por lo que los reintentos offline no duplican registros.
     */
    post: operations['registerAttendance']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/attendance/summary': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Attendance Summary
     * @description Consolidado diario por empleado (`attendance_days`), filtrable por empleado y rango de fechas.
     */
    get: operations['attendanceSummary']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/attendance/{attendance_id}/void': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the attendance. */
        attendance_id: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Void Attendance
     * @description Anula una marcación (RRHH). El consolidado del día se recalcula sin ella.
     */
    post: operations['voidAttendance']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/devices': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Devices
     * @description Lista los dispositivos del usuario (o los de otro usuario con `user_id` si se tiene `devices.manage`).
     */
    get: operations['listDevices']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/devices/{device_id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the device. */
        device_id: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /**
     * Revoke Device
     * @description Revoca el dispositivo y sus tokens: la siguiente petición con ese token responde `401`.
     */
    delete: operations['revokeDevice']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/employees': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Employees
     * @description Lista los empleados visibles para el usuario, filtrables por estado, agencia y texto.
     */
    get: operations['listEmployees']
    put?: never
    /**
     * Create Employee
     * @description Da de alta un empleado de RRHH (UC-08).
     */
    post: operations['createEmployee']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/employees/{employee_id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the employee. */
        employee_id: number
      }
      cookie?: never
    }
    /** Request Employee Details */
    get: operations['requestEmployeeDetails']
    /** Modify Employee */
    put: operations['modifyEmployee']
    post?: never
    /**
     * Deactivate Employee
     * @description Da de baja al empleado (UC-09): `status = terminated` y desactiva su usuario si lo tuviera.
     */
    delete: operations['deactivateEmployee']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/users': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List Users
     * @description Lista los usuarios, filtrables por estado, texto (nombre/email) y agencia.
     */
    get: operations['listUsers']
    put?: never
    /**
     * Create User
     * @description Da de alta un usuario (UC-01). Sin roles, se asigna `employee`.
     */
    post: operations['createUser']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/users/{user_id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
      }
      cookie?: never
    }
    /** Request User Details */
    get: operations['requestUserDetails']
    /**
     * Modify User
     * @description Actualiza nombre, email o el vínculo con RRHH del usuario.
     */
    put: operations['modifyUser']
    post?: never
    /**
     * Suspend User
     * @description Atajo de UC-06: suspende al usuario sin pasar por el cambio de estado genérico.
     */
    delete: operations['suspendUser']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/users/{user_id}/status': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    /**
     * Change User Status
     * @description Suspende, reactiva o da de baja al usuario (UC-06). Al desactivarlo se revocan sus tokens.
     */
    patch: operations['changeUserStatus']
    trace?: never
  }
  '/api/v1/identity/users/{user_id}/unlock': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Unlock User
     * @description Limpia el bloqueo por intentos fallidos (UC-07).
     */
    post: operations['unlockUser']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/identity/users/{user_id}/agency-scope': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
      }
      cookie?: never
    }
    get?: never
    /**
     * Assign Agency Scope
     * @description Sincroniza el ámbito de agencia del usuario y su agencia principal (UC-16).
     */
    put: operations['assignAgencyScope']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/agency-coverages': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List Agency Coverages */
    get: operations['listAgencyCoverages']
    put?: never
    /** Create Agency Coverage */
    post: operations['createAgencyCoverage']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/agency-coverages/{coverage_id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the coverage. */
        coverage_id: number
      }
      cookie?: never
    }
    get?: never
    /** Update Agency Coverage */
    put: operations['updateAgencyCoverage']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/locations': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List Locations */
    get: operations['listLocations']
    put?: never
    /** Create Location */
    post: operations['createLocation']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/locations/{id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the location. */
        id: number
      }
      cookie?: never
    }
    get?: never
    /**
     * Update Location
     * @description Cambiar `zone_id` es cómo se reagrupa un distrito en otra zona de tarifa.
     */
    put: operations['updateLocation']
    post?: never
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
  '/api/v1/logistics/orders/by-ticket/{ticketCode}': {
    parameters: {
      query?: never
      header?: never
      path: {
        ticketCode: string
      }
      cookie?: never
    }
    /** Show Logistics Order by ticket code */
    get: operations['showLogisticsOrderByTicketCode']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/orders/{order}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The order. */
        order: string
      }
      cookie?: never
    }
    /** Show Logistics Order */
    get: operations['showLogisticsOrder']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/orders/quote': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Quote Logistics Order
     * @description Calculates the price without persisting anything, using the same pricing engine and rules as order creation.
     */
    post: operations['quoteLogisticsOrder']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/orders/{order}/confirm': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The order. */
        order: string
      }
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Confirm Logistics Order
     * @description Confirms a pending order (`pending` -> `confirmed`) and freezes its price. Rejects any other transition with `INVALID_STATUS_TRANSITION`.
     */
    post: operations['confirmLogisticsOrder']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/orders/{order}/cancel': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The order. */
        order: string
      }
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Cancel Logistics Order
     * @description Cancels a pending or confirmed order. Only `pending` and `confirmed` orders can be cancelled.
     */
    post: operations['cancelLogisticsOrder']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/orders/{order}/delivery': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The order. */
        order: string
      }
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    /**
     * Update Logistics Order delivery
     * @description Defines delivery while the order is still `pending` and re-quotes the price (delivery surcharge). Once confirmed, the price is immutable (`ORDER_ALREADY_CONFIRMED`).
     */
    patch: operations['updateLogisticsOrderDelivery']
    trace?: never
  }
  '/api/v1/logistics/tariffs': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List Tariffs */
    get: operations['listTariffs']
    put?: never
    /**
     * Create Tariff
     * @description Rechaza alcances incoherentes (`TARIFF_SCOPE_INVALID`), vigencias
     *     invertidas (`TARIFF_VALIDITY_INVALID`), tramos solapados
     *     (`TARIFF_BRACKETS_INVALID`) y tarifarios activos solapados del mismo
     *     alcance (`TARIFF_OVERLAP`, 409).
     */
    post: operations['createTariff']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/tariffs/{id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the tariff. */
        id: number
      }
      cookie?: never
    }
    /** Show Tariff */
    get: operations['showTariff']
    /**
     * Update Tariff
     * @description El payload se funde con el tarifario actual antes de validar, y los
     *     tramos se reemplazan en bloque (los enviados sustituyen a los anteriores).
     */
    put: operations['updateTariff']
    post?: never
    /** Deactivate Tariff */
    delete: operations['deactivateTariff']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/zones': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List Zones */
    get: operations['listZones']
    put?: never
    /** Create Zone */
    post: operations['createZone']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/logistics/zones/{id}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the zone. */
        id: number
      }
      cookie?: never
    }
    get?: never
    /** Update Zone */
    put: operations['updateZone']
    post?: never
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
          /** @description This field is required when <code>device_uuid</code> is present. Must not be greater than 50 characters. */
          platform?: string | null
          /** @description Must not be greater than 100 characters. */
          device_uuid?: string | null
          /** @description Must not be greater than 30 characters. */
          app_version?: string | null
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
  listCustomers: {
    parameters: {
      query?: {
        /** @description Search term (name, document or email). */
        q?: string
        /** @description Filter by type: person|company. */
        customer_type?: string
        /** @description Filter by active flag. */
        is_active?: boolean
        /** @description Page to return. */
        page?: number
        /** @description Rows per page (1..100, default 15). */
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
              id?: string | null
              code?: string | null
              customer_type?: string
              person_id?: number
              company_id?: string | null
              display_name?: string
              document_type?: string
              document_number?: string
              email?: string
              phone?: string
              address?: string | null
              is_active?: boolean
              credit_limit?: string | null
              created_at?: string | null
              updated_at?: string | null
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
  registerCustomer: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          customer_type: 'person' | 'company'
          /** @description Must not be greater than 10 characters. */
          document_type: string
          /** @description Must not be greater than 20 characters. */
          document_number: string
          /** @description Must not be greater than 200 characters. */
          display_name?: string | null
          /** @description Must be a valid email address. Must not be greater than 255 characters. */
          email?: string | null
          /** @description Must not be greater than 20 characters. */
          phone?: string | null
          /** @description Must not be greater than 255 characters. */
          address?: string | null
          /** @description Must be at least 0. */
          credit_limit?: number | null
          /** @description Must not be greater than 100 characters. */
          first_name?: string
          /** @description Must not be greater than 100 characters. */
          last_name?: string
          /** @description Must not be greater than 200 characters. */
          business_name: string
          /** @description Must not be greater than 200 characters. */
          trade_name?: string | null
          /** @description Must be a valid email address. Must not be greater than 255 characters. */
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
              id?: string | null
              code?: string | null
              customer_type?: string
              person_id?: number
              company_id?: string | null
              display_name?: string
              document_type?: string
              document_number?: string
              email?: string
              phone?: string
              address?: string | null
              is_active?: boolean
              credit_limit?: string | null
              created_at?: string | null
              updated_at?: string | null
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  showCustomer: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the customer. */
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
              id?: string | null
              code?: string | null
              customer_type?: string
              person_id?: number
              company_id?: string | null
              display_name?: string
              document_type?: string
              document_number?: string
              email?: string
              phone?: string
              address?: string | null
              is_active?: boolean
              credit_limit?: string | null
              created_at?: string | null
              updated_at?: string | null
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  updateCustomer: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the customer. */
        id: number
      }
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must not be greater than 200 characters. */
          display_name?: string
          /** @description Must be a valid email address. Must not be greater than 255 characters. */
          email?: string | null
          /** @description Must not be greater than 20 characters. */
          phone?: string | null
          /** @description Must not be greater than 255 characters. */
          address?: string | null
          /** @description Must be at least 0. */
          credit_limit?: number | null
          /** @description Must not be greater than 100 characters. */
          first_name?: string
          /** @description Must not be greater than 100 characters. */
          last_name?: string
          /** @description Must not be greater than 200 characters. */
          business_name?: string
          /** @description Must not be greater than 200 characters. */
          trade_name?: string | null
          /** @description Must be a valid email address. Must not be greater than 255 characters. */
          contact_email?: string | null
          /** @description Must not be greater than 20 characters. */
          contact_phone?: string | null
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
              id?: string | null
              code?: string | null
              customer_type?: string
              person_id?: number
              company_id?: string | null
              display_name?: string
              document_type?: string
              document_number?: string
              email?: string
              phone?: string
              address?: string | null
              is_active?: boolean
              credit_limit?: string | null
              created_at?: string | null
              updated_at?: string | null
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  deactivateCustomer: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the customer. */
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
              id?: string | null
              code?: string | null
              customer_type?: string
              person_id?: number
              company_id?: string | null
              display_name?: string
              document_type?: string
              document_number?: string
              email?: string
              phone?: string
              address?: string | null
              is_active?: boolean
              credit_limit?: string | null
              created_at?: string | null
              updated_at?: string | null
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
  listAttendance: {
    parameters: {
      query?: {
        /** @description Filtra por empleado. */
        employee_id?: number
        /** @description Filtra por agencia. */
        agency_id?: number
        /** @description valid,late,duplicate,voided. */
        status?: string
        /** @description Fecha ISO-8601 inferior (inclusive). */
        from?: string
        /** @description Fecha ISO-8601 superior (inclusive). */
        to?: string
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
              employee_id?: number
              agency_id?: number
              type?: string
              marked_at?: string
              source?: string
              device_id?: string | null
              latitude?: string | null
              longitude?: string | null
              ip_address?: string
              status?: string
              idempotency_key?: string
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
  registerAttendance: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          employee_id: number
          /** @description Must be at least 1. */
          agency_id: number
          /** @enum {string} */
          type: 'in' | 'out' | 'break-start' | 'break-end'
          /** @description Must be a valid date. */
          marked_at?: string | null
          /** @enum {string|null} */
          source?: 'web' | 'app' | 'pda' | 'biometric' | null
          /** @description The <code>id</code> of an existing record in the devices table. */
          device_id?: number | null
          /** @description Must be between -90 and 90. */
          latitude?: number | null
          /** @description Must be between -180 and 180. */
          longitude?: number | null
          /** @description Must not be greater than 64 characters. */
          idempotency_key: string
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
              employee_id?: number
              agency_id?: number
              type?: string
              marked_at?: string
              source?: string
              device_id?: string | null
              latitude?: string | null
              longitude?: string | null
              ip_address?: string
              status?: string
              idempotency_key?: string
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  attendanceSummary: {
    parameters: {
      query?: {
        /** @description Filtra por empleado. */
        employee_id?: number
        /** @description Fecha inferior (inclusive). */
        from?: string
        /** @description Fecha superior (inclusive). */
        to?: string
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
            success?: boolean
            message?: string
            data?: {
              employee_id?: number
              work_date?: string
              first_in_at?: string
              last_out_at?: string
              worked_minutes?: number
              late_minutes?: number
              status?: string
            }[]
          }
        }
      }
    }
  }
  voidAttendance: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the attendance. */
        attendance_id: number
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
  listDevices: {
    parameters: {
      query?: {
        /** @description Dispositivos de otro usuario (requiere `devices.manage`). */
        user_id?: number
        /** @description active,revoked. */
        status?: string
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
              user_id?: number
              device_name?: string
              platform?: string
              device_uuid?: string
              app_version?: string
              status?: string
              last_seen_at?: string
              revoked_at?: string | null
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
  revokeDevice: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the device. */
        device_id: number
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
  listEmployees: {
    parameters: {
      query?: {
        /** @description active,on_leave,terminated. */
        status?: string
        /** @description Agencia base. */
        agency_id?: number
        /** @description Busca por documento o nombre. */
        q?: string
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
              person_id?: string | null
              document_type?: string
              document_number?: string
              first_name?: string
              last_name?: string
              full_name?: string
              email?: string
              phone?: string
              position?: string
              agency_id?: number
              hired_at?: string
              terminated_at?: string | null
              status?: string
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
  createEmployee: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          person_id?: number | null
          /** @enum {string} */
          document_type: 'DNI' | 'CE' | 'PASSPORT'
          /** @description Must not be greater than 50 characters. */
          document_number: string
          /** @description Must not be greater than 100 characters. */
          first_name: string
          /** @description Must not be greater than 100 characters. */
          last_name: string
          /** @description Must be a valid email address. Must not be greater than 150 characters. */
          email?: string | null
          /** @description Must not be greater than 20 characters. */
          phone?: string | null
          /** @description Must not be greater than 80 characters. */
          position: string
          /** @description Must be at least 1. */
          agency_id: number
          /** @description Must be a valid date. */
          hired_at: string
          /** @description Must be a valid date. Must be a date after or equal to <code>hired_at</code>. */
          terminated_at?: string | null
          /** @enum {string|null} */
          status?: 'active' | 'on_leave' | 'terminated' | null
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
              person_id?: string | null
              document_type?: string
              document_number?: string
              first_name?: string
              last_name?: string
              full_name?: string
              email?: string
              phone?: string
              position?: string
              agency_id?: number
              hired_at?: string
              terminated_at?: string | null
              status?: string
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  requestEmployeeDetails: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the employee. */
        employee_id: number
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
              person_id?: string | null
              document_type?: string
              document_number?: string
              first_name?: string
              last_name?: string
              full_name?: string
              email?: string
              phone?: string
              position?: string
              agency_id?: number
              hired_at?: string
              terminated_at?: string | null
              status?: string
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  modifyEmployee: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the employee. */
        employee_id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          person_id?: number | null
          /** @enum {string} */
          document_type: 'DNI' | 'CE' | 'PASSPORT'
          /** @description Must not be greater than 50 characters. */
          document_number: string
          /** @description Must not be greater than 100 characters. */
          first_name: string
          /** @description Must not be greater than 100 characters. */
          last_name: string
          /** @description Must be a valid email address. Must not be greater than 150 characters. */
          email?: string | null
          /** @description Must not be greater than 20 characters. */
          phone?: string | null
          /** @description Must not be greater than 80 characters. */
          position: string
          /** @description Must be at least 1. */
          agency_id: number
          /** @description Must be a valid date. */
          hired_at: string
          /** @description Must be a valid date. Must be a date after or equal to <code>hired_at</code>. */
          terminated_at?: string | null
          /** @enum {string|null} */
          status?: 'active' | 'on_leave' | 'terminated' | null
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
              person_id?: string | null
              document_type?: string
              document_number?: string
              first_name?: string
              last_name?: string
              full_name?: string
              email?: string
              phone?: string
              position?: string
              agency_id?: number
              hired_at?: string
              terminated_at?: string | null
              status?: string
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  deactivateEmployee: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the employee. */
        employee_id: number
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
  listUsers: {
    parameters: {
      query?: {
        /** @description active,suspended,inactive. */
        status?: string
        /** @description Busca por nombre o email. */
        q?: string
        /** @description Usuarios con esa agencia en su ámbito. */
        agency_id?: number
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
              name?: string
              email?: string
              status?: string
              employee_id?: string | null
              must_change_password?: boolean
              failed_login_attempts?: number
              locked_until?: string | null
              last_login_at?: string | null
              roles?: unknown[]
              agencies?: unknown[]
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
  createUser: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 150 characters. */
          name: string
          /** @description Must be a valid email address. Must not be greater than 150 characters. */
          email: string
          password: string
          /** @description The <code>id</code> of an existing record in the employees table. */
          employee_id?: number | null
          must_change_password?: boolean
          /** @description The <code>name</code> of an existing record in the roles table. */
          roles?: string[]
          /** @description The <code>id</code> of an existing record in the agencies table. */
          agency_ids?: number[]
          primary_agency_id?: number | null
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
              email?: string
              status?: string
              employee_id?: string | null
              must_change_password?: boolean
              failed_login_attempts?: number
              locked_until?: string | null
              last_login_at?: string | null
              roles?: unknown[]
              agencies?: unknown[]
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  requestUserDetails: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
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
              email?: string
              status?: string
              employee_id?: string | null
              must_change_password?: boolean
              failed_login_attempts?: number
              locked_until?: string | null
              last_login_at?: string | null
              roles?: unknown[]
              agencies?: unknown[]
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  modifyUser: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
      }
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must not be greater than 150 characters. */
          name?: string
          /** @description Must be a valid email address. Must not be greater than 150 characters. */
          email?: string
          /** @description The <code>id</code> of an existing record in the employees table. */
          employee_id?: number | null
          must_change_password?: boolean
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
              email?: string
              status?: string
              employee_id?: string | null
              must_change_password?: boolean
              failed_login_attempts?: number
              locked_until?: string | null
              last_login_at?: string | null
              roles?: unknown[]
              agencies?: unknown[]
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  suspendUser: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
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
  changeUserStatus: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          status: 'active' | 'suspended' | 'inactive'
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
              email?: string
              status?: string
              employee_id?: string | null
              must_change_password?: boolean
              failed_login_attempts?: number
              locked_until?: string | null
              last_login_at?: string | null
              roles?: unknown[]
              agencies?: unknown[]
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  unlockUser: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
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
  assignAgencyScope: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the user. */
        user_id: number
      }
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description The <code>id</code> of an existing record in the agencies table. */
          agency_ids?: number[]
          primary_agency_id?: number | null
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
              email?: string
              status?: string
              employee_id?: string | null
              must_change_password?: boolean
              failed_login_attempts?: number
              locked_until?: string | null
              last_login_at?: string | null
              roles?: unknown[]
              agencies?: unknown[]
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  listAgencyCoverages: {
    parameters: {
      query?: {
        /** @description Filter by agency. */
        agency_id?: number
        /** @description Filter by location. */
        location_id?: number
        /** @description Page to return. */
        page?: number
        /** @description Rows per page (1..100, default 15). */
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
              id?: string | null
              agency_id?: string | null
              location_id?: string | null
              allows_pickup?: boolean
              allows_delivery?: boolean
              delivery_surcharge?: string
              is_active?: boolean
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
  createAgencyCoverage: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          agency_id: number
          /** @description The <code>id</code> of an existing record in the locations table. */
          location_id: number
          allows_pickup?: boolean
          allows_delivery?: boolean
          /** @description Must be at least 0. */
          delivery_surcharge?: number | null
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
              id?: string | null
              agency_id?: string | null
              location_id?: string | null
              allows_pickup?: boolean
              allows_delivery?: boolean
              delivery_surcharge?: string
              is_active?: boolean
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  updateAgencyCoverage: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the coverage. */
        coverage_id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          agency_id: number
          /** @description The <code>id</code> of an existing record in the locations table. */
          location_id: number
          allows_pickup?: boolean
          allows_delivery?: boolean
          /** @description Must be at least 0. */
          delivery_surcharge?: number | null
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
              id?: string | null
              agency_id?: string | null
              location_id?: string | null
              allows_pickup?: boolean
              allows_delivery?: boolean
              delivery_surcharge?: string
              is_active?: boolean
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  listLocations: {
    parameters: {
      query?: {
        /** @description Search by ubigeo, district, province or department. */
        q?: string
        /** @description Filter by zone. */
        zone_id?: number
        /** @description Filter by department. */
        department?: string
        /** @description Filter by active flag. */
        is_active?: boolean
        /** @description Page to return. */
        page?: number
        /** @description Rows per page (1..200, default 50). */
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
              id?: string | null
              ubigeo?: string | null
              department?: string | null
              province?: string | null
              district?: string | null
              zone_id?: string | null
              is_active?: boolean
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
  createLocation: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must be 6 characters. */
          ubigeo: string
          /** @description Must not be greater than 100 characters. */
          department: string
          /** @description Must not be greater than 100 characters. */
          province: string
          /** @description Must not be greater than 150 characters. */
          district: string
          /** @description The <code>id</code> of an existing record in the zones table. */
          zone_id: number
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
              id?: string | null
              ubigeo?: string | null
              department?: string | null
              province?: string | null
              district?: string | null
              zone_id?: string | null
              is_active?: boolean
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  updateLocation: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the location. */
        id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must be 6 characters. */
          ubigeo: string
          /** @description Must not be greater than 100 characters. */
          department: string
          /** @description Must not be greater than 100 characters. */
          province: string
          /** @description Must not be greater than 150 characters. */
          district: string
          /** @description The <code>id</code> of an existing record in the zones table. */
          zone_id: number
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
              id?: string | null
              ubigeo?: string | null
              department?: string | null
              province?: string | null
              district?: string | null
              zone_id?: string | null
              is_active?: boolean
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
              version?: string | null
              service_type?: string | null
              payment_responsibility?: string | null
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string | null
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: string | null
              delivery_attempts?: string | null
              confirmed_at?: string | null
              cancelled_at?: string | null
              delivered_at?: string | null
              cancelled_reason?: string | null
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
          /** @description standard,express. */
          service_type?: string | null
          /** @description sender,receiver. */
          payment_responsibility?: string | null
          /** @description agency_pickup,home_delivery. */
          delivery_type?: string | null
          /** @description when delivery_type=home_delivery. */
          delivery_location_id: number | null
          /** @description Delivery address. */
          recipient_address?: string | null
          /** @description Delivery window (ISO 8601). */
          delivery_scheduled_at?: string | null
          requires_signature?: boolean
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
              version?: string | null
              service_type?: string | null
              payment_responsibility?: string | null
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string | null
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: string | null
              delivery_attempts?: string | null
              confirmed_at?: string | null
              cancelled_at?: string | null
              delivered_at?: string | null
              cancelled_reason?: string | null
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
  showLogisticsOrderByTicketCode: {
    parameters: {
      query?: never
      header?: never
      path: {
        ticketCode: string
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
              ticket_number?: string
              ticket_code?: string
              status?: string
              version?: string | null
              service_type?: string | null
              payment_responsibility?: string | null
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string | null
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: string | null
              delivery_attempts?: string | null
              confirmed_at?: string | null
              cancelled_at?: string | null
              delivered_at?: string | null
              cancelled_reason?: string | null
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
  showLogisticsOrder: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The order. */
        order: string
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
              ticket_number?: string
              ticket_code?: string
              status?: string
              version?: string | null
              service_type?: string | null
              payment_responsibility?: string | null
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string | null
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: string | null
              delivery_attempts?: string | null
              confirmed_at?: string | null
              cancelled_at?: string | null
              delivered_at?: string | null
              cancelled_reason?: string | null
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
  quoteLogisticsOrder: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          origin_agency_id: number
          destination_agency_id: number
          weight_kg: number
          volume_m3?: number | null
          /** @description standard,express. */
          service_type?: string | null
          /** @description agency_pickup,home_delivery. */
          delivery_type?: string | null
          /** @description when delivery_type=home_delivery. */
          delivery_location_id: number | null
        }
      }
    }
    responses: {
      /** @description Cotizacion con tarifario */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              engine?: string
              chargeable_weight_kg?: number
              base_price?: number
              weight_amount?: number
              minimum_adjustment?: number
              surcharge?: number
              total_amount?: number
              tariff_code?: string
              breakdown?: {
                engine?: string
                total_amount?: number
              }
            }
          }
        }
      }
    }
  }
  confirmLogisticsOrder: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The order. */
        order: string
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
              ticket_number?: string
              ticket_code?: string
              status?: string
              version?: string | null
              service_type?: string | null
              payment_responsibility?: string | null
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string | null
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: string | null
              delivery_attempts?: string | null
              confirmed_at?: string | null
              cancelled_at?: string | null
              delivered_at?: string | null
              cancelled_reason?: string | null
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
  cancelLogisticsOrder: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The order. */
        order: string
      }
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Cancellation reason. */
          reason?: string | null
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
              ticket_number?: string
              ticket_code?: string
              status?: string
              version?: string | null
              service_type?: string | null
              payment_responsibility?: string | null
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string | null
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: string | null
              delivery_attempts?: string | null
              confirmed_at?: string | null
              cancelled_at?: string | null
              delivered_at?: string | null
              cancelled_reason?: string | null
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
  updateLogisticsOrderDelivery: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The order. */
        order: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          delivery_type: 'agency_pickup' | 'home_delivery'
          /** @description This field is required when <code>delivery_type</code> is <code>home_delivery</code>. */
          delivery_location_id?: number | null
          /** @description This field is required when <code>delivery_type</code> is <code>home_delivery</code>. Must not be greater than 255 characters. */
          recipient_address?: string | null
          /** @description Must be a valid date. */
          delivery_scheduled_at?: string | null
          requires_signature?: boolean
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
              ticket_number?: string
              ticket_code?: string
              status?: string
              version?: string | null
              service_type?: string | null
              payment_responsibility?: string | null
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string | null
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: string | null
              delivery_attempts?: string | null
              confirmed_at?: string | null
              cancelled_at?: string | null
              delivered_at?: string | null
              cancelled_reason?: string | null
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
  listTariffs: {
    parameters: {
      query?: {
        /** @description Search by code or name. */
        q?: string
        /** @description standard|express. */
        service_type?: string
        /** @description national|zone_pair|district_pair. */
        scope_type?: string
        /** @description Filter by active flag. */
        is_active?: boolean
        /** @description Page to return. */
        page?: number
        /** @description Rows per page (1..100, default 15). */
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
              id?: string | null
              code?: string
              name?: string
              service_type?: string
              scope_type?: string
              origin_zone_id?: string | null
              destination_zone_id?: string | null
              origin_location_id?: string | null
              destination_location_id?: string | null
              base_price?: string
              price_per_kg?: string
              price_per_m3?: string
              min_charge?: string
              max_weight_kg?: string
              volumetric_factor?: number
              priority?: number
              valid_from?: string
              valid_to?: string | null
              is_active?: boolean
              created_at?: string | null
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
  createTariff: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 30 characters. */
          code: string
          /** @description Must not be greater than 150 characters. */
          name: string
          /** @enum {string} */
          service_type: 'standard' | 'express'
          /** @enum {string} */
          scope_type: 'national' | 'zone_pair' | 'district_pair'
          /** @description The <code>id</code> of an existing record in the zones table. */
          origin_zone_id?: number | null
          /** @description The <code>id</code> of an existing record in the zones table. */
          destination_zone_id?: number | null
          /** @description The <code>id</code> of an existing record in the locations table. */
          origin_location_id?: number | null
          /** @description The <code>id</code> of an existing record in the locations table. */
          destination_location_id?: number | null
          /** @description Must be at least 0. */
          base_price: number
          /** @description Must be at least 0. */
          price_per_kg: number
          /** @description Must be at least 0. */
          price_per_m3?: number | null
          /** @description Must be at least 0. */
          min_charge: number
          max_weight_kg: number
          /** @description Must be at least 0. */
          volumetric_factor?: number | null
          priority?: number | null
          /** @description Must be a valid date. */
          valid_from: string
          /** @description Must be a valid date. */
          valid_to?: string | null
          is_active?: boolean
          brackets?: ({
            /** @description Must be at least 0. */
            from_kg: number
            /** @description Must be at least 0. */
            to_kg: number
            /** @description Must be at least 0. */
            fixed_fee: number
            /** @description Must be at least 0. */
            price_per_kg: number
          } | null)[]
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
              id?: string | null
              code?: string
              name?: string
              service_type?: string
              scope_type?: string
              origin_zone_id?: string | null
              destination_zone_id?: string | null
              origin_location_id?: string | null
              destination_location_id?: string | null
              base_price?: string
              price_per_kg?: string
              price_per_m3?: string
              min_charge?: string
              max_weight_kg?: string
              volumetric_factor?: number
              priority?: number
              valid_from?: string
              valid_to?: string | null
              is_active?: boolean
              created_at?: string | null
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  showTariff: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the tariff. */
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
              id?: string | null
              code?: string
              name?: string
              service_type?: string
              scope_type?: string
              origin_zone_id?: string | null
              destination_zone_id?: string | null
              origin_location_id?: string | null
              destination_location_id?: string | null
              base_price?: string
              price_per_kg?: string
              price_per_m3?: string
              min_charge?: string
              max_weight_kg?: string
              volumetric_factor?: number
              priority?: number
              valid_from?: string
              valid_to?: string | null
              is_active?: boolean
              created_at?: string | null
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  updateTariff: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the tariff. */
        id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 30 characters. */
          code: string
          /** @description Must not be greater than 150 characters. */
          name: string
          /** @enum {string} */
          service_type: 'standard' | 'express'
          /** @enum {string} */
          scope_type: 'national' | 'zone_pair' | 'district_pair'
          /** @description The <code>id</code> of an existing record in the zones table. */
          origin_zone_id?: number | null
          /** @description The <code>id</code> of an existing record in the zones table. */
          destination_zone_id?: number | null
          /** @description The <code>id</code> of an existing record in the locations table. */
          origin_location_id?: number | null
          /** @description The <code>id</code> of an existing record in the locations table. */
          destination_location_id?: number | null
          /** @description Must be at least 0. */
          base_price: number
          /** @description Must be at least 0. */
          price_per_kg: number
          /** @description Must be at least 0. */
          price_per_m3?: number | null
          /** @description Must be at least 0. */
          min_charge: number
          max_weight_kg: number
          /** @description Must be at least 0. */
          volumetric_factor?: number | null
          priority?: number | null
          /** @description Must be a valid date. */
          valid_from: string
          /** @description Must be a valid date. */
          valid_to?: string | null
          is_active?: boolean
          brackets?: ({
            /** @description Must be at least 0. */
            from_kg: number
            /** @description Must be at least 0. */
            to_kg: number
            /** @description Must be at least 0. */
            fixed_fee: number
            /** @description Must be at least 0. */
            price_per_kg: number
          } | null)[]
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
              id?: string | null
              code?: string
              name?: string
              service_type?: string
              scope_type?: string
              origin_zone_id?: string | null
              destination_zone_id?: string | null
              origin_location_id?: string | null
              destination_location_id?: string | null
              base_price?: string
              price_per_kg?: string
              price_per_m3?: string
              min_charge?: string
              max_weight_kg?: string
              volumetric_factor?: number
              priority?: number
              valid_from?: string
              valid_to?: string | null
              is_active?: boolean
              created_at?: string | null
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  deactivateTariff: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the tariff. */
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
              id?: string | null
              code?: string
              name?: string
              service_type?: string
              scope_type?: string
              origin_zone_id?: string | null
              destination_zone_id?: string | null
              origin_location_id?: string | null
              destination_location_id?: string | null
              base_price?: string
              price_per_kg?: string
              price_per_m3?: string
              min_charge?: string
              max_weight_kg?: string
              volumetric_factor?: number
              priority?: number
              valid_from?: string
              valid_to?: string | null
              is_active?: boolean
              created_at?: string | null
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  listZones: {
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
              id?: string | null
              code?: string
              name?: string
              is_active?: boolean
            }[]
            success?: string
            message?: string
          }
        }
      }
    }
  }
  createZone: {
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
          code: string
          /** @description Must not be greater than 100 characters. */
          name: string
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
              id?: string | null
              code?: string
              name?: string
              is_active?: boolean
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  updateZone: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The ID of the zone. */
        id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Must not be greater than 20 characters. */
          code: string
          /** @description Must not be greater than 100 characters. */
          name: string
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
              id?: string | null
              code?: string
              name?: string
              is_active?: boolean
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
              province?: string | null
              department?: string | null
              ubigeo?: string | null
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
          /** @description Must not be greater than 100 characters. */
          province?: string | null
          /** @description Must not be greater than 100 characters. */
          department?: string | null
          /** @description Must be 6 characters. */
          ubigeo?: string | null
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
              province?: string | null
              department?: string | null
              ubigeo?: string | null
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
              province?: string | null
              department?: string | null
              ubigeo?: string | null
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
          /** @description Must not be greater than 100 characters. */
          province?: string | null
          /** @description Must not be greater than 100 characters. */
          department?: string | null
          /** @description Must be 6 characters. */
          ubigeo?: string | null
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
              province?: string | null
              department?: string | null
              ubigeo?: string | null
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
