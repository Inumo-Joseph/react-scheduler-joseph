import { FC, memo } from "react";
import { Popup } from "semantic-ui-react";
import { TileProps } from "./types";
import { useTileLogic } from "./useTileLogic";
import TileDeleteModal from "./TileDeleteModal";
import TilePopupContent from "./TilePopupContent";
import { StyledStickyWrapper, StyledTextWrapper, StyledTileWrapper } from "./styles";
import "semantic-ui-css/semantic.min.css";

const Tile: FC<TileProps> = memo(
  ({
    row,
    data,
    renderData,
    reportPosition,
    truncateText,
    hideRecurringText,
    parentChildTask,
    alarmClock,
    Users,
    onAssignTask,
    form,
    reccuringIcon,
    setClickedTask
  }) => {
    const {
      // State
      popupOpen,
      isModalOpen,
      addTaskDate,
      addTaskMonth,

      // Setters
      setAddTaskDate,
      setAddTaskMonth,
      setSelectedTask,

      // Computed
      actualTruncate,
      tileStyle,

      // Drag & Drop
      attributes,
      listeners,
      isDragging,
      isOver,
      combinedRef,

      // Handlers
      handleMouseEnter,
      handleMouseLeavePopup,
      handleTaskToggle,
      openModal,
      closeModal
    } = useTileLogic({
      row,
      data,
      reportPosition,
      truncateText,
      hideRecurringText,
      onAssignTask,
      form
    });

    const handleConfirmDelete = () => {
      closeModal();
      setClickedTask?.(data);
    };

    return (
      <>
        <div
          style={{ pointerEvents: isDragging || isOver ? "none" : "auto" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeavePopup}>
          <Popup
            open={popupOpen}
            size="mini"
            position="top left"
            on="hover"
            content={
              <div style={{ color: "black", display: "flex" }} className="pt-1 pl-1">
                <TilePopupContent
                  data={data}
                  isCompleted={data.isCompleted || false}
                  onTaskToggle={handleTaskToggle}
                  parentChildTask={parentChildTask}
                  reccuringIcon={reccuringIcon}
                  alarmClock={alarmClock}
                  Users={Users}
                  form={form}
                  addTaskMonth={addTaskMonth}
                  addTaskDate={addTaskDate}
                  setAddTaskMonth={setAddTaskMonth}
                  setAddTaskDate={setAddTaskDate}
                  setSelectedTask={setSelectedTask}
                />
                <div onClick={openModal}>{renderData}</div>
                <TileDeleteModal
                  isOpen={isModalOpen}
                  taskName={data.name}
                  onConfirm={handleConfirmDelete}
                  onCancel={closeModal}
                />
              </div>
            }
            trigger={
              <StyledTileWrapper ref={combinedRef} {...attributes} {...listeners} style={tileStyle}>
                <StyledTextWrapper>
                  <StyledStickyWrapper $allowOverflow={actualTruncate}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {Users?.({ form: form, task: data })}
                      <span
                        style={{
                          ...(!actualTruncate && {
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                          })
                        }}>
                        {data.name}
                      </span>
                    </div>
                  </StyledStickyWrapper>
                </StyledTextWrapper>
              </StyledTileWrapper>
            }
          />
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data.id === nextProps.data.id &&
      prevProps.data.name === nextProps.data.name &&
      prevProps.data.startDate === nextProps.data.startDate &&
      prevProps.data.dueDate === nextProps.data.dueDate &&
      prevProps.data.bgColor === nextProps.data.bgColor &&
      prevProps.data.isCompleted === nextProps.data.isCompleted &&
      prevProps.data.isRecurring === nextProps.data.isRecurring &&
      prevProps.data.recurring === nextProps.data.recurring &&
      prevProps.row === nextProps.row &&
      prevProps.truncateText === nextProps.truncateText &&
      prevProps.hideRecurringText === nextProps.hideRecurringText
    );
  }
);

Tile.displayName = "Tile";

export default Tile;
