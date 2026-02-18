# Implementation Plan: Inventory Management Core

**Branch**: `001-inventory-management` | **Date**: 2026-02-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-inventory-management/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a Next.js + NestJS inventory module that keeps transaction state in memory while enforcing
non-negative stock and deterministic weighted-average-cost realized P/L. The plan prioritizes
chronological recomputation after historical edits/deletes, CSV-driven automated tests, and clear
contracts for transaction CRUD plus product summary retrieval.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x on Node.js 20 LTS  
**Primary Dependencies**: Next.js 15 (App Router), NestJS 11, class-validator, class-transformer  
**Storage**: In-memory state for core logic (no persistent DB in this feature scope)  
**Testing**: Vitest/Jest for unit tests + CSV-driven scenario tests for domain rules  
**Target Platform**: Web application (server-side API + browser client)
**Project Type**: Web (frontend + backend)  
**Performance Goals**: Summary query under 500 ms for products with up to 10,000 transactions in-memory  
**Constraints**: Deterministic recomputation, no negative stock states, stable rounding policy to 2 decimals  
**Scale/Scope**: Single-tenant module MVP, up to 100 products and 100,000 total transactions in memory

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Ledger integrity gate: all create/update/delete operations must reject any negative-stock timeline.
- ✅ Deterministic finance gate: weighted-average-cost P/L and rounding policy are fixed and testable.
- ✅ Edit safety gate: historical mutation requires recomputation from earliest impacted event.
- ✅ Testability gate: in-memory state includes clear/reset and CSV-driven scenario test support.
- ✅ ERP evolution gate: boundaries keep core domain logic storage-agnostic for future persistence.

Post-Phase-1 re-check status: PASS (design artifacts preserve all gates).

## Project Structure

### Documentation (this feature)

```text
specs/001-inventory-management/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/
├── src/
│   ├── inventory/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── inventory.controller.ts
│   │   ├── inventory.service.ts
│   │   └── inventory.module.ts
│   └── main.ts
└── tests/
  ├── unit/
  └── integration/

frontend/
├── src/
│   ├── app/
│   │   └── inventory/
│   ├── components/
│   └── lib/
└── tests/
  └── unit/

tests/
└── csv/
  ├── transactions-valid.csv
  └── transactions-invalid.csv
```

**Structure Decision**: Use a web split (`frontend` + `backend`) to align with explicit
Next.js + NestJS requirement while keeping pure inventory domain logic isolated and reusable.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

