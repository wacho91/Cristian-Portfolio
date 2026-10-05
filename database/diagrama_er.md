# Diagrama Entidad-Relación — Cristian-Portfolio

> Modelo relacional normalizado (3FN) para el portafolio Enterprise.
> Motor objetivo: **PostgreSQL 15+**.
> Convenciones: `snake_case`, PK `UUID` (excepto `event_log`/`audit_log` con `BIGSERIAL`),
> timestamps `TIMESTAMPTZ` en UTC.

---

## 1. Diagrama ER global (Mermaid)
