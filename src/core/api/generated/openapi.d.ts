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
  '/api/v1/finance/cash-closures': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List cash closures */
    get: operations['listCashClosures']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/cash-closures/{closure}/approve': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash closure id. */
        closure: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Approve a cash closure */
    post: operations['approveACashClosure']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/cash-closures/{closure}/reject': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash closure id. */
        closure: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Reject a cash closure */
    post: operations['rejectACashClosure']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/cash-closures/{closure}/report': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash closure id. */
        closure: number
      }
      cookie?: never
    }
    /** Download the cash closure report */
    get: operations['downloadTheCashClosureReport']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/cash-movements': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Register an expense or withdrawal
     * @description Income movements are generated only by cash payments.
     */
    post: operations['registerAnExpenseOrWithdrawal']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/cash-sessions/current': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Current open cash session
     * @description Returns `cash_session: null` when the authenticated cashier has no open session.
     */
    get: operations['currentOpenCashSession']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/cash-sessions': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List cash sessions */
    get: operations['listCashSessions']
    put?: never
    /**
     * Open a cash session
     * @description The agency is inferred from the authenticated cashier; it is not accepted from the client.
     */
    post: operations['openACashSession']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/cash-sessions/{session}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash session id. */
        session: number
      }
      cookie?: never
    }
    /** Show a cash session */
    get: operations['showACashSession']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/cash-sessions/{session}/close': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash session id. */
        session: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Close a cash session
     * @description A zero difference closes immediately. Any difference (tolerance 0.00) keeps the
     *     session open and returns a pending closure that a supervisor must approve.
     */
    post: operations['closeACashSession']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/credit-notes': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List credit notes */
    get: operations['listCreditNotes']
    put?: never
    /** Issue a credit note */
    post: operations['issueACreditNote']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/credit-notes/{creditNote}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Credit note id. */
        creditNote: number
      }
      cookie?: never
    }
    /** Show a credit note */
    get: operations['showACreditNote']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/credit-notes/{creditNote}/download/{type}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Credit note id. */
        creditNote: number
        /** @description `xml`, `pdf` or `cdr`. */
        type: string
      }
      cookie?: never
    }
    /** Download a credit note artifact */
    get: operations['downloadACreditNoteArtifact']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/invoices': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List invoices */
    get: operations['listInvoices']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/invoices/{invoice}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Invoice id. */
        invoice: number
      }
      cookie?: never
    }
    /** Show an invoice */
    get: operations['showAnInvoice']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/invoices/{invoice}/retry': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Invoice id. */
        invoice: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Retry SUNAT transmission */
    post: operations['retrySUNATTransmission']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/invoices/{invoice}/download/{type}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Invoice id. */
        invoice: number
        /** @description `xml`, `pdf` or `cdr`. */
        type: string
      }
      cookie?: never
    }
    /** Download an invoice artifact */
    get: operations['downloadAnInvoiceArtifact']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/invoice-series': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List invoice series */
    get: operations['listInvoiceSeries']
    put?: never
    /** Create an invoice series */
    post: operations['createAnInvoiceSeries']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/invoice-series/{series}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Invoice series id. */
        series: number
      }
      cookie?: never
    }
    get?: never
    /** Update an invoice series */
    put: operations['updateAnInvoiceSeries']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/orders/{order}/payment-status': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Order id. */
        order: number
      }
      cookie?: never
    }
    /** Payment status of an order */
    get: operations['paymentStatusOfAnOrder']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/payments': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List payments */
    get: operations['listPayments']
    put?: never
    /** Register a payment */
    post: operations['registerAPayment']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/payments/{payment}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Payment id. */
        payment: number
      }
      cookie?: never
    }
    /** Show a payment */
    get: operations['showAPayment']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/voids': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List void requests */
    get: operations['listVoidRequests']
    put?: never
    /** Request a void */
    post: operations['requestAVoid']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/voids/{void}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Void id. */
        void: number
      }
      cookie?: never
    }
    /** Show a void request */
    get: operations['showAVoidRequest']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/voids/{void}/approve': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Void id. */
        void: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Approve a void */
    post: operations['approveAVoid']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/finance/voids/{void}/reject': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Void id. */
        void: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Reject a void */
    post: operations['rejectAVoid']
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
     * @description Returns the orders visible to the authenticated user, newest first, paginated with `page` and `per_page` (max 100). All filters are cumulative and never widen the agency scope.
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
    /**
     * Update Logistics Order
     * @description Edits shipping and delivery data while the order is `pending` or `confirmed`. It cannot change sender, receiver, agencies, service or tariff. Weight, volume or delivery changes re-quote the order; identity changes after departure are rejected with `ORDER_NOT_EDITABLE`.
     */
    patch: operations['updateLogisticsOrder']
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
  '/api/v1/operations/deliveries': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List deliveries */
    get: operations['listDeliveries']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/deliveries/{delivery}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Delivery id. */
        delivery: number
      }
      cookie?: never
    }
    /** Show a delivery */
    get: operations['showADelivery']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/deliveries/assign': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Assign shipments for delivery */
    post: operations['assignShipmentsForDelivery']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/deliveries/{delivery}/start': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Delivery id. */
        delivery: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Start a delivery */
    post: operations['startADelivery']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/deliveries/{delivery}/complete': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Delivery id. */
        delivery: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Complete a delivery
     * @description Evidence is recorded as routes (`deliveries/...`); Fase 4 does not upload files.
     */
    post: operations['completeADelivery']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/deliveries/{delivery}/fail': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Delivery id. */
        delivery: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Fail a delivery */
    post: operations['failADelivery']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/embarks': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List embarks */
    get: operations['listEmbarks']
    put?: never
    /** Create an embark */
    post: operations['createAnEmbark']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/embarks/{embark}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Embark id. */
        embark: number
      }
      cookie?: never
    }
    /** Show an embark */
    get: operations['showAnEmbark']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/embarks/{embark}/disembark': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Embark id. */
        embark: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Disembark an embark */
    post: operations['disembarkAnEmbark']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/inventory-counts': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List inventory counts */
    get: operations['listInventoryCounts']
    put?: never
    /** Open an inventory count */
    post: operations['openAnInventoryCount']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/inventory-counts/{count}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Inventory count id. */
        count: number
      }
      cookie?: never
    }
    /** Show an inventory count */
    get: operations['showAnInventoryCount']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/inventory-counts/{count}/finish': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Inventory count id. */
        count: number
      }
      cookie?: never
    }
    get?: never
    put?: never
    /** Finish an inventory count */
    post: operations['finishAnInventoryCount']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/receptions': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List receptions */
    get: operations['listReceptions']
    put?: never
    /**
     * Receive shipments
     * @description Registers one or more parcels at their origin agency. A shipment already
     *     received with the same scan is reported as duplicated, not as an error.
     */
    post: operations['receiveShipments']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/shipments': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List shipments */
    get: operations['listShipments']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/shipments/{ticketCode}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description 8-char ticket code. */
        ticketCode: string
      }
      cookie?: never
    }
    /** Show a shipment */
    get: operations['showAShipment']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/agencies/{agency}/inventory': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Agency id. */
        agency: number
      }
      cookie?: never
    }
    /**
     * Agency inventory
     * @description Shipments physically at the agency and not yet delivered, returned or cancelled.
     */
    get: operations['agencyInventory']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/scans/sync': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Synchronize PDA scans
     * @description Accepts a batch of scans. Each item is processed independently and
     *     returned as accepted, duplicated or rejected.
     */
    post: operations['synchronizePDAScans']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/operations/tracking/{ticketCode}': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description 8-char ticket code. */
        ticketCode: string
      }
      cookie?: never
    }
    /** Look up a shipment timeline */
    get: operations['lookUpAShipmentTimeline']
    put?: never
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
              id?: number
              code?: string
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
              created_at?: string
              updated_at?: string
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
              id?: number
              code?: string
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
              created_at?: string
              updated_at?: string
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
              id?: number
              code?: string
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
              created_at?: string
              updated_at?: string
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
              id?: number
              code?: string
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
              created_at?: string
              updated_at?: string
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
              id?: number
              code?: string
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
              created_at?: string
              updated_at?: string
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
  listCashClosures: {
    parameters: {
      query?: {
        /** @description `pending`, `approved` or `rejected`. */
        status?: string
        /** @description Filter by agency. */
        agency?: number
        /** @description Rows per page (1..100). */
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
              cash_session_id?: number
              status?: string
              expected_amount?: string
              closing_amount?: string
              difference?: string
              requested_by?: number
              approved_by?: number
              requested_at?: string
              approved_at?: string
              rejected_at?: string | null
              rejection_reason?: string | null
              created_at?: string
              report_url?: string | null
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
  approveACashClosure: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash closure id. */
        closure: number
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
              cash_session_id?: number
              status?: string
              expected_amount?: string
              closing_amount?: string
              difference?: string
              requested_by?: number
              approved_by?: number
              requested_at?: string
              approved_at?: string
              rejected_at?: string | null
              rejection_reason?: string | null
              created_at?: string
              report_url?: string | null
            }
          }
        }
      }
    }
  }
  rejectACashClosure: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash closure id. */
        closure: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Why the closure is rejected. */
          reason: string
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
              cash_session_id?: number
              status?: string
              expected_amount?: string
              closing_amount?: string
              difference?: string
              requested_by?: number
              approved_by?: number
              requested_at?: string
              approved_at?: string
              rejected_at?: string | null
              rejection_reason?: string | null
              created_at?: string
              report_url?: string | null
            }
          }
        }
      }
    }
  }
  downloadTheCashClosureReport: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash closure id. */
        closure: number
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
            data?: {
              error_code?: string
            }
          }
        }
      }
    }
  }
  registerAnExpenseOrWithdrawal: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description `expense` or `withdrawal`. */
          type: string
          /** @description Movement amount. */
          amount: number
          /** @description Reason. */
          note: string
          /** @description optional External reference type. */
          reference_type?: string | null
          /** @description optional External reference id. */
          reference_id?: number | null
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
              cash_session_id?: number
              type?: string
              amount?: string
              signed_amount?: string
              reference_type?: string | null
              reference_id?: string | null
              note?: string
              created_by?: number
              created_at?: string
            }
          }
        }
      }
    }
  }
  currentOpenCashSession: {
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
          'application/json':
            | {
                success?: boolean
                message?: string
                data?: {
                  cash_session?: {
                    id?: number
                    agency_id?: number
                    cashier_id?: number
                    status?: string
                    opening_amount?: string
                    expected_amount?: string
                    closing_amount?: string | null
                    difference?: string | null
                    opened_at?: string
                    closed_at?: string | null
                    created_at?: string
                    updated_at?: string
                    movements?: unknown[]
                    closures?: unknown[]
                  }
                }
              }
            | {
                success?: boolean
                message?: string
                data?: {
                  cash_session?: string | null
                }
              }
        }
      }
    }
  }
  listCashSessions: {
    parameters: {
      query?: {
        /** @description `open` or `closed`. */
        status?: string
        /** @description Filter by cashier. */
        cashier_id?: number
        /** @description Filter by agency. */
        agency?: number
        /** @description date Filter from this date. */
        opened_from?: string
        /** @description date Filter up to this date. */
        opened_to?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @enum {string} */
          status?: 'open' | 'closed'
          /** @description Must be at least 1. */
          cashier_id?: number
          /** @description Must be at least 1. */
          agency?: number
          /** @description Must be a valid date. */
          opened_from?: string
          /** @description Must be a valid date. Must be a date after or equal to <code>opened_from</code>. */
          opened_to?: string
          /** @description Must be at least 1. Must not be greater than 100. */
          per_page?: number
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
              agency_id?: number
              cashier_id?: number
              status?: string
              opening_amount?: string
              expected_amount?: string
              closing_amount?: string | null
              difference?: string | null
              opened_at?: string
              closed_at?: string | null
              created_at?: string
              updated_at?: string
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
  openACashSession: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Opening cash. */
          opening_amount: number
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
              agency_id?: number
              cashier_id?: number
              status?: string
              opening_amount?: string
              expected_amount?: string
              closing_amount?: string | null
              difference?: string | null
              opened_at?: string
              closed_at?: string | null
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  showACashSession: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash session id. */
        session: number
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
              agency_id?: number
              cashier_id?: number
              status?: string
              opening_amount?: string
              expected_amount?: string
              closing_amount?: string | null
              difference?: string | null
              opened_at?: string
              closed_at?: string | null
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  closeACashSession: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Cash session id. */
        session: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Counted cash. */
          closing_amount: number
          /** @description optional Cash count detail. */
          count?: {
            /** @description This field is required when <code>count</code> is present. Must be at least 0. */
            denomination?: number
            /** @description This field is required when <code>count</code> is present. Must be at least 0. */
            quantity?: number
          }[]
        }
      }
    }
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json':
            | {
                success?: boolean
                message?: string
                data?: {
                  cash_session?: {
                    id?: number
                    agency_id?: number
                    cashier_id?: number
                    status?: string
                    opening_amount?: string
                    expected_amount?: string
                    closing_amount?: string
                    difference?: string
                    opened_at?: string
                    closed_at?: string
                    created_at?: string
                    updated_at?: string
                    movements?: unknown[]
                    closures?: unknown[]
                  }
                  closure?: {
                    id?: number
                    cash_session_id?: number
                    status?: string
                    expected_amount?: string
                    closing_amount?: string
                    difference?: string
                    requested_by?: number
                    approved_by?: string | null
                    requested_at?: string
                    approved_at?: string
                    rejected_at?: string | null
                    rejection_reason?: string | null
                    created_at?: string
                    report_url?: string | null
                  }
                  requires_approval?: boolean
                }
              }
            | {
                success?: boolean
                message?: string
                data?: {
                  cash_session?: {
                    id?: number
                    agency_id?: number
                    cashier_id?: number
                    status?: string
                    opening_amount?: string
                    expected_amount?: string
                    closing_amount?: string
                    difference?: string
                    opened_at?: string
                    closed_at?: string | null
                    created_at?: string
                    updated_at?: string
                    movements?: unknown[]
                    closures?: unknown[]
                  }
                  closure?: {
                    id?: number
                    cash_session_id?: number
                    status?: string
                    expected_amount?: string
                    closing_amount?: string
                    difference?: string
                    requested_by?: number
                    approved_by?: string | null
                    requested_at?: string
                    approved_at?: string | null
                    rejected_at?: string | null
                    rejection_reason?: string | null
                    created_at?: string
                    report_url?: string | null
                  }
                  requires_approval?: boolean
                }
              }
        }
      }
    }
  }
  listCreditNotes: {
    parameters: {
      query?: {
        /** @description One status or a comma-separated list. */
        status?: string
        /** @description Filter by payment. */
        payment_id?: number
        /** @description Filter by order. */
        order_id?: number
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must not be greater than 120 characters. */
          status?: string
          /** @description Must be at least 1. */
          payment_id?: number
          /** @description Must be at least 1. */
          order_id?: number
          /** @description Must be at least 1. Must not be greater than 100. */
          per_page?: number
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
              order_id?: number
              payment_id?: number
              invoice_id?: number
              agency_id?: number
              cash_session_id?: number
              amount?: string
              currency?: string
              reason?: string
              note?: string
              status?: string
              sunat_code?: string
              sunat_message?: string
              created_by?: number
              issued_at?: string
              created_at?: string
              downloads?: {
                xml?: string | null
                pdf?: string | null
                cdr?: string | null
              }
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
  issueACreditNote: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Payment to credit. */
          payment_id: number
          /** @description Credit amount. */
          amount: number
          /** @description SUNAT reason code (`01`, `02`, `03`, `06`, `07`). */
          reason: string
          /** @description optional Detail. */
          note?: string | null
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
              order_id?: number
              payment_id?: number
              invoice_id?: number
              agency_id?: number
              cash_session_id?: number
              amount?: string
              currency?: string
              reason?: string
              note?: string
              status?: string
              sunat_code?: string
              sunat_message?: string
              created_by?: number
              issued_at?: string
              created_at?: string
              downloads?: {
                xml?: string | null
                pdf?: string | null
                cdr?: string | null
              }
            }
          }
        }
      }
    }
  }
  showACreditNote: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Credit note id. */
        creditNote: number
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
              order_id?: number
              payment_id?: number
              invoice_id?: number
              agency_id?: number
              cash_session_id?: number
              amount?: string
              currency?: string
              reason?: string
              note?: string
              status?: string
              sunat_code?: string
              sunat_message?: string
              created_by?: number
              issued_at?: string
              created_at?: string
              downloads?: {
                xml?: string | null
                pdf?: string | null
                cdr?: string | null
              }
            }
          }
        }
      }
    }
  }
  downloadACreditNoteArtifact: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Credit note id. */
        creditNote: number
        /** @description `xml`, `pdf` or `cdr`. */
        type: string
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
            data?: {
              error_code?: string
            }
          }
        }
      }
    }
  }
  listInvoices: {
    parameters: {
      query?: {
        /** @description One status or a comma-separated list. */
        status?: string
        /** @description `boleta` or `factura`. */
        document_type?: string
        /** @description Filter by order. */
        order_id?: number
        /** @description Ticket number prefix. */
        ticket_number?: string
        /** @description Filter by agency. */
        agency?: number
        /** @description date Filter from this date. */
        issued_from?: string
        /** @description date Filter up to this date. */
        issued_to?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must not be greater than 120 characters. */
          status?: string
          /** @enum {string} */
          document_type?: 'boleta' | 'factura'
          /** @description Must be at least 1. */
          order_id?: number
          /** @description Must not be greater than 30 characters. */
          ticket_number?: string
          /** @description Must be at least 1. */
          agency?: number
          /** @description Must be a valid date. */
          issued_from?: string
          /** @description Must be a valid date. Must be a date after or equal to <code>issued_from</code>. */
          issued_to?: string
          /** @description Must be at least 1. Must not be greater than 100. */
          per_page?: number
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
              order_id?: number
              payment_id?: number
              agency_id?: number
              invoice_series_id?: number
              document_type?: string
              series?: string
              number?: number
              customer_document_type?: string
              customer_document_number?: string
              customer_name?: string
              taxable_amount?: string
              igv?: string
              total?: string
              currency?: string
              status?: string
              sunat_code?: string
              sunat_message?: string
              issued_at?: string
              accepted_at?: string
              created_at?: string
              updated_at?: string
              downloads?: {
                xml?: string | null
                pdf?: string | null
                cdr?: string | null
              }
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
  showAnInvoice: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Invoice id. */
        invoice: number
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
              order_id?: number
              payment_id?: number
              agency_id?: number
              invoice_series_id?: number
              document_type?: string
              series?: string
              number?: number
              customer_document_type?: string
              customer_document_number?: string
              customer_name?: string
              taxable_amount?: string
              igv?: string
              total?: string
              currency?: string
              status?: string
              sunat_code?: string
              sunat_message?: string
              issued_at?: string
              accepted_at?: string
              created_at?: string
              updated_at?: string
              downloads?: {
                xml?: string | null
                pdf?: string | null
                cdr?: string | null
              }
            }
          }
        }
      }
    }
  }
  retrySUNATTransmission: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Invoice id. */
        invoice: number
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
              order_id?: number
              payment_id?: number
              agency_id?: number
              invoice_series_id?: number
              document_type?: string
              series?: string
              number?: number
              customer_document_type?: string
              customer_document_number?: string
              customer_name?: string
              taxable_amount?: string
              igv?: string
              total?: string
              currency?: string
              status?: string
              sunat_code?: string
              sunat_message?: string
              issued_at?: string
              accepted_at?: string
              created_at?: string
              updated_at?: string
              downloads?: {
                xml?: string | null
                pdf?: string | null
                cdr?: string | null
              }
            }
          }
        }
      }
    }
  }
  downloadAnInvoiceArtifact: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Invoice id. */
        invoice: number
        /** @description `xml`, `pdf` or `cdr`. */
        type: string
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
            data?: {
              error_code?: string
            }
          }
        }
      }
    }
  }
  listInvoiceSeries: {
    parameters: {
      query?: {
        /** @description Filter by agency. */
        agency?: number
        /** @description `boleta` or `factura`. */
        document_type?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          agency_id?: number
          /** @enum {string} */
          document_type?: 'boleta' | 'factura'
          /** @description Must match the regex /^[A-Z0-9]{4}$/. Must be 4 characters. */
          series?: string
          /** @description Must be 11 digits. */
          issuer_ruc?: string
          /** @description Must not be greater than 200 characters. */
          issuer_name?: string
          /** @description Must not be greater than 200 characters. */
          issuer_trade_name?: string | null
          /** @description Must not be greater than 255 characters. */
          issuer_address?: string | null
          /** @description Must be 6 digits. */
          issuer_ubigeo?: string | null
          /** @description Must be 4 characters. */
          establishment_code?: string | null
          is_active?: boolean
          is_default?: boolean
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
              agency_id?: number
              document_type?: string
              series?: string
              next_number?: number
              is_active?: boolean
              is_default?: boolean
              issuer_ruc?: string
              issuer_name?: string
              issuer_trade_name?: string
              issuer_address?: string
              issuer_ubigeo?: string
              establishment_code?: string
              created_at?: string
              updated_at?: string
            }[]
            success?: string
            message?: string
          }
        }
      }
    }
  }
  createAnInvoiceSeries: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Agency that issues. */
          agency_id: number
          /** @description `boleta` or `factura`. */
          document_type: string
          /** @description Four alphanumeric characters. */
          series: string
          /** @description Issuer RUC (11 digits). */
          issuer_ruc: string
          /** @description Legal name. */
          issuer_name: string
          /** @description optional Trade name. */
          issuer_trade_name?: string | null
          /** @description optional Fiscal address. */
          issuer_address?: string | null
          /** @description optional Six-digit ubigeo. */
          issuer_ubigeo?: string | null
          /** @description optional SUNAT establishment code. */
          establishment_code?: string | null
          /** @description optional Defaults to true. */
          is_active?: boolean
          /** @description optional Defaults to false. */
          is_default?: boolean
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
              agency_id?: number
              document_type?: string
              series?: string
              next_number?: number
              is_active?: boolean
              is_default?: boolean
              issuer_ruc?: string
              issuer_name?: string
              issuer_trade_name?: string
              issuer_address?: string
              issuer_ubigeo?: string
              establishment_code?: string
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  updateAnInvoiceSeries: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Invoice series id. */
        series: number
      }
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          agency_id?: number
          /** @enum {string} */
          document_type?: 'boleta' | 'factura'
          /** @description Must match the regex /^[A-Z0-9]{4}$/. Must be 4 characters. */
          series?: string
          /** @description Must be 11 digits. */
          issuer_ruc?: string
          /** @description Must not be greater than 200 characters. */
          issuer_name?: string
          /** @description Must not be greater than 200 characters. */
          issuer_trade_name?: string | null
          /** @description Must not be greater than 255 characters. */
          issuer_address?: string | null
          /** @description Must be 6 digits. */
          issuer_ubigeo?: string | null
          /** @description Must be 4 characters. */
          establishment_code?: string | null
          is_active?: boolean
          is_default?: boolean
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
              agency_id?: number
              document_type?: string
              series?: string
              next_number?: number
              is_active?: boolean
              is_default?: boolean
              issuer_ruc?: string
              issuer_name?: string
              issuer_trade_name?: string
              issuer_address?: string
              issuer_ubigeo?: string
              establishment_code?: string
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  paymentStatusOfAnOrder: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Order id. */
        order: number
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
            data?: {
              error_code?: string
            }
          }
        }
      }
    }
  }
  listPayments: {
    parameters: {
      query?: {
        /** @description Filter by order. */
        order_id?: number
        /** @description One status or a comma-separated list. */
        status?: string
        /** @description `cash` or `pos`. */
        payment_method?: string
        /** @description Filter by agency. */
        agency?: number
        /** @description Ticket number prefix. */
        ticket_number?: string
        /** @description date Filter from this date. */
        created_from?: string
        /** @description date Filter up to this date. */
        created_to?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          order_id?: number
          /** @description Must not be greater than 120 characters. */
          status?: string
          /** @description Must not be greater than 20 characters. */
          payment_method?: string
          /** @description Must be at least 1. */
          agency?: number
          /** @description Must not be greater than 30 characters. */
          ticket_number?: string
          /** @description Must be a valid date. */
          created_from?: string
          /** @description Must be a valid date. Must be a date after or equal to <code>created_from</code>. */
          created_to?: string
          /** @description Must be at least 1. Must not be greater than 100. */
          per_page?: number
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
              order_id?: number
              cash_session_id?: number
              agency_id?: number
              amount?: string
              currency?: string
              payment_method?: string
              reference?: string | null
              document_type?: string
              status?: string
              created_by?: number
              paid_at?: string
              created_at?: string
              updated_at?: string
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
  registerAPayment: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Order to charge. */
          order_id: number
          /** @description Payment amount (partial payments allowed). */
          amount: number
          /** @description optional ISO currency. */
          currency?: string
          /** @description `cash` or `pos`. */
          payment_method: string
          /** @description optional `boleta` or `factura`. */
          document_type?: string | null
          /** @description Client idempotency key. */
          idempotency_key: string
          /** @description optional Free-text reference (POS operation, voucher). */
          reference?: string | null
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
              order_id?: number
              cash_session_id?: number
              agency_id?: number
              amount?: string
              currency?: string
              payment_method?: string
              reference?: string | null
              document_type?: string
              status?: string
              created_by?: number
              paid_at?: string
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  showAPayment: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Payment id. */
        payment: number
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
              order_id?: number
              cash_session_id?: number
              agency_id?: number
              amount?: string
              currency?: string
              payment_method?: string
              reference?: string | null
              document_type?: string
              status?: string
              created_by?: number
              paid_at?: string
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  listVoidRequests: {
    parameters: {
      query?: {
        /** @description `requested`, `approved` or `rejected`. */
        status?: string
        /** @description Filter by payment. */
        payment_id?: number
        /** @description Filter by order. */
        order_id?: number
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @enum {string} */
          status?: 'requested' | 'approved' | 'rejected'
          /** @description Must be at least 1. */
          payment_id?: number
          /** @description Must be at least 1. */
          order_id?: number
          /** @description Must be at least 1. Must not be greater than 100. */
          per_page?: number
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
              order_id?: number
              payment_id?: number
              invoice_id?: number
              reason?: string
              status?: string
              requested_by?: number
              approved_by?: string | null
              requested_at?: string
              approved_at?: string | null
              rejected_at?: string | null
              rejection_reason?: string | null
              created_at?: string
              updated_at?: string
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
  requestAVoid: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Payment to void. */
          payment_id: number
          /** @description Why the payment is voided. */
          reason: string
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
              order_id?: number
              payment_id?: number
              invoice_id?: number
              reason?: string
              status?: string
              requested_by?: number
              approved_by?: string | null
              requested_at?: string
              approved_at?: string | null
              rejected_at?: string | null
              rejection_reason?: string | null
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  showAVoidRequest: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Void id. */
        void: number
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
              order_id?: number
              payment_id?: number
              invoice_id?: number
              reason?: string
              status?: string
              requested_by?: number
              approved_by?: string | null
              requested_at?: string
              approved_at?: string | null
              rejected_at?: string | null
              rejection_reason?: string | null
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  approveAVoid: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Void id. */
        void: number
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
              order_id?: number
              payment_id?: number
              invoice_id?: number
              reason?: string
              status?: string
              requested_by?: number
              approved_by?: string | null
              requested_at?: string
              approved_at?: string | null
              rejected_at?: string | null
              rejection_reason?: string | null
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  rejectAVoid: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Void id. */
        void: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Why the void is rejected. */
          reason: string
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
              order_id?: number
              payment_id?: number
              invoice_id?: number
              reason?: string
              status?: string
              requested_by?: number
              approved_by?: string | null
              requested_at?: string
              approved_at?: string | null
              rejected_at?: string | null
              rejection_reason?: string | null
              created_at?: string
              updated_at?: string
            }
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
              id?: number
              agency_id?: number
              location_id?: number
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
              id?: number
              agency_id?: number
              location_id?: number
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
              id?: number
              agency_id?: number
              location_id?: number
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
              id?: number
              ubigeo?: string
              department?: string
              province?: string
              district?: string
              zone_id?: number
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
              id?: number
              ubigeo?: string
              department?: string
              province?: string
              district?: string
              zone_id?: number
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
              id?: number
              ubigeo?: string
              department?: string
              province?: string
              district?: string
              zone_id?: number
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
        /** @description One status or a comma-separated list (`pending,confirmed`). */
        status?: string
        /** @description Filter by origin agency. */
        origin_agency_id?: number
        /** @description Filter by destination agency. */
        destination_agency_id?: number
        /** @description Filter orders that touch this agency (origin or destination). */
        agency?: number
        /** @description date Filter orders created on or after this date (ISO 8601). */
        created_from?: string
        /** @description date Filter orders created on or before this date (ISO 8601). */
        created_to?: string
        /** @description Filter by sender customer id. */
        sender_id?: number
        /** @description Filter by receiver customer id. */
        receiver_id?: number
        /** @description Filter by sender document number. */
        sender_document?: string
        /** @description Sender document type (`DNI`, `RUC`, `CE`, `PASSPORT`). */
        sender_document_type?: string
        /** @description Filter by receiver document number. */
        receiver_document?: string
        /** @description Receiver document type (`DNI`, `RUC`, `CE`, `PASSPORT`). */
        receiver_document_type?: string
        /** @description Exact 8-char ticket code. */
        ticket_code?: string
        /** @description Exact or prefix ticket number. */
        ticket_number?: string
        /** @description Exact ticket code or ticket number prefix (shortcut). */
        ticket?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          status?: string
          /** @description Must be at least 1. */
          origin_agency_id?: number
          /** @description Must be at least 1. */
          destination_agency_id?: number
          /** @description Must be at least 1. */
          agency?: number
          /** @description Must be a valid date. */
          created_from?: string
          /** @description Must be a valid date. Must be a date after or equal to <code>created_from</code>. */
          created_to?: string
          /** @description Must be at least 1. */
          sender_id?: number
          /** @description Must be at least 1. */
          receiver_id?: number
          /** @description Must not be greater than 20 characters. */
          sender_document?: string
          /** @enum {string} */
          sender_document_type?: 'DNI' | 'RUC' | 'CE' | 'PASSPORT'
          /** @description Must not be greater than 20 characters. */
          receiver_document?: string
          /** @enum {string} */
          receiver_document_type?: 'DNI' | 'RUC' | 'CE' | 'PASSPORT'
          /** @description Must not be greater than 8 characters. */
          ticket_code?: string
          /** @description Must not be greater than 20 characters. */
          ticket_number?: string
          /** @description Must not be greater than 20 characters. */
          ticket?: string
          per_page?: number
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
              version?: number
              service_type?: string
              payment_responsibility?: string
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: boolean
              delivery_attempts?: number
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
              version?: number
              service_type?: string
              payment_responsibility?: string
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: boolean
              delivery_attempts?: number
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
              version?: number
              service_type?: string
              payment_responsibility?: string
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: boolean
              delivery_attempts?: number
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
              version?: number
              service_type?: string
              payment_responsibility?: string
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: boolean
              delivery_attempts?: number
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
  updateLogisticsOrder: {
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
          /** @description Order description. */
          description?: string | null
          /** @description Weight in kilograms. */
          weight_kg?: number
          /** @description Volume in cubic meters. */
          volume_m3?: number | null
          /** @description Declared value. */
          declared_value?: number | null
          /** @description agency_pickup,home_delivery. */
          delivery_type?: string
          /** @description when delivery_type=home_delivery. */
          delivery_location_id: number | null
          /** @description when delivery_type=home_delivery. */
          recipient_address: string | null
          /** @description Delivery date (ISO 8601). */
          delivery_scheduled_at?: Record<string, never> | null
          /** @description Whether the delivery requires a signature. */
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
              version?: number
              service_type?: string
              payment_responsibility?: string
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: boolean
              delivery_attempts?: number
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
              version?: number
              service_type?: string
              payment_responsibility?: string
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: boolean
              delivery_attempts?: number
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
              version?: number
              service_type?: string
              payment_responsibility?: string
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: boolean
              delivery_attempts?: number
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
              version?: number
              service_type?: string
              payment_responsibility?: string
              description?: string
              weight_kg?: string
              volume_m3?: string
              chargeable_weight_kg?: string | null
              declared_value?: string
              tariff_id?: string | null
              pricing_snapshot?: string | null
              total_amount?: string
              delivery_type?: string
              delivery_location_id?: string | null
              recipient_address?: string | null
              delivery_scheduled_at?: string | null
              requires_signature?: boolean
              delivery_attempts?: number
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
              id?: number
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
          origin_zone_id?: number | null
          destination_zone_id?: number | null
          origin_location_id?: number | null
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
              id?: number
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
              created_at?: string
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
              id?: number
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
              created_at?: string
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
          origin_zone_id?: number | null
          destination_zone_id?: number | null
          origin_location_id?: number | null
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
              id?: number
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
              created_at?: string
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
              id?: number
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
              created_at?: string
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
              id?: number
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
              id?: number
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
              id?: number
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
  listDeliveries: {
    parameters: {
      query?: {
        /** @description Page to return. */
        page?: number
        /** @description Filter by agency. */
        agency?: number
        /** @description One status or a comma-separated list. */
        status?: string
        /** @description Filter by courier. */
        courier_id?: number
        /** @description Exact 8-char ticket code. */
        ticket_code?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          agency?: number
          /** @description Must not be greater than 120 characters. */
          status?: string
          /** @description Must be at least 1. */
          courier_id?: number
          /** @description Must not be greater than 8 characters. */
          ticket_code?: string
          per_page?: number
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
              shipment_id?: number
              ticket_code?: string
              ticket_number?: string
              agency_id?: number
              courier_id?: number
              status?: string
              attempt?: number
              delivered_at?: string | null
              failure_reason?: string | null
              recipient_name?: string | null
              recipient_document?: string | null
              evidence?: {
                signature_path?: string
                photo_path?: string
                latitude?: string
                longitude?: string
                captured_at?: string
              }
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
  showADelivery: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Delivery id. */
        delivery: number
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
              shipment_id?: number
              ticket_code?: string
              ticket_number?: string
              agency_id?: number
              courier_id?: number
              status?: string
              attempt?: number
              delivered_at?: string | null
              failure_reason?: string | null
              recipient_name?: string | null
              recipient_document?: string | null
              evidence?: {
                signature_path?: string
                photo_path?: string
                latitude?: string
                longitude?: string
                captured_at?: string
              }
              created_at?: string
            }
          }
        }
      }
    }
  }
  assignShipmentsForDelivery: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Delivery agency. */
          agency_id: number
          /** @description Courier employee id. */
          courier_id: number
          /** @description Shipment ids. */
          shipment_ids: number[]
        }
      }
    }
    responses: {
      /** @description Assigned */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              id?: number
              shipment_id?: number
              ticket_code?: string
              status?: string
              attempt?: number
            }[]
          }
        }
      }
    }
  }
  startADelivery: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Delivery id. */
        delivery: number
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
              shipment_id?: number
              ticket_code?: string
              ticket_number?: string
              agency_id?: number
              courier_id?: number
              status?: string
              attempt?: number
              delivered_at?: string | null
              failure_reason?: string | null
              recipient_name?: string | null
              recipient_document?: string | null
              evidence?: {
                signature_path?: string
                photo_path?: string
                latitude?: string
                longitude?: string
                captured_at?: string
              }
              created_at?: string
            }
          }
        }
      }
    }
  }
  completeADelivery: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Delivery id. */
        delivery: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Recipient name. */
          recipient_name: string
          /** @description Recipient document. */
          recipient_document: string
          /** @description Signature route. */
          signature_path: string
          /** @description Photo route. */
          photo_path: string
          /** @description GPS latitude. */
          latitude: number
          /** @description GPS longitude. */
          longitude: number
          /** @description ISO 8601 capture time. */
          captured_at: string
        }
      }
    }
    responses: {
      /** @description Delivered */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              delivery?: {
                id?: number
                status?: string
              }
              order_id?: number
              shipment_id?: number
              already?: boolean
            }
          }
        }
      }
    }
  }
  failADelivery: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Delivery id. */
        delivery: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Reason. */
          failure_reason: string
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
              shipment_id?: number
              ticket_code?: string
              ticket_number?: string
              agency_id?: number
              courier_id?: number
              status?: string
              attempt?: number
              delivered_at?: string | null
              failure_reason?: string | null
              recipient_name?: string | null
              recipient_document?: string | null
              evidence?: {
                signature_path?: string
                photo_path?: string
                latitude?: string
                longitude?: string
                captured_at?: string
              }
              created_at?: string
            }
          }
        }
      }
    }
  }
  listEmbarks: {
    parameters: {
      query?: {
        /** @description Page to return. */
        page?: number
        /** @description Filter by origin agency. */
        agency?: number
        /** @description date Filter from this date. */
        departed_from?: string
        /** @description date Filter up to this date. */
        departed_to?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          agency?: number
          /** @description Must be a valid date. */
          departed_from?: string
          /** @description Must be a valid date. Must be a date after or equal to <code>departed_from</code>. */
          departed_to?: string
          per_page?: number
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
              agency_id?: number
              vehicle_id?: number
              driver_id?: number
              route_ref?: string
              departed_at?: string
              items_count?: number
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                scan_id?: string | null
              }[]
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
  createAnEmbark: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Origin agency. */
          agency_id: number
          /** @description Vehicle id. */
          vehicle_id: number
          /** @description Driver id. */
          driver_id: number
          /** @description Optional route reference. */
          route_ref?: string | null
          /** @description Optional ISO 8601 departure. */
          departed_at?: string | null
          /** @description Shipments in the manifest. */
          items: {
            /** @description 8-char ticket code. */
            ticket_code: string
            /** @description Optional PDA scan UUID. */
            scan_id?: string | null
            /** @description Must be a valid date. */
            scanned_at?: string | null
          }[]
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
              agency_id?: number
              vehicle_id?: number
              driver_id?: number
              route_ref?: string
              departed_at?: string
              items_count?: number
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                scan_id?: string | null
              }[]
              created_at?: string
            }
            success?: string
            message?: string
            accepted?: string
          }
        }
      }
    }
  }
  showAnEmbark: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Embark id. */
        embark: number
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
              agency_id?: number
              vehicle_id?: number
              driver_id?: number
              route_ref?: string
              departed_at?: string
              items_count?: number
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                scan_id?: string | null
              }[]
              created_at?: string
            }
          }
        }
      }
    }
  }
  disembarkAnEmbark: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Embark id. */
        embark: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Agency where the parcels are unloaded. */
          agency_id: number
          /** @description Optional ISO 8601 arrival. */
          arrived_at?: string | null
          /** @description Optional subset of tickets; omit to disembark the whole manifest. */
          items?: {
            /** @description 8-char ticket code. */
            ticket_code: string
            /** @description Optional PDA scan UUID. */
            scan_id?: string | null
          }[]
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
              agency_id?: number
              embark_id?: number
              arrived_at?: string
              items_count?: number
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                scan_id?: string | null
              }[]
              created_at?: string
            }
            success?: string
            message?: string
            accepted?: string
            duplicated?: string
          }
        }
      }
    }
  }
  listInventoryCounts: {
    parameters: {
      query?: {
        /** @description Page to return. */
        page?: number
        /** @description Filter by agency. */
        agency?: number
        /** @description `open` or `finished`. */
        status?: string
        /** @description date Filter from this date. */
        created_from?: string
        /** @description date Filter up to this date. */
        created_to?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          agency?: number
          /** @enum {string} */
          status?: 'open' | 'finished'
          /** @description Must be a valid date. */
          created_from?: string
          /** @description Must be a valid date. Must be a date after or equal to <code>created_from</code>. */
          created_to?: string
          per_page?: number
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
              agency_id?: number
              status?: string
              counted_by?: number
              finished_at?: string | null
              items_count?: number
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
  openAnInventoryCount: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Agency to count. */
          agency_id: number
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
              agency_id?: number
              status?: string
              counted_by?: number
              finished_at?: string | null
              items_count?: number
              summary?: {
                expected?: number
                found?: number
                missing?: number
                unexpected?: number
                difference?: number
              }
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                expected?: boolean
                found?: boolean
                difference?: number
                motive?: string | null
              }[]
              created_at?: string
            }
            success?: string
            message?: string
          }
        }
      }
    }
  }
  showAnInventoryCount: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Inventory count id. */
        count: number
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
              agency_id?: number
              status?: string
              counted_by?: number
              finished_at?: string | null
              items_count?: number
              summary?: {
                expected?: number
                found?: number
                missing?: number
                unexpected?: number
                difference?: number
              }
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                expected?: boolean
                found?: boolean
                difference?: number
                motive?: string | null
              }[]
              created_at?: string
            }
          }
        }
      }
    }
  }
  finishAnInventoryCount: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Inventory count id. */
        count: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Counted shipments. */
          items: {
            /** @description Shipment id. */
            shipment_id: number
            /** @description Whether the parcel was found. */
            found: boolean
            /** @description Required when the expected and found states differ. */
            motive?: string | null
          }[]
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
              agency_id?: number
              status?: string
              counted_by?: number
              finished_at?: string | null
              items_count?: number
              summary?: {
                expected?: number
                found?: number
                missing?: number
                unexpected?: number
                difference?: number
              }
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                expected?: boolean
                found?: boolean
                difference?: number
                motive?: string | null
              }[]
              created_at?: string
            }
            success?: string
            message?: string
            expected?: string
            found?: string
            missing?: string
            unexpected?: string
          }
        }
      }
    }
  }
  listReceptions: {
    parameters: {
      query?: {
        /** @description Page to return. */
        page?: number
        /** @description Filter by agency. */
        agency?: number
        /** @description date Filter from this date. */
        received_from?: string
        /** @description date Filter up to this date. */
        received_to?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must be at least 1. */
          agency?: number
          /** @description Must be a valid date. */
          received_from?: string
          /** @description Must be a valid date. Must be a date after or equal to <code>received_from</code>. */
          received_to?: string
          per_page?: number
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
              agency_id?: number
              received_by?: number
              received_at?: string
              status?: string
              items_count?: number
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                scan_id?: string | null
              }[]
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
  receiveShipments: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Agency where the parcels are received. */
          agency_id: number
          /** @description List of parcels. */
          items: {
            /** @description 8-char ticket code. */
            ticket_code: string
            /** @description Optional PDA scan UUID. */
            scan_id?: string | null
            /** @description Optional ISO 8601 timestamp. */
            scanned_at?: string | null
          }[]
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
              agency_id?: number
              received_by?: number
              received_at?: string
              status?: string
              items_count?: number
              items?: {
                id?: number
                shipment_id?: number
                ticket_code?: string
                scan_id?: string | null
              }[]
              created_at?: string
            }
            success?: string
            message?: string
            accepted?: string
            duplicated?: string
          }
        }
      }
    }
  }
  listShipments: {
    parameters: {
      query?: {
        /** @description Page to return. */
        page?: number
        /** @description One status or a comma-separated list. */
        status?: string
        /** @description Filter shipments touching this agency. */
        agency?: number
        /** @description Filter by origin agency. */
        origin_agency_id?: number
        /** @description Filter by destination agency. */
        destination_agency_id?: number
        /** @description Exact 8-char ticket code. */
        ticket_code?: string
        /** @description Ticket number prefix. */
        ticket_number?: string
        /** @description date Filter from this date. */
        created_from?: string
        /** @description date Filter up to this date. */
        created_to?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must not be greater than 120 characters. */
          status?: string
          /** @description Must be at least 1. */
          agency?: number
          /** @description Must be at least 1. */
          origin_agency_id?: number
          /** @description Must be at least 1. */
          destination_agency_id?: number
          /** @description Must not be greater than 8 characters. */
          ticket_code?: string
          /** @description Must not be greater than 20 characters. */
          ticket_number?: string
          /** @description Must be a valid date. */
          created_from?: string
          /** @description Must be a valid date. Must be a date after or equal to <code>created_from</code>. */
          created_to?: string
          per_page?: number
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
              order_id?: number
              ticket_code?: string
              ticket_number?: string
              status?: string
              origin_agency_id?: number
              destination_agency_id?: number
              current_location_agency_id?: number
              delivered_at?: string | null
              created_at?: string
              updated_at?: string
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
  showAShipment: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description 8-char ticket code. */
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
              order_id?: number
              ticket_code?: string
              ticket_number?: string
              status?: string
              origin_agency_id?: number
              destination_agency_id?: number
              current_location_agency_id?: number
              delivered_at?: string | null
              created_at?: string
              updated_at?: string
            }
          }
        }
      }
    }
  }
  agencyInventory: {
    parameters: {
      query?: {
        /** @description Page to return. */
        page?: number
        /** @description One status or a comma-separated list. */
        status?: string
        /** @description Ticket code or number prefix. */
        search?: string
        /** @description Rows per page (1..100). */
        per_page?: number
      }
      header?: never
      path: {
        /** @description Agency id. */
        agency: number
      }
      cookie?: never
    }
    requestBody?: {
      content: {
        'application/json': {
          /** @description Must not be greater than 120 characters. */
          status?: string
          /** @description Must not be greater than 20 characters. */
          search?: string
          per_page?: number
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
              order_id?: number
              ticket_code?: string
              ticket_number?: string
              status?: string
              origin_agency_id?: number
              destination_agency_id?: number
              current_location_agency_id?: number
              delivered_at?: string | null
              created_at?: string
              updated_at?: string
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
  synchronizePDAScans: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /** @description Optional device identifier. */
          device_id?: string | null
          /** @description Batch of scans. */
          scans: {
            /** @description Client-generated UUID (idempotency key). */
            scan_id: string
            /** @description 8-char ticket code. */
            ticket_code: string
            /** @description One of reception, embark, disembark, inventory, out_for_delivery. `delivery` is reserved for the delivery endpoint. */
            scan_type: string
            /** @description ISO 8601 timestamp. */
            scanned_at: string
            /** @description Required for embark/disembark scans. */
            embark_id?: number | null
            /** @description Optional agency override. */
            agency_id?: number | null
            /** @description Optional GPS latitude. */
            latitude?: number | null
            /** @description Optional GPS longitude. */
            longitude?: number | null
          }[]
        }
      }
    }
    responses: {
      /** @description Batch processed */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              accepted?: number
              duplicated?: number
              rejected?: number
              items?: {
                scan_id?: string
                status?: string
                shipment_id?: number
                shipment_status?: string
              }[]
            }
          }
        }
      }
    }
  }
  lookUpAShipmentTimeline: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description 8-char ticket code. */
        ticketCode: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Timeline */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            message?: string
            data?: {
              shipment_id?: number
              order_id?: number
              ticket_code?: string
              ticket_number?: string
              status?: string
              origin_agency_id?: number
              destination_agency_id?: number
              current_location_agency_id?: number
              delivered_at?: string | null
              events?: {
                id?: number
                event_type?: string
                status?: string
                agency_id?: number
                scan_id?: string | null
                meta?: Record<string, never>
                created_at?: string
              }[]
            }
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
