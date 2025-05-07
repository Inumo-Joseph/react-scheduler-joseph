import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Tile } from "..";
import { PlacedTiles, TilesProps } from "./types";

const Tiles: FC<TilesProps> = ({
  data,
  zoom,
  onTileClick,
  onTileHover,
  renderData,
  reportPosition,
  projectData,
  isHidden,
  setIsHidden
}) => {
  console.log("IsHidden in Tiles ---", isHidden);

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
              isHidden={isHidden}
              setIsHidden={setIsHidden}
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
