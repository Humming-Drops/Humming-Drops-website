# System Operations & Engineering Runbooks

**Project:** Humming Drops & MedCity Smiles Web Platform  
**Status:** Authoritative Operational Runbooks  
**Audience:** Software Engineers, DevOps Engineers, On-Call Support, Bangalore Hub Coordinators  

---

## Purpose & Scope

This directory contains standardized, authoritative runbooks defining daily procedures, development workflows, operational verification, incident triage, and deployment lifecycles for the Humming Drops and MedCity Smiles web platform.

---

## Runbook Directory

| Runbook ID | Title | Primary Audience | Scope |
| :--- | :--- | :--- | :--- |
| **[RB-01](local-development.md)** | Local Development & Environment Setup | Frontend / Full-Stack Engineers | Node.js prerequisites, environment variables, local server execution, development workflow |
| **[RB-02](build-and-verification.md)** | Build, Typecheck & Verification Suite | QA / CI-CD / Engineers | Strict TypeScript validation, build generation, automated test scripts, pre-commit checks |
| **[RB-03](lead-operations-handover.md)** | Bangalore Hub Lead Operations & Manual Confirmation | Hub Coordinators / Ops Team | Processing incoming WhatsApp leads, verifying reference codes, customer confirmation, order status transition |
| **[RB-04](incident-management.md)** | Incident Management & Troubleshooting Playbooks | On-Call Engineers / Tech Support | Severity definitions, lead file recovery, payment failure triage, API error diagnostics, disaster recovery |
| **[RB-05](deployment-and-staging.md)** | DevOps, Staging Isolation & Deployment Runbook (HUM-W2-07) | DevOps / Release Engineers | Railway PaaS deployment, multi-stage Dockerfile, staging isolation, secret audit, zero-downtime rollback runbook |

---

## Operational Roles & Escalation Matrix

* **First-Line Customer Support / Hub Operations:**
  * Hub Coordinator (`8618902810` / `hummingdrops@gmail.com`)
  * Hub Location: Berrybeats Cafe, Bangalore
  * Responsibilities: Lead triage, WhatsApp communication, address verification, manual payment confirmation.
* **Technical Lead / On-Call Engineer:**
  * Responsibilities: Build issues, API errors, webhook troubleshooting, database synchronization, security vulnerability remediation.
* **Clinical & Lab Liaison:**
  * MedCity Health Labs Coordinator
  * Responsibilities: Monthly preventative health test scheduling (Blood Sugar, Cholesterol, BP), health package discount vouchers.
