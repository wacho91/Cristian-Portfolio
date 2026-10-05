-- ============================================================================
--  Cristian-Portfolio — Esquema de Base de Datos
--  Motor: PostgreSQL 15+
--  Autor: DBA (Database Administrator)
--  Versión: 1.0.0
--  Codificación: UTF-8
--  Normalización: 3FN
-- ============================================================================
--  Descripción:
--    Esquema relacional para el portafolio Enterprise de un Arquitecto de
--    Software y Fundador SaaS. Modela:
--      - Perfil profesional (owner)
--      - Proyectos SaaS en producción (4 sistemas)
--      - Stack tecnológico por proyecto
--      - Métricas cuantitativas por proyecto
--      - Habilidades (skills) categorizadas
--      - Experiencia laboral / trayectoria
--      - Mensajes de contacto (leads) — reemplaza el ConsoleLogger
--      - Auditoría de eventos (event log)
--      - Suscriptores de newsletter (opcional)
--      - Sesiones de visitante anónimas (analytics básico)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONES Y CONFIGURACIÓN
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";        -- emails case-insensitive
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- búsqueda fuzzy en texto

-- Zona horaria por defecto
SET TIME ZONE 'UTC';

-- ----------------------------------------------------------------------------
-- 1. TIPOS ENUMERADOS (DOMINIOS CONTROLADOS)
-- ----------------------------------------------------------------------------
DROP TYPE IF EXISTS project_status_enum CASCADE;
CREATE TYPE project_status_enum AS ENUM (
    'in_development',
    'beta',
    'production',
    'deprecated',
    'archived'
);

DROP TYPE IF EXISTS skill_category_enum CASCADE;
CREATE TYPE skill_category_enum AS ENUM (
    'language',
    'framework',
    'database',
    'devops',
    'cloud',
    'architecture',
    'soft_skill',
    'tool'
);

DROP TYPE IF EXISTS skill_level_enum CASCADE;
CREATE TYPE skill_level_enum AS ENUM (
    'beginner',
    'intermediate',
    'advanced',
    'expert'
);

DROP TYPE IF EXISTS contact_status_enum CASCADE;
CREATE TYPE contact_status_enum AS ENUM (
    'new',
    'read',
    'replied',
    'archived',
    'spam'
);

DROP TYPE IF EXISTS metric_unit_enum CASCADE;
CREATE TYPE metric_unit_enum AS ENUM (
    'count',
    'percentage',
    'currency_usd',
    'milliseconds',
    'seconds',
    'requests_per_second',
    'users',
    'bytes',
    'custom'
);

DROP TYPE IF EXISTS event_type_enum CASCADE;
CREATE TYPE event_type_enum AS ENUM (
    'page_view',
    'project_view',
    'contact_submit',
    'contact_success',
    'contact_error',
    'cv_download',
    'external_link_click',
    'newsletter_subscribe'
);

