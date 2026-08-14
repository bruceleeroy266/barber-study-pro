# Exam Blueprint Requirements

**Document:** Exam Blueprint Architecture Requirements  
**Last Updated:** 2026-08-14  
**Status:** RESEARCH ONLY — Not authorized for implementation

---

## Overview

This document captures requirements for exam blueprint architecture based on national licensing research. These requirements are NOT authorized for implementation.

---

## Core Entities

### State

| Field | Type | Description |
|-------|------|-------------|
| state_id | UUID | Primary key |
| state_code | VARCHAR(2) | Two-letter state code |
| state_name | VARCHAR(100) | Full state name |
| licensing_board | VARCHAR(200) | State licensing board name |
| board_url | VARCHAR(500) | Board website |

---

### License Type

| Field | Type | Description |
|-------|------|-------------|
| license_id | UUID | Primary key |
| state_id | UUID | Foreign key to State |
| license_name | VARCHAR(100) | e.g., "Barber," "Class A Barber" |
| license_description | TEXT | License description |
| theory_exam_required | BOOLEAN | Theory exam required |
| practical_exam_required | BOOLEAN | Practical exam required |

---

### Exam Developer

| Field | Type | Description |
|-------|------|-------------|
| developer_id | UUID | Primary key |
| developer_name | VARCHAR(100) | e.g., "NIC," "PSI" |
| developer_type | VARCHAR(50) | "National," "State-specific" |
| website | VARCHAR(500) | Developer website |

---

### Exam Administrator

| Field | Type | Description |
|-------|------|-------------|
| administrator_id | UUID | Primary key |
| administrator_name | VARCHAR(100) | e.g., "Prov," "PSI," "Prometric," "DL Roope" |
| administrator_type | VARCHAR(50) | "National," "Regional," "State" |
| website | VARCHAR(500) | Administrator website |

---

### Examination

| Field | Type | Description |
|-------|------|-------------|
| exam_id | UUID | Primary key |
| license_id | UUID | Foreign key to License Type |
| developer_id | UUID | Foreign key to Exam Developer |
| administrator_id | UUID | Foreign key to Exam Administrator |
| exam_name | VARCHAR(200) | e.g., "NIC Barber Styling Theory Examination" |
| exam_type | VARCHAR(50) | "Theory," "Practical" |

---

### Exam Version

| Field | Type | Description |
|-------|------|-------------|
| version_id | UUID | Primary key |
| exam_id | UUID | Foreign key to Examination |
| version_number | VARCHAR(50) | Version identifier |
| effective_date | DATE | Version effective date |
| retirement_date | DATE | Version retirement date (if applicable) |
| cib_url | VARCHAR(500) | CIB document URL |
| cib_version | VARCHAR(50) | CIB version identifier |

---

### Exam Domain

| Field | Type | Description |
|-------|------|-------------|
| domain_id | UUID | Primary key |
| version_id | UUID | Foreign key to Exam Version |
| domain_name | VARCHAR(200) | e.g., "Scientific Concepts" |
| domain_weight | DECIMAL(5,2) | Percentage weight (e.g., 35.00) |
| question_count | INTEGER | Number of questions (if published) |
| display_order | INTEGER | Display order |

---

### Competency

| Field | Type | Description |
|-------|------|-------------|
| competency_id | UUID | Primary key |
| domain_id | UUID | Foreign key to Exam Domain |
| competency_name | VARCHAR(200) | Competency name |
| competency_description | TEXT | Competency description |
| parent_competency_id | UUID | Self-referencing for hierarchy |

---

## Relationships

```
State (1) ───→ (N) License Type
License Type (1) ───→ (N) Examination
Exam Developer (1) ───→ (N) Examination
Exam Administrator (1) ───→ (N) Examination
Examination (1) ───→ (N) Exam Version
Exam Version (1) ───→ (N) Exam Domain
Exam Domain (1) ───→ (N) Competency
```

---

## Key Constraints

### Developer/Administrator Distinction

**Constraint:** Examination must reference both developer and administrator as separate entities.

**Rationale:** These are different roles that must not be collapsed.

**Example:** Oklahoma barber theory exam references NIC (developer) and Prov (administrator) separately.

---

### Versioning

**Constraint:** Student performance must reference specific exam version, not just exam.

**Rationale:** Blueprint changes over time; historical performance must remain anchored to the version it was measured against.

**Implementation:** All student performance records must include version_id.

---

### Weight Validation

**Constraint:** Domain weights for a version must sum to 100%.

**Rationale:** CIB specifies complete exam coverage.

**Validation:** CHECK constraint or application-level validation.

---

## Sample Data (Oklahoma)

### State

```sql
INSERT INTO states (state_code, state_name, licensing_board)
VALUES ('OK', 'Oklahoma', 'Oklahoma State Board of Cosmetology and Barbering');
```

### License Type

```sql
INSERT INTO license_types (state_id, license_name, theory_exam_required, practical_exam_required)
VALUES (@oklahoma_id, 'Barber', true, true);
```

### Exam Developer

```sql
INSERT INTO exam_developers (developer_name, developer_type)
VALUES ('NIC', 'National');
```

### Exam Administrator

```sql
INSERT INTO exam_administrators (administrator_name, administrator_type)
VALUES ('Prov', 'National');
```

### Examination

```sql
INSERT INTO examinations (license_id, developer_id, administrator_id, exam_name, exam_type)
VALUES (@ok_barber_id, @nic_id, @prov_id, 'NIC Barber Styling Theory Examination', 'Theory');
```

### Exam Version

```sql
INSERT INTO exam_versions (exam_id, version_number, effective_date, cib_url)
VALUES (@ok_exam_id, '2024-01', '2024-01-01', 'https://nic.org/cib/barber-styling');
```

### Exam Domains

```sql
INSERT INTO exam_domains (version_id, domain_name, domain_weight, display_order)
VALUES
  (@version_id, 'Scientific Concepts', 35.00, 1),
  (@version_id, 'Implements & Equipment', 10.00, 2),
  (@version_id, 'Hair Care Services', 40.00, 3),
  (@version_id, 'Facial Hair & Skin Care Services', 15.00, 4);
```

---

## Implementation Guardrails

**DO NOT IMPLEMENT:**

- This schema is conceptual only
- No database tables authorized
- No migrations authorized
- No code changes authorized

**Protected Baseline:** `61a8ef8`

---

*Last Updated: 2026-08-14*
