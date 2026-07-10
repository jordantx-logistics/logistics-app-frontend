Plan de implementación para completar proyecto basado en referencia `references\logitrack-dashboard.html`

---

## **PHASE 1: CORRECTION DE ERRORES Y CALIDAD DE CÓDIGO**

1. Ejecutar `pnpm type-check` → identificar errores TypeScript
2. Ejecutar `pnpm lint` → identificar issues de código
3. Corregir todos los errores encontrados
4. Verificar que pase sin problemas

---

## **PHASE 2: MEJORA DE COMPONENTES CORE PARA MATCH CON REFERENCIA**

| Componente | Cambios necesarios |
|------------|-------------------|
| `Card.vue` | Agregar `header` con `actions` slot (como referencia) |
| `Badge.vue` | Soportar más variantes: success, warning, danger, info, neutral |
| `Button.vue` | Soportar icon leading/trailing (ya tiene slots pero verificar) |
| `DataTable.vue` | Verificar custom cell rendering con slots |

---

## **PHASE 3: IMPLEMENTACIÓN DE PÁGINAS FALTANTES/INCOMPLETAS**

| Módulo | Estado actual | Qué falta |
|--------|--------------|-----------|
| **Payments** | Básico | Stats grid, filters, modal para "New Payment" |
| **Customers** | Básico | Stats grid, filters, modal para "New Customer" |
| **Agencies** | Básico | Stats grid, filters, modal para "New Agency" |
| **Permissions** | Básico | Stats grid, filters, modal para "New Role" |
| **Settings** | Básico | Tabs (profile, notifications, appearance, security) |

---

## **PHASE 4: MEJORA DE DISEÑO PARA MATCH CON REFERENCIA**

- Actualizar estilos para match con referencia (colores, spacing, typography)
- Implementar theme toggle funcional (ya existe `useTheme`)
- Mejorar responsive design para mobile

---

## **PHASE 5: IMPLEMENTACIÓN DE API LAYER (OPCIONAL)**

- Crear API stores con Pinia para backend integration
- Mover mock data a API layer
- Implementar fetch calls con error handling

---

## **PHASE 6: TESTING CON PLAYWRIGHT**

- Configurar Playwright tests
- Crear tests para: login, navigation, data display, CRUD operations
- Ejecutar tests con Playwright MCP

---

## **PREGUNTAS PARA EL USUARIO:**

1. **¿Qué nivel de fidelidad de diseño se necesita con la referencia?**
   - Alta fidelidad (match exacto visual)

2. **¿Qué fuente de datos preferir:**
   - Mock data (más rápido, fácil de probar)

3. **¿Qué prioridad para las páginas?**
   - Todas al mismo tiempo
