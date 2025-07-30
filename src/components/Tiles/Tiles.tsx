import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SchedulerProjectData } from "@/types/global";
import { Tile } from "..";
import { PlacedTiles, TilesProps } from "./types";

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
  hideCheckedItems,
  onAssignTask,
  form,
  onTileHover,
  tilePositions,
  reccuringIcon,
  canvasRef,
  setClickedTask
}) => {
  const recurringMap = new Map<string, SchedulerProjectData[]>();

  data.forEach((person) => {
    person.data.forEach((projectsPerRow) => {
      projectsPerRow.forEach((project) => {
        const baseId = project.id.split("-recurring")[0];
        if (!recurringMap.has(baseId)) recurringMap.set(baseId, []);
        recurringMap.get(baseId)!.push(project);
      });
    });
  });

  const flattenedTiles = useMemo(() => {
    let globalRowIndex = 0;
    const placedIds = new Set<string>();
    const tiles: Array<{
      id: string;
      row: number;
      data: SchedulerProjectData;
    }> = [];

    for (const person of data) {
      for (const projectsPerRow of person.data) {
        for (const project of projectsPerRow) {
          const baseId = project.id.split("-recurring")[0];

          if (project.isRecurring && !placedIds.has(baseId)) {
            const group = recurringMap.get(baseId) ?? [];
            placedIds.add(baseId);

            // Add all recurring tasks at once
            for (const task of group) {
              placedIds.add(task.id);
              tiles.push({
                id: task.id,
                row: globalRowIndex,
                data: task
              });
            }
            globalRowIndex++;
          } else if (!placedIds.has(project.id)) {
            placedIds.add(project.id);
            tiles.push({
              id: project.id,
              row: globalRowIndex,
              data: project
            });
            globalRowIndex++;
          }
        }
      }
    }

    return tiles;
  }, [data, recurringMap]); // Only recompute when data actually changes

  const placeTiles = useMemo((): PlacedTiles => {
    return flattenedTiles.map(({ id, row, data: tileData }) => (
      <Tile
        key={id}
        row={row}
        data={tileData}
        zoom={zoom}
        renderData={renderData}
        projectData={projectData}
        reportPosition={reportPosition}
        truncateText={truncateText}
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
  }, [flattenedTiles, zoom, renderData, tilePositions, canvasRef, showCompleted, setClickedTask]);

  return <>{placeTiles}</>;
};

export default Tiles;
