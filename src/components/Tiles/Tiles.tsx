import { FC, useCallback, useEffect, useRef, useState } from "react";
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
  handleDragEnd
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

  const placeTiles = useCallback((): PlacedTiles => {
    let globalRowIndex = 0;
    const placedIds = new Set<string>(); // ✅ track rendered IDs

    return data
      .map((person) => {
        return person.data.map((projectsPerRow) => {
          return projectsPerRow.flatMap((project) => {
            const baseId = project.id.split("-recurring")[0];

            if (project.isRecurring && !placedIds.has(baseId)) {
              const group = recurringMap.get(baseId) ?? [];
              placedIds.add(baseId);

              group.forEach((task) => placedIds.add(task.id));

              const tiles = group.map((task) => (
                <Tile
                  key={task.id}
                  row={globalRowIndex}
                  data={task}
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
                  tilePositions={tilePositions}
                  canvasRef={canvasRef}
                  handleDragEnd={handleDragEnd}
                />
              ));
              globalRowIndex++; // only once for the whole group
              return tiles;
            }

            // if this task is not part of recurring or we already handled it
            if (!placedIds.has(project.id)) {
              placedIds.add(project.id);
              const tile = (
                <Tile
                  key={project.id}
                  row={globalRowIndex}
                  data={project}
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
                  handleDragEnd={handleDragEnd}
                />
              );
              globalRowIndex++;
              return tile;
            }

            return null; // skip duplicates
          });
        });
      })
      .flat(2)
      .filter(Boolean) as React.ReactElement[]; // remove nulls;dr
  }, [data, onTileClick, zoom, renderData, showCompleted]);

  return <>{placeTiles()}</>;
};

export default Tiles;
