import { FC, memo } from "react";
import { Button, Modal } from "semantic-ui-react";

interface TileDeleteModalProps {
  isOpen: boolean;
  taskName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const TileDeleteModal: FC<TileDeleteModalProps> = memo(
  ({ isOpen, taskName, onConfirm, onCancel }) => {
    return (
      <Modal
        open={isOpen}
        size="mini"
        onClose={onCancel}
        closeOnDimmerClick={true}
        dimmer={{ style: { backgroundColor: "rgba(0,0,0,0.1)" } }}>
        <Modal.Content>
          {`Do you want to delete [${taskName}]? This action cannot be undone.`}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onCancel}>No</Button>
          <Button negative onClick={onConfirm}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
);

TileDeleteModal.displayName = "TileDeleteModal";

export default TileDeleteModal;
