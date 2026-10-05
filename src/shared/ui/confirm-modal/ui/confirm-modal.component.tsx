import { type ReactNode, type RefObject, useImperativeHandle, useState } from "react";

import { Button, Modal } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import type { BaseModalHandlers } from "../common/confirm-modal.types";

interface IConfirmModalProps {
  ref: RefObject<BaseModalHandlers | null>;
  title: string;
  children?: ReactNode;
  submitLabel?: string;
  submitColor?: "MainGreen" | "Error" | "Warning";
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  onSubmit(): void;
  onClose?(): void;
}

export const ConfirmModal = (props: IConfirmModalProps) => {
  const { ref, title, children, submitLabel, submitColor = "MainGreen", isLoading, isSubmitDisabled, onSubmit, onClose } = props;
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
    modalState: isOpen,
  }));

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      className="w-full max-w-lg"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variantType="Outlined" colorType="Gray" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button colorType={submitColor} loading={isLoading} disabled={isSubmitDisabled} onClick={onSubmit}>
            {submitLabel ?? t("confirm")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">{children}</div>
    </Modal>
  );
};
