# Arquitectura — Cristian-Portfolio

> Documento de arquitectura de referencia. Aplica **Clean Architecture** (Robert C. Martin)
> y **Separación de Responsabilidades (SoC)** como regla de oro.
> El sistema se compone de dos aplicaciones desacopladas: **Frontend (React/Vite)** y
> **Backend (FastAPI)**, comunicadas exclusivamente vía HTTP/JSON.

---

## 1. Visión general

Cristian-Portfolio es un sitio web personal de nivel Enterprise cuyo objetivo es:

1. Presentar el perfil profesional de un **Arquitecto de Software y Fundador de SaaS**.
2. Exhibir **4 sistemas SaaS completos en producción** con narrativa técnica (problema, arquitectura, stack, métricas).
3. Capturar **leads** mediante un formulario de contacto que se persiste (en esta fase) como **log en consola** del backend.

El sistema es deliberadamente **simple en infraestructura** pero **riguroso en estructura**:
la complejidad se invierte en la organización del código, no en dependencias externas.

### 1.1 Principios rectores

| Principio | Aplicación concreta |
|---|---|
| **Separación de Responsabilidades (SoC)** | Frontend y backend son artefactos independientes. Dentro de cada uno, capas con responsabilidades únicas. |
| **Clean Architecture** | Regla de dependencia: las capas externas dependen de las internas, nunca al revés. El dominio no conoce frameworks. |
| **Modularidad** | Cada feature (contact, projects, hero) es un módulo autocontenido. |
| **Escalabilidad** | Sustituir el logger de consola por un repositorio real (DB, email, CRM) no debe tocar el dominio. |
| **Testabilidad** | El caso de uso `SubmitContactMessage` se prueba sin FastAPI ni HTTP. |
| **Contract-first** | El contrato HTTP (`/api/contact`) es estable; la implementación interna es reemplazable. |

---

## 2. Contexto del sistema (C4 — Nivel 1)
