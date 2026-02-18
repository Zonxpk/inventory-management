# Tasks: Inventory Management Core

**Input**: Design documents from `/specs/001-inventory-management/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: CSV-driven and contract tests are required by the specification.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`) used only in story phases
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Next.js + NestJS workspace structure and test scaffolding.

- [ ] T001 Initialize NestJS backend project manifest in `backend/package.json`
- [ ] T002 Initialize Next.js frontend project manifest in `frontend/package.json`
- [ ] T003 [P] Configure backend TypeScript compiler options in `backend/tsconfig.json`
- [ ] T004 [P] Configure frontend TypeScript compiler options in `frontend/tsconfig.json`
- [ ] T005 [P] Add root workspace scripts and shared commands in `package.json`
- [ ] T006 Create CSV fixture directory and placeholder files in `tests/csv/transactions-valid.csv`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared inventory domain infrastructure that blocks all user stories.

**⚠️ CRITICAL**: No user story implementation begins until this phase is complete.

- [ ] T007 Define inventory domain types in `backend/src/inventory/entities/transaction.types.ts`
- [ ] T008 [P] Implement decimal-safe money utilities in `backend/src/inventory/utils/money.ts`
- [ ] T009 [P] Implement deterministic timeline sorting utility in `backend/src/inventory/utils/timeline-sort.ts`
- [ ] T010 [P] Implement in-memory inventory state store in `backend/src/inventory/inventory.state.ts`
- [ ] T011 Implement ledger recomputation engine in `backend/src/inventory/services/ledger-recompute.service.ts`
- [ ] T012 Implement domain error classes for stock validation in `backend/src/inventory/errors/inventory.errors.ts`
- [ ] T013 Wire inventory module and providers in `backend/src/inventory/inventory.module.ts`
- [ ] T014 Create CSV scenario test runner utility in `backend/tests/helpers/csv-scenario-runner.ts`

**Checkpoint**: Foundation ready; user stories can now be implemented.

---

## Phase 3: User Story 1 - Record inventory movements (Priority: P1) 🎯 MVP

**Goal**: Users can create BUY/SELL transactions and retrieve transaction details with negative-stock prevention.

**Independent Test**: Execute US1 contract + CSV tests and verify create/get flows and rejection of oversell operations.

### Tests for User Story 1

- [ ] T015 [P] [US1] Add contract tests for `POST /transactions` and `GET /transactions/{id}` in `backend/tests/contract/transactions.create-get.contract.spec.ts`
- [ ] T016 [P] [US1] Add CSV scenario tests for BUY/SELL and negative-stock rejection in `backend/tests/integration/inventory-us1.csv.spec.ts`

### Implementation for User Story 1

- [ ] T017 [US1] Implement create transaction DTO in `backend/src/inventory/dto/create-transaction.dto.ts`
- [ ] T018 [US1] Implement transaction detail response DTO in `backend/src/inventory/dto/transaction-detail.dto.ts`
- [ ] T019 [US1] Implement `addTransaction` and `getTransaction` service logic in `backend/src/inventory/inventory.service.ts`
- [ ] T020 [US1] Implement create/get controller handlers in `backend/src/inventory/inventory.controller.ts`
- [ ] T021 [US1] Implement backend bootstrap and validation pipe setup in `backend/src/main.ts`
- [ ] T022 [US1] Implement frontend inventory API client create/get methods in `frontend/src/lib/inventory-api.ts`
- [ ] T023 [US1] Build transaction entry page for create/get interactions in `frontend/src/app/inventory/page.tsx`
- [ ] T024 [US1] Add transaction form component with user-facing validation errors in `frontend/src/components/inventory-transaction-form.tsx`

**Checkpoint**: User Story 1 is independently functional and testable (MVP).

---

## Phase 4: User Story 2 - Correct historical transaction data (Priority: P2)

**Goal**: Users can update/delete historical transactions with deterministic full recomputation and invariant safety.

**Independent Test**: Execute US2 contract + CSV tests and verify rejected invalid edits plus consistent downstream recalculation.

### Tests for User Story 2

- [ ] T025 [P] [US2] Add contract tests for `PATCH /transactions/{id}` and `DELETE /transactions/{id}` in `backend/tests/contract/transactions.update-delete.contract.spec.ts`
- [ ] T026 [P] [US2] Add CSV recomputation regression tests for historical edits/deletes in `backend/tests/integration/inventory-us2-recompute.csv.spec.ts`

