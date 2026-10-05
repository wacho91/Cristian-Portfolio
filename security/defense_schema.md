# Esquema de Defensa — Cristian-Portfolio SaaS AgroTech

> **Modelo de amenaza:** Zero Trust. Ningún componente confía en otro por defecto.
> **Alcance:** Backend FastAPI + Supabase (PostgreSQL) + Frontend React.
> **Clasificación de datos:** PII (contactos), datos operativos de fincas (multi-tenant), credenciales.

---

## 0. Principios rectores (Zero Trust)

1. **Nunca confiar, siempre verificar.** El frontend es hostil hasta que se pruebe lo contrario.
2. **Mínimo privilegio.** Cada rol, cada token, cada query tiene el mínimo scope necesario.
3. **Defensa en profundidad.** Ninguna capa es la única barrera.
4. **Asumir el breach.** Diseñar como si el atacante ya estuviera dentro.
5. **Fail secure.** Ante error, denegar. Nunca "abrir por defecto".
6. **Todo lo que entra se valida.** Input = enemigo hasta validación estricta.

---

## 1. INVESTIGACIÓN DE AMENAZAS

### 1.1 OWASP Top 10 (2021) — Aplicado a este proyecto

| ID | Amenaza | Vector en Cristian-Portfolio | Mitigación |
|----|---------|------------------------------|------------|
| **A01** | Broken Access Control | IDOR en `/api/contact/{id}`, acceso a fincas ajenas | RLS + verificación de ownership en cada query |
| **A02** | Cryptographic Failures | JWT con secreto débil, bcrypt sin rounds, HTTP en prod | Argon2id, HS256 con secreto 256-bit, TLS 1.3 obligatorio |
| **A03** | Injection | SQL injection vía `subject`, NoSQL, command injection en logs | ORM parametrizado + Pydantic estricto + sanitización de logs |
| **A04** | Insecure Design | Sin rate limiting, sin lockout, sin MFA | Diseño defensivo desde el día 1 (este documento) |
| **A05** | Security Misconfiguration | `docs_url` en prod, CORS `*`, debug mode | Config por entorno, headers de seguridad, CORS allowlist |
| **A06** | Vulnerable Components | `passlib[bcrypt]==1.7.4` (CVE-2024-21503 en bcrypt) | Migrar a `argon2-cffi`, Dependabot, SBOM |
| **A07** | Auth Failures | Sin refresh tokens, sin expiración corta, sin revocación | Access 15min + Refresh 7d rotativo + blacklist |
| **A08** | Data Integrity Failures | Sin firma de JWT, sin verificación de webhooks | JWT firmado + HMAC en webhooks |
| **A09** | Logging Failures | Logs sin request_id, sin alertas | Structured logging + SIEM + alertas |
| **A10** | SSRF | Fetch a URLs del usuario (futuro CMS) | Allowlist de dominios, bloqueo de IPs privadas |

### 1.2 Amenazas específicas de SaaS Multi-Tenant

#### 🔴 Bypass de Row Level Security (RLS)
**Escenario:** Un usuario de la Finca A manipula el `tenant_id` en el JWT o en el body y accede a datos de la Finca B.
**Vector:** JWT tampering, IDOR, query sin filtro de tenant.
**Mitigación:**
- RLS **obligatorio** en TODAS las tablas con `tenant_id`.
- `tenant_id` **NUNCA** viene del cliente — se extrae del JWT verificado server-side.
- Política RLS: `USING (tenant_id = auth.jwt() ->> 'tenant_id')`.
- Tests automatizados que intentan cross-tenant access en CI.

#### 🔴 JWT Tampering
**Escenario:** Atacante modifica el payload del JWT (cambia `role` a `admin` o `tenant_id`).
**Vector:** Secreto débil, algoritmo `none`, confusión HS/RS.
**Mitigación:**
- Secreto de 256 bits generado con `secrets.token_urlsafe(64)`.
- Algoritmo fijo en el servidor (`HS256`), **nunca** leer `alg` del token.
- Verificación de `iss`, `aud`, `exp`, `iat`, `jti`.
- Rotación de secretos cada 90 días con `kid` en el header.

#### 🔴 Privilege Escalation
**Escenario:** Usuario con rol `viewer` ejecuta acciones de `admin`.
**Vector:** Falta de verificación de rol en endpoints, mass assignment.
**Mitigación:**
- Decorador `@require_role("admin")` en cada endpoint sensible.
- RBAC declarativo en el dominio (no en el router).
- Pydantic con `model_config = ConfigDict(extra="forbid")` para evitar mass assignment.

#### 🔴 Ataques de Concurrencia en Inventarios
**Escenario:** Dos usuarios venden el mismo lote de café simultáneamente → stock negativo.
**Vector:** Race condition TOCTOU (Time-of-check to time-of-use).
**Mitigación:**
- **Optimistic locking** con columna `version` en tablas de inventario.
- **Pessimistic locking** (`SELECT ... FOR UPDATE`) en operaciones críticas.
- Transacciones con `SERIALIZABLE` isolation en PostgreSQL.
- Idempotency keys en endpoints de mutación.

#### 🟠 Enumeración de Tenants
**Escenario:** Atacante descubre IDs de fincas por respuestas diferenciadas (404 vs 403).
**Mitigación:** Respuestas uniformes (siempre 404), timing constante.

#### 🟠 Cross-Tenant Cache Poisoning
**Escenario:** Cache compartida entre tenants filtra datos.
**Mitigación:** Cache key incluye `tenant_id`; nunca cachear sin scope.

---

## 2. ESQUEMA DE SEGURIDAD PROACTIVO

### 2.1 Aislamiento de Datos Multi-Tenant (RLS en Supabase)

#### 2.1.1 Modelo de datos

Toda tabla de negocio incluye:
