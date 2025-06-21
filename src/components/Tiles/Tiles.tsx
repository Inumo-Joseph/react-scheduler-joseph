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
    let globalRowIndex = 0;

    return data
      .map((person, personIndex) => {
        const personData = !showCompleted
          ? person.data.map((projectsPerRow, rowIndex) =>
              projectsPerRow.map((project) => {
                const tile = (
                  <Tile
                    key={project.id}
                    row={globalRowIndex} // Use unique global row index
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
                );
                globalRowIndex++; // Increment for each tile
                return tile;
              })
            )
          : person.data.map((projectsPerRow, rowIndex) =>
              projectsPerRow
                .filter((projects) => !projects.isCompleted)
                .map((project) => {
                  const tile = (
                    <Tile
                      key={project.id}
                      row={globalRowIndex} // Use unique global row index
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
                  );
                  globalRowIndex++; // Increment for each tile
                  return tile;
                })
            );

        return personData;
      })
      .flat(2);
  }, [data, onTileClick, zoom, renderData, showCompleted]);

  return <>{placeTiles()}</>;
};

export default Tiles;
