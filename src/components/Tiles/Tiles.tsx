import { FC, useMemo } from "react";
import { SchedulerProjectData } from "@/types/global";
import { Tile } from "..";
import { PlacedTiles, TilesProps } from "./types";

interface FlattenedTile {
  id: string;
  row: number;
  data: SchedulerProjectData;
  /** Whether to hide text on this tile (for crowded recurring tiles) */
  hideText: boolean;
}

const Tiles: FC<TilesProps> = ({
  data,
  zoom,
  onTileClick,
  renderData,
  reportPosition,
  projectData,
  truncateText,
  showToggle,
  showCompleted,
  parentChildTask,
  alarmClock,
  Users,
  handleDragEnd,
  hideCheckedItems,
  onAssignTask,
  form,
  onTileHover,
  tilePositions,
  reccuringIcon,
  canvasRef,
  setClickedTask
}) => {
  // Build recurring map once (memoized)
  // Handle both 1D and 2D data structures
  const recurringMap = useMemo(() => {
    const map = new Map<string, SchedulerProjectData[]>();

    data.forEach((person) => {
      // Check if data is 2D (expected) or 1D (fallback)
      const is2D = Array.isArray(person.data[0]);
      if (is2D) {
        // 2D structure: iterate over rows, then tasks in each row
        (person.data as SchedulerProjectData[][]).forEach((projectsPerRow) => {
          projectsPerRow.forEach((project) => {
            const baseId = project.id.split("-recurring")[0];
            if (!map.has(baseId)) map.set(baseId, []);
            map.get(baseId)!.push(project);
          });
        });
      } else {
        // 1D structure: iterate directly over tasks
        (person.data as unknown as SchedulerProjectData[]).forEach((project) => {
          const baseId = project.id.split("-recurring")[0];
          if (!map.has(baseId)) map.set(baseId, []);
          map.get(baseId)!.push(project);
        });
      }
    });

    return map;
  }, [data]);

  // Sort data once (memoized, doesn't mutate original)
  // Handle both 1D (SchedulerProjectData[]) and 2D (SchedulerProjectData[][]) structures
  
  const sortedData = useMemo(() => {
    return data.map((card) => {
      // Check if card.data is 2D array (expected) or 1D array (fallback)
      const is2D = Array.isArray(card.data[0]);

      if (is2D) {
        // Expected 2D structure
        return {
          ...card,
          data: (card.data as SchedulerProjectData[][]).map((projectArray) =>
            [...projectArray].sort((a, b) => {
              return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            })
          )
        };
      } else {
        // Fallback: 1D structure - wrap in array to make it 2D
        const tasks = card.data as unknown as SchedulerProjectData[];
        return {
          ...card,
          data: [tasks.sort((a, b) => {
            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
          })]
        };
      }
    });
  }, [data]);

  // Determine if recurring tiles should hide text based on zoom and frequency
  // The more zoomed out, the closer tiles appear, so more aggressive hiding is needed
  const shouldHideRecurringText = (
    recurringFrequency: string | undefined,
    tileIndex: number,
    totalInGroup: number
  ): boolean => {
    if (!recurringFrequency) return false;

    const isLastTile = tileIndex === totalInGroup - 1;
    const frequency = recurringFrequency.toLowerCase();

    // Month view (zoom 3) - most zoomed out, tiles are very close
    // Hide text for daily, weekly, and monthly recurring
    if (zoom === 3) {
      if (frequency === "daily" || frequency === "weekly" || frequency === "monthly") {
        return !isLastTile;
      }
    }

    // Week view (zoom 0) - daily and weekly tiles are close
    if (zoom === 0) {
      if (frequency === "daily" || frequency === "weekly") {
        return !isLastTile;
      }
    }

    // Day view (zoom 1) - only daily tiles overlap
    if (zoom === 1) {
      if (frequency === "daily") {
        return !isLastTile;
      }
    }

    // Hour view (zoom 2) - daily tiles are spread out enough
    // No hiding needed

    return false;
  };

  // Flatten tiles for rendering - process each card separately to maintain card boundaries
  // Row indices are cumulative: Card 1 tasks get rows 0-N, Card 2 tasks get rows N+1 onwards
  const flattenedTiles = useMemo((): FlattenedTile[] => {
    const tiles: FlattenedTile[] = [];
    const placedIds = new Set<string>();
    let cumulativeRowOffset = 0;

    // Process each card/person separately to maintain card boundaries
    for (const card of sortedData) {
      let cardRowIndex = 0;

      // Collect tasks for this card only
      const cardTasks: SchedulerProjectData[] = [];
      for (const projectsPerRow of card.data) {
        for (const project of projectsPerRow) {
          cardTasks.push(project);
        }
      }

      // Build parent -> children map for this card's tasks
      const childrenMap = new Map<string, SchedulerProjectData[]>();
      const taskMap = new Map<string, SchedulerProjectData>();

      for (const task of cardTasks) {
        const baseId = task.id.split("-recurring")[0];
        taskMap.set(task.id, task);

        if (task.parentTaskId) {
          const parentBaseId = task.parentTaskId.split("-recurring")[0];
          if (!childrenMap.has(parentBaseId)) {
            childrenMap.set(parentBaseId, []);
          }
          if (!task.id.includes("-recurring") || task.id === baseId) {
            childrenMap.get(parentBaseId)!.push(task);
          }
        }
      }

      // Helper function to place a task and its children recursively within this card
      const placeTaskWithChildren = (task: SchedulerProjectData): void => {
        const baseId = task.id.split("-recurring")[0];

        // Skip if already placed
        if (placedIds.has(task.id) || placedIds.has(baseId)) return;

        // Calculate actual row = card offset + local row within card
        const actualRow = cumulativeRowOffset + cardRowIndex;

        // Handle recurring tasks - place all instances on same row
        if (task.isRecurring) {
          const group = recurringMap.get(baseId) ?? [];
          placedIds.add(baseId);

          const totalInGroup = group.length;
          group.forEach((recurringTask, index) => {
            placedIds.add(recurringTask.id);
            tiles.push({
              id: recurringTask.id,
              row: actualRow,
              data: recurringTask,
              hideText: shouldHideRecurringText(recurringTask.recurring, index, totalInGroup)
            });
          });
          cardRowIndex++;
        } else {
          // Non-recurring task: place on its own row
          placedIds.add(task.id);
          tiles.push({
            id: task.id,
            row: actualRow,
            data: task,
            hideText: false
          });
          cardRowIndex++;
        }

        // Place children directly below parent
        const children = childrenMap.get(baseId) ?? [];
        const sortedChildren = [...children].sort((a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );

        for (const child of sortedChildren) {
          placeTaskWithChildren(child);
        }
      };

      // Find root tasks for this card
      const rootTasks = cardTasks.filter(task => {
        if (task.id.includes("-recurring")) return false;
        if (!task.parentTaskId) return true;
        const parentBaseId = task.parentTaskId.split("-recurring")[0];
        return !taskMap.has(task.parentTaskId) && !taskMap.has(parentBaseId);
      });

      // Sort and place root tasks
      const sortedRoots = [...rootTasks].sort((a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );

      for (const root of sortedRoots) {
        placeTaskWithChildren(root);
      }

      // Handle orphaned tasks
      for (const task of cardTasks) {
        const baseId = task.id.split("-recurring")[0];
        if (!placedIds.has(task.id) && !placedIds.has(baseId)) {
          placeTaskWithChildren(task);
        }
      }

      // Update cumulative offset for next card
      // Use cardRowIndex (actual rows used) or at least 1 row per card
      cumulativeRowOffset += Math.max(cardRowIndex, 1);
    }

    return tiles;
  }, [sortedData, recurringMap, zoom]);

  // Render all tiles (no incremental rendering - needed for position reporting)
  const placeTiles = useMemo((): PlacedTiles => {
    return flattenedTiles.map(({ id, row, data: tileData, hideText }) => (
      <Tile
        key={id}
        row={row}
        data={tileData}
        zoom={zoom}
        renderData={renderData}
        projectData={projectData}
        reportPosition={reportPosition}
        truncateText={truncateText}
        hideRecurringText={hideText}
        setTruncate={showToggle}
        parentChildTask={parentChildTask}
        alarmClock={alarmClock}
        Users={Users}
        hideCheckedItems={hideCheckedItems}
        onAssignTask={onAssignTask}
        form={form}
        reccuringIcon={reccuringIcon}
        tilePositions={tilePositions}
        canvasRef={canvasRef}
        setClickedTask={setClickedTask}
      />
    ));
  }, [
    flattenedTiles,
    zoom,
    renderData,
    projectData,
    reportPosition,
    truncateText,
    showToggle,
    parentChildTask,
    alarmClock,
    Users,
    hideCheckedItems,
    onAssignTask,
    form,
    reccuringIcon,
    tilePositions,
    canvasRef,
    setClickedTask
  ]);

  return <>{placeTiles}</>;
};

export default Tiles;