-- ----------------------------------------------------------------------------
-- 2. TABLA: owner (perfil del propietario del portafolio)
-- ----------------------------------------------------------------------------
CREATE TABLE owner (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name           VARCHAR(120)    NOT NULL,
    headline            VARCHAR(180)    NOT NULL,
    bio_short           VARCHAR(500)    NOT NULL,
    bio_long            TEXT,
    email               CITEXT          NOT NULL UNIQUE,
    phone               VARCHAR(30),
    location            VARCHAR(120),
    avatar_url          TEXT,
    resume_url          TEXT,
    github_url          TEXT,
    linkedin_url        TEXT,
    twitter_url         TEXT,
    website_url         TEXT,
    years_experience    SMALLINT        NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE owner IS 'Perfil profesional del propietario del portafolio (single-row en la práctica).';

-- ----------------------------------------------------------------------------
-- 3. TABLA: project (sistemas SaaS en producción)
-- ----------------------------------------------------------------------------
CREATE TABLE project (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id            UUID                NOT NULL REFERENCES owner(id) ON DELETE CASCADE,
    slug                VARCHAR(80)         NOT NULL UNIQUE,
    name                VARCHAR(120)        NOT NULL,
    tagline             VARCHAR(200)        NOT NULL,
    description_short   VARCHAR(500)        NOT NULL,
    description_long    TEXT                NOT NULL,
    problem_statement   TEXT                NOT NULL,
    solution_summary    TEXT                NOT NULL,
    architecture_notes  TEXT,
    status              project_status_enum NOT NULL DEFAULT 'production',
    launched_at         DATE,
    live_url            TEXT,
    repo_url            TEXT,
    cover_image_url     TEXT,
    demo_video_url      TEXT,
    is_featured         BOOLEAN             NOT NULL DEFAULT FALSE,
    display_order       SMALLINT            NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT project_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE INDEX idx_project_status        ON project(status);
CREATE INDEX idx_project_featured      ON project(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_project_display_order ON project(display_order);
CREATE INDEX idx_project_name_trgm     ON project USING gin (name gin_trgm_ops);

COMMENT ON TABLE project IS 'Sistemas SaaS desarrollados y operados por el owner.';

-- ----------------------------------------------------------------------------
-- 4. TABLA: technology (catálogo de tecnologías)
-- ----------------------------------------------------------------------------
CREATE TABLE technology (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(80)     NOT NULL UNIQUE,
    slug            VARCHAR(80)     NOT NULL UNIQUE,
    category        skill_category_enum NOT NULL,
    icon_url        TEXT,
    official_url    TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_technology_category ON technology(category);

COMMENT ON TABLE technology IS 'Catálogo normalizado de tecnologías (lenguajes, frameworks, DBs, etc.).';

-- ----------------------------------------------------------------------------
-- 5. TABLA: project_technology (N:M entre project y technology)
-- ----------------------------------------------------------------------------
CREATE TABLE project_technology (
    project_id      UUID        NOT NULL REFERENCES project(id)    ON DELETE CASCADE,
    technology_id   UUID        NOT NULL REFERENCES technology(id) ON DELETE RESTRICT,
    role            VARCHAR(60),   -- ej: 'backend', 'frontend', 'infra', 'primary'
    is_primary      BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, technology_id)
);

CREATE INDEX idx_proj_tech_tech ON project_technology(technology_id);

COMMENT ON TABLE project_technology IS 'Relación N:M entre proyectos y tecnologías usadas.';

-- ----------------------------------------------------------------------------
-- 6. TABLA: project_metric (métricas cuantitativas por proyecto)
-- ----------------------------------------------------------------------------
CREATE TABLE project_metric (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID            NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    metric_key      VARCHAR(60)     NOT NULL,   -- ej: 'mrr', 'uptime', 'users'
    label           VARCHAR(120)    NOT NULL,   -- ej: 'MRR', 'Uptime', 'Usuarios activos'
    value_numeric   NUMERIC(18,4)   NOT NULL,
    unit            metric_unit_enum NOT NULL DEFAULT 'count',
    custom_unit     VARCHAR(30),                -- si unit = 'custom'
    display_order   SMALLINT        NOT NULL DEFAULT 0,
    measured_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT project_metric_unique_key UNIQUE (project_id, metric_key),
    CONSTRAINT project_metric_custom_unit CHECK (
        (unit = 'custom' AND custom_unit IS NOT NULL) OR
        (unit <> 'custom')
    )
);

CREATE INDEX idx_project_metric_project ON project_metric(project_id);

COMMENT ON TABLE project_metric IS 'Métricas cuantitativas (MRR, uptime, usuarios, latencia, etc.) por proyecto.';

-- ----------------------------------------------------------------------------
-- 7. TABLA: skill (habilidades del owner)
-- ----------------------------------------------------------------------------
CREATE TABLE skill (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID                NOT NULL REFERENCES owner(id) ON DELETE CASCADE,
    name            VARCHAR(80)         NOT NULL,
    category        skill_category_enum NOT NULL,
    level           skill_level_enum    NOT NULL DEFAULT 'advanced',
    proficiency     SMALLINT            NOT NULL DEFAULT 80 CHECK (proficiency BETWEEN 0 AND 100),
    years_used      SMALLINT            NOT NULL DEFAULT 0 CHECK (years_used >= 0),
    display_order   SMALLINT            NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT skill_unique_per_owner UNIQUE (owner_id, name)
);

CREATE INDEX idx_skill_category ON skill(category);
CREATE INDEX idx_skill_owner    ON skill(owner_id);

COMMENT ON TABLE skill IS 'Habilidades técnicas y blandas del owner, con nivel y proficiencia.';

-- ----------------------------------------------------------------------------
-- 8. TABLA: experience (trayectoria laboral)
-- ----------------------------------------------------------------------------
CREATE TABLE experience (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID            NOT NULL REFERENCES owner(id) ON DELETE CASCADE,
    company         VARCHAR(150)    NOT NULL,
    role            VARCHAR(150)    NOT NULL,
    description     TEXT,
    location        VARCHAR(120),
    start_date      DATE            NOT NULL,
    end_date        DATE,                       -- NULL = actual
    is_current      BOOLEAN         NOT NULL DEFAULT FALSE,
    display_order   SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT experience_dates_valid CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT experience_current_consistency CHECK (
        (is_current = TRUE AND end_date IS NULL) OR
        (is_current = FALSE)
    )
);

CREATE INDEX idx_experience_owner ON experience(owner_id);
CREATE INDEX idx_experience_dates ON experience(start_date DESC);

COMMENT ON TABLE experience IS 'Historial laboral del owner.';

-- ----------------------------------------------------------------------------
-- 9. TABLA: contact_message (leads del formulario)
-- ----------------------------------------------------------------------------
CREATE TABLE contact_message (
    id              UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(80)             NOT NULL,
    email           CITEXT                  NOT NULL,
    subject         VARCHAR(120),
    message         TEXT                    NOT NULL,
    status          contact_status_enum     NOT NULL DEFAULT 'new',
    ip_address      INET,
    user_agent      TEXT,
    referrer        TEXT,
    request_id      UUID,                   -- correlación con middleware request_id
    replied_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    CONSTRAINT contact_name_len    CHECK (char_length(name) BETWEEN 2 AND 80),
    CONSTRAINT contact_message_len CHECK (char_length(message) BETWEEN 10 AND 2000),
    CONSTRAINT contact_subject_len CHECK (subject IS NULL OR char_length(subject) <= 120),
    CONSTRAINT contact_email_format CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

CREATE INDEX idx_contact_status     ON contact_message(status);
CREATE INDEX idx_contact_created_at ON contact_message(created_at DESC);
CREATE INDEX idx_contact_email      ON contact_message(email);
CREATE INDEX idx_contact_request_id ON contact_message(request_id);

COMMENT ON TABLE contact_message IS 'Mensajes recibidos vía POST /api/contact. Reemplaza el ConsoleLogger.';

-- ----------------------------------------------------------------------------
-- 10. TABLA: newsletter_subscriber (opcional)
-- ----------------------------------------------------------------------------
CREATE TABLE newsletter_subscriber (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email           CITEXT      NOT NULL UNIQUE,
    is_confirmed    BOOLEAN     NOT NULL DEFAULT FALSE,
    confirm_token   UUID        NOT NULL DEFAULT gen_random_uuid(),
    subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at    TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    CONSTRAINT newsletter_email_format CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

CREATE INDEX idx_newsletter_confirmed ON newsletter_subscriber(is_confirmed);

COMMENT ON TABLE newsletter_subscriber IS 'Suscriptores de newsletter (doble opt-in).';

-- ----------------------------------------------------------------------------
-- 11. TABLA: visitor_session (analytics anónimo)
-- ----------------------------------------------------------------------------
CREATE TABLE visitor_session (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token   UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    ip_hash         VARCHAR(64),                -- SHA-256 del IP (GDPR-friendly)
    user_agent      TEXT,
    country_code    CHAR(2),
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visitor_started ON visitor_session(started_at DESC);

COMMENT ON TABLE visitor_session IS 'Sesiones anónimas de visitantes (analytics básico, GDPR-friendly).';

-- ----------------------------------------------------------------------------
-- 12. TABLA: event_log (auditoría de eventos)
-- ----------------------------------------------------------------------------
CREATE TABLE event_log (
    id              BIGSERIAL           PRIMARY KEY,
    session_id      UUID                REFERENCES visitor_session(id) ON DELETE SET NULL,
    event_type      event_type_enum     NOT NULL,
    entity_type     VARCHAR(60),        -- ej: 'project', 'contact_message'
    entity_id       UUID,
    payload         JSONB               NOT NULL DEFAULT '{}'::jsonb,
    occurred_at     TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_type     ON event_log(event_type);
CREATE INDEX idx_event_occurred ON event_log(occurred_at DESC);
CREATE INDEX idx_event_entity   ON event_log(entity_type, entity_id);
CREATE INDEX idx_event_payload  ON event_log USING gin (payload);

COMMENT ON TABLE event_log IS 'Log de eventos de negocio (page views, submits, clicks).';

-- ----------------------------------------------------------------------------
-- 13. TABLA: audit_log (auditoría técnica de cambios)
-- ----------------------------------------------------------------------------
CREATE TABLE audit_log (
    id              BIGSERIAL       PRIMARY KEY,
    table_name      VARCHAR(80)     NOT NULL,
    record_id       UUID            NOT NULL,
    operation       VARCHAR(10)     NOT NULL CHECK (operation IN ('INSERT','UPDATE','DELETE')),
    changed_by      VARCHAR(120),
    old_values      JSONB,
    new_values      JSONB,
    changed_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_changed_at   ON audit_log(changed_at DESC);

COMMENT ON TABLE audit_log IS 'Auditoría técnica de cambios en tablas críticas.';

-- ============================================================================
-- 14. FUNCIONES Y TRIGGERS
-- ============================================================================

-- 14.1 Trigger genérico: actualizar updated_at
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_owner
    BEFORE UPDATE ON owner
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_project
    BEFORE UPDATE ON project
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_skill
    BEFORE UPDATE ON skill
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_experience
    BEFORE UPDATE ON experience
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_contact_message
    BEFORE UPDATE ON contact_message
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- 14.2 Trigger: auditoría de contact_message
CREATE OR REPLACE FUNCTION trg_audit_contact_message()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log(table_name, record_id, operation, new_values)
        VALUES ('contact_message', NEW.id, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log(table_name, record_id, operation, old_values, new_values)
        VALUES ('contact_message', NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log(table_name, record_id, operation, old_values)
        VALUES ('contact_message', OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_contact_message
    AFTER INSERT OR UPDATE OR DELETE ON contact_message
    FOR EACH ROW EXECUTE FUNCTION trg_audit_contact_message();

-- 14.3 Trigger: registrar evento al crear contact_message
CREATE OR REPLACE FUNCTION trg_event_contact_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO event_log(event_type, entity_type, entity_id, payload)
    VALUES (
        'contact_submit',
        'contact_message',
        NEW.id,
        jsonb_build_object(
            'email', NEW.email,
            'subject', NEW.subject,
            'request_id', NEW.request_id
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_contact_created
    AFTER INSERT ON contact_message
    FOR EACH ROW EXECUTE FUNCTION trg_event_contact_created();

-- ============================================================================
-- 15. VISTAS
-- ============================================================================

-- 15.1 Vista: proyectos con conteo de tecnologías y métricas clave
CREATE OR REPLACE VIEW v_project_overview AS
SELECT
    p.id,
    p.slug,
    p.name,
    p.tagline,
    p.status,
    p.is_featured,
    p.display_order,
    p.live_url,
    p.launched_at,
    COUNT(DISTINCT pt.technology_id) AS technology_count,
    COUNT(DISTINCT pm.id)            AS metric_count,
    MAX(CASE WHEN pm.metric_key = 'mrr'    THEN pm.value_numeric END) AS mrr,
    MAX(CASE WHEN pm.metric_key = 'uptime' THEN pm.value_numeric END) AS uptime_pct,
    MAX(CASE WHEN pm.metric_key = 'users'  THEN pm.value_numeric END) AS active_users
FROM project p
LEFT JOIN project_technology pt ON pt.project_id = p.id
LEFT JOIN project_metric     pm ON pm.project_id = p.id
GROUP BY p.id;

COMMENT ON VIEW v_project_overview IS 'Vista agregada de proyectos con métricas clave para el showcase.';

-- 15.2 Vista: dashboard de leads
CREATE OR REPLACE VIEW v_contact_dashboard AS
SELECT
    status,
    COUNT(*)                                    AS total,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')  AS last_7_days,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS last_30_days,
    MAX(created_at)                             AS last_received_at
FROM contact_message
GROUP BY status;

COMMENT ON VIEW v_contact_dashboard IS 'Resumen de leads por estado para panel admin.';

-- 15.3 Vista: stack tecnológico por proyecto
CREATE OR REPLACE VIEW v_project_stack AS
SELECT
    p.slug          AS project_slug,
    p.name          AS project_name,
    t.name          AS technology_name,
    t.category      AS technology_category,
    pt.role,
    pt.is_primary
FROM project p
JOIN project_technology pt ON pt.project_id = p.id
JOIN technology         t  ON t.id = pt.technology_id
ORDER BY p.display_order, pt.is_primary DESC, t.name;

COMMENT ON VIEW v_project_stack IS 'Stack tecnológico desnormalizado por proyecto.';

-- ============================================================================
-- 16. FUNCIONES DE NEGOCIO
-- ============================================================================

-- 16.1 Registrar mensaje de contacto (usada por el adaptador PostgresMessageLogger)
CREATE OR REPLACE FUNCTION fn_submit_contact_message(
    p_name       VARCHAR,
    p_email      CITEXT,
    p_subject    VARCHAR,
    p_message    TEXT,
    p_ip         INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer   TEXT DEFAULT NULL,
    p_request_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO contact_message(name, email, subject, message, ip_address, user_agent, referrer, request_id)
    VALUES (p_name, p_email, p_subject, p_message, p_ip, p_user_agent, p_referrer, p_request_id)
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_submit_contact_message IS 'Inserta un mensaje de contacto y devuelve su UUID.';

-- 16.2 Marcar mensaje como respondido
CREATE OR REPLACE FUNCTION fn_mark_contact_replied(p_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE contact_message
       SET status = 'replied',
           replied_at = NOW()
     WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_mark_contact_replied IS 'Marca un mensaje como respondido.';

-- ============================================================================
-- 17. SEED DATA (mínimo indispensable)
-- ============================================================================

-- 17.1 Owner
INSERT INTO owner (
    id, full_name, headline, bio_short, bio_long, email, location,
    years_experience, github_url, linkedin_url
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Cristian',
    'Arquitecto de Software & Fundador SaaS',
    'Diseño y opero sistemas SaaS en producción con foco en arquitectura limpia, escalabilidad y experiencia de usuario.',
    'Arquitecto de Software con más de una década construyendo plataformas SaaS. Especialista en Clean Architecture, sistemas distribuidos y producto. Fundador de 4 SaaS en producción.',
    'contact@cristian.dev',
    'Remote',
    10,
    'https://github.com/cristian',
    'https://linkedin.com/in/cristian'
) ON CONFLICT (email) DO NOTHING;

-- 17.2 Tecnologías base
INSERT INTO technology (name, slug, category, official_url) VALUES
    ('Python',       'python',       'language',    'https://python.org'),
    ('TypeScript',   'typescript',   'language',    'https://typescriptlang.org'),
    ('FastAPI',      'fastapi',      'framework',   'https://fastapi.tiangolo.com'),
    ('React',        'react',        'framework',   'https://react.dev'),
    ('PostgreSQL',   'postgresql',   'database',    'https://postgresql.org'),
    ('Redis',        'redis',        'database',    'https://redis.io'),
    ('Docker',       'docker',       'devops',      'https://docker.com'),
    ('Kubernetes',   'kubernetes',   'devops',      'https://kubernetes.io'),
    ('AWS',          'aws',          'cloud',       'https://aws.amazon.com'),
    ('Tailwind CSS', 'tailwind-css', 'framework',   'https://tailwindcss.com')
ON CONFLICT (slug) DO NOTHING;

-- 17.3 Proyectos SaaS (4 en producción)
INSERT INTO project (
    id, owner_id, slug, name, tagline, description_short, description_long,
    problem_statement, solution_summary, status, launched_at, is_featured, display_order
) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'saas-analytics',
    'SaaS Analytics',
    'Analítica en tiempo real para equipos de producto',
    'Plataforma de analítica de producto con dashboards en tiempo real.',
    'SaaS Analytics es una plataforma que ingiere eventos de producto y expone dashboards en tiempo real con cohortes, funnels y retención.',
    'Los equipos de producto carecían de visibilidad en tiempo real sobre el comportamiento de usuarios.',
    'Pipeline de ingesta con Kafka + procesamiento en streaming + almacenamiento columnar + dashboards React.',
    'production', '2023-03-15', TRUE, 1
),
(
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'saas-billing',
    'SaaS Billing',
    'Facturación y suscripciones para SaaS B2B',
    'Motor de facturación recurrente con soporte multi-moneda y multi-impuesto.',
    'SaaS Billing gestiona suscripciones, prorrateos, impuestos y dunning para empresas SaaS B2B.',
    'La facturación recurrente multi-país era un cuello de botella operativo.',
    'Motor de reglas declarativo + integración con Stripe + reconciliación contable.',
    'production', '2022-09-01', TRUE, 2
),
(
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'saas-crm',
    'SaaS CRM',
    'CRM ligero para equipos comerciales',
    'CRM con pipeline visual, automatizaciones y scoring de leads.',
    'SaaS CRM ofrece pipeline kanban, automatizaciones no-code y scoring predictivo de leads.',
    'Los CRMs tradicionales eran pesados y caros para pymes.',
    'Arquitectura event-driven + scoring ML + UI kanban con React DnD.',
    'production', '2021-06-10', TRUE, 3
),
(
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'saas-devops',
    'SaaS DevOps',
    'Observabilidad y CI/CD como servicio',
    'Plataforma de observabilidad y pipelines CI/CD gestionados.',
    'SaaS DevOps unifica logs, métricas y trazas con pipelines CI/CD gestionados.',
    'Los equipos pequeños no podían costear un stack de observabilidad completo.',
    'OpenTelemetry + almacenamiento columnar + runners efímeros en Kubernetes.',
    'production', '2024-01-20', TRUE, 4
)
ON CONFLICT (slug) DO NOTHING;

-- 17.4 Relaciones proyecto-tecnología
INSERT INTO project_technology (project_id, technology_id, role, is_primary)
SELECT p.id, t.id, 'backend', TRUE
FROM project p, technology t
WHERE p.slug = 'saas-analytics' AND t.slug = 'python'
ON CONFLICT DO NOTHING;

INSERT INTO project_technology (project_id, technology_id, role, is_primary)
SELECT p.id, t.id, 'frontend', TRUE
FROM project p, technology t
WHERE p.slug = 'saas-analytics' AND t.slug = 'react'
ON CONFLICT DO NOTHING;

INSERT INTO project_technology (project_id, technology_id, role, is_primary)
SELECT p.id, t.id, 'database', TRUE
FROM project p, technology t
WHERE p.slug = 'saas-analytics' AND t.slug = 'postgresql'
ON CONFLICT DO NOTHING;

INSERT INTO project_technology (project_id, technology_id, role, is_primary)
SELECT p.id, t.id, 'infra', TRUE
FROM project p, technology t
WHERE p.slug = 'saas-analytics' AND t.slug = 'kubernetes'
ON CONFLICT DO NOTHING;

-- 17.5 Métricas de ejemplo
INSERT INTO project_metric (project_id, metric_key, label, value_numeric, unit, display_order)
SELECT p.id, 'mrr', 'MRR', 45000, 'currency_usd', 1
FROM project p WHERE p.slug = 'saas-analytics'
ON CONFLICT DO NOTHING;

INSERT INTO project_metric (project_id, metric_key, label, value_numeric, unit, display_order)
SELECT p.id, 'uptime', 'Uptime', 99.98, 'percentage', 2
FROM project p WHERE p.slug = 'saas-analytics'
ON CONFLICT DO NOTHING;

INSERT INTO project_metric (project_id, metric_key, label, value_numeric, unit, display_order)
SELECT p.id, 'users', 'Usuarios activos', 12500, 'users', 3
FROM project p WHERE p.slug = 'saas-analytics'
ON CONFLICT DO NOTHING;

-- 17.6 Skills
INSERT INTO skill (owner_id, name, category, level, proficiency, years_used, display_order) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Python',         'language',     'expert',       95, 10, 1),
    ('00000000-0000-0000-0000-000000000001', 'TypeScript',     'language',     'expert',       92,  8, 2),
    ('00000000-0000-0000-0000-000000000001', 'FastAPI',        'framework',    'expert',       94,  6, 3),
    ('00000000-0000-0000-0000-000000000001', 'React',          'framework',    'advanced',     88,  8, 4),
    ('00000000-0000-0000-0000-000000000001', 'PostgreSQL',     'database',     'expert',       90, 10, 5),
    ('00000000-0000-0000-0000-000000000001', 'Kubernetes',     'devops',       'advanced',     85,  5, 6),
    ('00000000-0000-0000-0000-000000000001', 'Clean Architecture', 'architecture', 'expert',   96,  8, 7)
ON CONFLICT (owner_id, name) DO NOTHING;

-- 17.7 Experiencia
INSERT INTO experience (owner_id, company, role, description, location, start_date, end_date, is_current, display_order) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Independiente', 'Fundador & Arquitecto', 'Fundé y opero 4 SaaS en producción.', 'Remote', '2020-01-01', NULL, TRUE, 1)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 18. PERMISOS (roles de aplicación)
-- ============================================================================
-- Rol de solo lectura para el frontend (si se expone vía API pública)
-- CREATE ROLE portfolio_readonly NOLOGIN;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO portfolio_readonly;

-- Rol de escritura para el backend
-- CREATE ROLE portfolio_app LOGIN PASSWORD 'change_me';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO portfolio_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO portfolio_app;

-- ============================================================================
-- FIN DEL ESQUEMA
-- ============================================================================
