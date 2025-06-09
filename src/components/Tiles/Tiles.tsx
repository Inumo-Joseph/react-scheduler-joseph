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
  tasks,
  parentChildTask,
  alarmClock,
  Users,
  hideCheckedItems,
  subDispatch,
  subEntryActions
}) => {
  const placeTiles = useCallback((): PlacedTiles => {
    let rows = 0;
    return data
      .map((person, personIndex) => {
        if (personIndex > 0) {
          rows += Math.max(data[personIndex - 1].data.length, 1);
        }
        const personData = person.data.map((projectsPerRow, rowIndex) =>
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
              tasks={tasks}
              subDispatch={subDispatch}
              subEntryActions={subEntryActions}
            />
          ))
        );

        return personData;
      })
      .flat(2);
  }, [data, onTileClick, zoom, renderData]);

  return <>{placeTiles()}</>;
};

export default Tiles;
