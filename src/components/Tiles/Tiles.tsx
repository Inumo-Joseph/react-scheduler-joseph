import { FC, useCallback, useEffect, useRef, useState } from "react";
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
  tilePositions
}) => {
  const placeTiles = useCallback((): PlacedTiles => {
    let rows = 0;
    return data
      .map((person, personIndex) => {
        if (personIndex > 0) {
          rows += Math.max(data[personIndex - 1].data.length, 1);
        }
        const personData = !showCompleted
          ? person.data.map((projectsPerRow, rowIndex) =>
              projectsPerRow.map((project) => (
                <Tile
                  key={project.id}
                  row={rowIndex + rows}
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
                  tilePositions={tilePositions}
                />
              ))
            )
          : person.data.map((projectsPerRow, rowIndex) =>
              projectsPerRow
                .filter((projects) => !projects.isCompleted)
                .map((project) => (
                  <Tile
                    key={project.id}
                    row={rowIndex + rows}
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
                    tilePositions={tilePositions}
                  />
                ))
            );

        return personData;
      })
      .flat(2);
  }, [data, onTileClick, zoom, renderData, showCompleted]);

  return <>{placeTiles()}</>;
};

export default Tiles;
