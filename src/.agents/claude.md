---
description: A forked custom react scheduler based on Bitnoise React Scheduler https://github.com/Bitnoise/react-scheduler
---

# React Scheduler Project — Claude Context

## Project Purpose

This project is a **customized React Scheduler / Gantt-style timeline** built on top of **@bitnoi.se/react-scheduler**. It is used to visualize project tasks over time with support for:

- Hierarchical tasks (parent → child)
- Task dependencies (arrows between tasks)
- Zooming & horizontal scrolling
- Custom tile rendering
- Large datasets (pagination + virtualization)

This is **not** a greenfield project. The scheduler is deeply integrated into an existing platform and must respect existing data shapes and performance constraints.

---

## Core Constraints (Important)

- **React version**: legacy-compatible (hooks available, no concurrent features)
- **TypeScript**: strict typing is required
- **Performance-sensitive**: can render hundreds or thousands of tasks
- **Canvas + DOM hybrid rendering**
- **Must not rewrite scheduler internals unless explicitly requested**

Do NOT:

- Suggest replacing the scheduler library
- Suggest upgrading React unless explicitly asked
- Assume flat task data

---

## Data Model (Critical)

### PaginatedSchedulerData

```ts
export type PaginatedSchedulerData = PaginatedSchedulerRow[];

export type PaginatedSchedulerRow = {
  id: string;
  label: SchedulerRowLabel;
  data: SchedulerProjectData[][]; // grouped tasks per row
};
```

Key notes:

- `data` is **2D**: groups of tasks per row
- Each inner array represents tasks rendered on the same horizontal lane
- This structure is required by upstream pagination + virtualization logic

### SchedulerProjectData (Task)

Each task contains:

- `id`
- `startDate` / `endDate`
- `dependency?: string[]` (task IDs)
- `parentChildTask?: boolean`
- `completed?: boolean`
- `assignedUsers?: User[]`
- `recurring?: boolean`

Dependencies are drawn as arrows.

---

## Major Custom Components

### 1. `GanttChartDisplay`

**Role:**
Top-level scheduler container.

Responsibilities:

- Transforms board-style data (lists + cards) into `PaginatedSchedulerData`
- Controls zoom level
- Passes task dependency info downstream
- Owns scroll + zoom state

Do NOT:

- Add rendering logic here
- Mutate scheduler data in-place

---

### 2. `Grid.tsx`

**Role:**
Canvas-based background grid + dependency arrows.

Responsibilities:

- Draw vertical time grid
- Draw dependency arrows between tasks
- React to scroll & zoom

Important notes:

- Uses `canvasRef`
- Must recalculate arrow positions on:

  - scroll
  - zoom
  - data changes

Known pain points:

- Arrows can desync if scroll events aren’t forwarded
- Canvas must be manually cleared and redrawn

---

### 3. `Tiles.tsx`

**Role:**
Custom task tile renderer.

Signature:

```ts
const Tiles: React.FC<TilesProps>;
```

**Must return JSX** — returning `void` breaks React typing.

Responsibilities:

- Render individual task blocks
- Display:

  - title (with truncation)
  - assigned users
  - completion state
  - recurring icon
  - alarm/clock icon

- Handle:

  - click
  - hover
  - drag end

Props include:

- `zoom`
- `onTileClick`
- `onTileHover`
- `tilePositions`
- `canvasRef`

DO NOT:

- Do canvas drawing here
- Mutate task data

---

### 4. Virtualization Layer (react-window)

**Why it exists:**
Rendering all rows at once caused severe performance issues.

Used for:

- Vertical virtualization of scheduler rows

Key rules:

- Row height must be deterministic
- Scheduler rows are NOT simple lists — virtualization must respect row grouping
- Canvas overlays must sync with virtualized DOM rows

Common failure mode:

- Blank screen or 504 errors when virtualization mismatches data shape

---

## Dependency Arrows

- Defined by `dependency` field on tasks
- Drawn in `Grid.tsx`
- Require accurate DOM → canvas position mapping

If arrows don’t update:

- Check scroll listeners
- Check zoom scaling
- Ensure `tilePositions` is recalculated

---

## Known Errors & What They Mean

### ❌ `Type '() => void' is not assignable to FC`

Cause:

- Component does not return JSX

Fix:

- Ensure `return (...)` exists

---

### ❌ 504 / react-window / blank render

Cause:

- Infinite render loop
- Virtualization row count mismatch

Fix:

- Validate `PaginatedSchedulerData`
- Log row sizes

---

### ❌ Arrows misaligned on scroll

Cause:

- Canvas not redrawing

Fix:

- Forward scroll position to `Grid.tsx`

---

## Styling & UX Rules

- No inline styles for layout-critical sizing
- Zoom affects width, NOT height
- Text truncation must be deterministic

---

## What Claude _Should_ Do

- Respect existing data structures
- Make **incremental fixes**
- Explain _why_ a bug happens
- Ask before refactoring core scheduler logic

## What Claude Should NOT Do

- Rewrite scheduler internals
- Flatten task data
- Replace canvas with SVG
- Suggest modern React features unless asked

---

## Mental Model Summary

Think of this project as:

> **A canvas-driven Gantt chart with virtualized rows and custom DOM tiles, glued together by strict data contracts.**

If something breaks, it’s usually:

1. Data shape mismatch
2. Canvas ↔ DOM desync
3. Virtualization assumptions violated

---

End of context.