### Implementation for User Story 2

- [ ] T027 [US2] Implement update transaction DTO in `backend/src/inventory/dto/update-transaction.dto.ts`
- [ ] T028 [US2] Implement `updateTransaction` and `deleteTransaction` recomputation logic in `backend/src/inventory/inventory.service.ts`
- [ ] T029 [US2] Implement update/delete controller handlers in `backend/src/inventory/inventory.controller.ts`
- [ ] T030 [US2] Add transaction row actions component for edit/delete in `frontend/src/components/transaction-row-actions.tsx`
- [ ] T031 [US2] Integrate edit/delete UX flow on inventory page in `frontend/src/app/inventory/page.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently with historical correction support.

---

## Phase 5: User Story 3 - Review product summary and monthly performance (Priority: P3)

**Goal**: Managers can retrieve per-product summary metrics and realized P/L details.

**Independent Test**: Execute US3 contract + CSV tests and verify current stock, latest-month metrics, and per-sell realized P/L values.

### Tests for User Story 3

- [ ] T032 [P] [US3] Add contract tests for `GET /products/{productName}/summary` in `backend/tests/contract/products.summary.contract.spec.ts`
- [ ] T033 [P] [US3] Add CSV tests for monthly aggregation and realized P/L accuracy in `backend/tests/integration/inventory-us3-summary.csv.spec.ts`

### Implementation for User Story 3

- [ ] T034 [US3] Implement product summary projection service in `backend/src/inventory/services/product-summary.service.ts`
- [ ] T035 [US3] Implement `getProductSummary` service orchestration in `backend/src/inventory/inventory.service.ts`
- [ ] T036 [US3] Implement summary controller handler in `backend/src/inventory/inventory.controller.ts`
- [ ] T037 [US3] Implement product summary API client method in `frontend/src/lib/inventory-api.ts`
- [ ] T038 [US3] Build product summary panel component in `frontend/src/components/product-summary-panel.tsx`
- [ ] T039 [US3] Render transaction table with realized P/L in `frontend/src/components/transaction-table.tsx`
- [ ] T040 [US3] Integrate summary query and display flow in `frontend/src/app/inventory/page.tsx`

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, design deliverables, and end-to-end validation.

- [ ] T041 [P] Document high-level architecture, database design, concurrency control, and edit-handling strategy in `docs/inventory-system-design.md`
- [ ] T042 [P] Add end-to-end quickstart validation script in `scripts/validate-inventory-quickstart.ps1`
- [ ] T043 Add backend test and lint scripts for CI execution in `backend/package.json`
- [ ] T044 Add frontend test and lint scripts for CI execution in `frontend/package.json`
- [ ] T045 Run and document quickstart verification results in `specs/001-inventory-management/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3+ (User Stories)**: Depend on Phase 2 completion.
- **Phase 6 (Polish)**: Depends on completion of targeted user stories.

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational phase; forms MVP.
- **US2 (P2)**: Depends on Foundational; uses US1 transaction primitives but remains independently testable with seeded data.
- **US3 (P3)**: Depends on Foundational and transaction primitives from US1; independently testable with fixture transactions.

### Within Each User Story

- Tests MUST be written before implementation and fail first.
- DTO/types before service logic.
- Service logic before controller/API integration.
- Backend integration before frontend wiring.

---

## Parallel Execution Examples

### User Story 1

```bash
Task T015 and Task T016 can run in parallel.
```

### User Story 2

```bash
Task T025 and Task T026 can run in parallel.
```

### User Story 3

```bash
Task T032 and Task T033 can run in parallel.
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Complete all US1 tasks (T015-T024).
3. Validate US1 independently via contract + CSV tests.
4. Demo/deploy MVP behavior.

### Incremental Delivery

1. Deliver US1 (transaction creation/retrieval).
2. Deliver US2 (historical edit/delete recomputation).
3. Deliver US3 (summary + monthly profitability).
4. Run polish tasks for documentation and CI scripts.

### Parallel Team Strategy

1. Team finishes Setup + Foundational together.
2. Backend/frontend engineers split by story after phase gate.
3. Contract/CSV tests proceed in parallel with implementation where marked `[P]`.

---

## Notes

- All tasks follow strict checklist format with Task ID, optional `[P]`, optional `[US#]`, and file path.
- No setup/foundational/polish task includes a story label by design.
- Story phases include only story-labeled tasks for traceable incremental delivery.