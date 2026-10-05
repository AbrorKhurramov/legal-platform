import { useRef, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { ROUTES } from "@/shared/const/route-const";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { type BaseModalHandlers, ConfirmModal } from "@/shared/ui/confirm-modal/confirm-modal.entry";
import { Icon } from "@/shared/ui/icon/icon.entry";

import { authApi, authApiQueryKeys, logout } from "@/entities/auth/auth.entry";
import { RoleTag, UserAvatar, clearUser, useCurrentUser } from "@/entities/user/user.entry";

export const UserMenu = () => {
  const { t } = useTranslation("common");
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const resetModalRef = useRef<BaseModalHandlers>(null);

  const finishSession = () => {
    dispatch(logout());
    dispatch(clearUser());
    queryClient.clear();
    navigate(ROUTES.login, { replace: true });
  };

  const { mutate: sendLogout } = useMutation({
    mutationFn: authApi.createLogout,
    mutationKey: authApiQueryKeys.getKey("createLogout"),
    onSettled: finishSession,
  });

  const { mutate: resetDemo, isPending: isResetting } = useMutation({
    mutationFn: authApi.createDemoReset,
    mutationKey: authApiQueryKeys.getKey("createDemoReset"),
    onSuccess: () => {
      resetModalRef.current?.closeModal();
      finishSession();
    },
  });

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prevState) => !prevState)}
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-greyscale-200"
      >
        <UserAvatar fullName={user.fullName} />
        <span className="hidden text-left md:block">
          <span className="block text-sm font-semibold text-greyscale-900">{user.fullName}</span>
          <span className="block max-w-56 truncate text-xs text-greyscale-500">{user.position}</span>
        </span>
        <Icon name="chevron-down" className="size-4 text-greyscale-500" />
      </button>
      {isOpen && (
        <>
          <button type="button" aria-label={t("close")} className="fixed inset-0 z-30 cursor-default" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 z-40 mt-2 w-72 rounded-2xl border border-greyscale-300 bg-white p-2 shadow-lg">
            <div className="flex flex-col gap-1 border-b border-greyscale-300 px-3 pt-2 pb-3">
              <span className="text-sm font-semibold text-greyscale-900">{user.fullName}</span>
              <span className="text-xs text-greyscale-500">{`${user.position} · ${user.branch.name}`}</span>
              <span className="mt-1">
                <RoleTag role={user.role} />
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                resetModalRef.current?.openModal();
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-greyscale-700 hover:bg-greyscale-100"
            >
              <Icon name="refresh" className="size-4" />
              {t("header.resetDemo")}
            </button>
            <button
              type="button"
              onClick={() => sendLogout()}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error-500 hover:bg-error-50"
            >
              <Icon name="logout" className="size-4" />
              {t("header.logout")}
            </button>
          </div>
        </>
      )}
      <ConfirmModal ref={resetModalRef} title={t("header.resetDemo")} submitColor="Warning" isLoading={isResetting} onSubmit={() => resetDemo()}>
        <p className="text-sm text-greyscale-700">{t("header.resetDemoConfirm")}</p>
      </ConfirmModal>
    </div>
  );
};
