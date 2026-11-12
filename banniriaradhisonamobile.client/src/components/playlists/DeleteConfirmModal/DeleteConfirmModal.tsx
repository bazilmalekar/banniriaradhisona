import React from "react";
import type { Playlist } from "../../../services/Slices/playlistSlice";

interface DeleteConfirmModalProps {
    showDeleteConfirm: boolean;
    playlistData: Playlist | null;
    setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeletePlaylist: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    showDeleteConfirm,
    playlistData,
    setShowDeleteConfirm,
    handleDeletePlaylist
}) => {
    return (
        <>
            {showDeleteConfirm && playlistData && (
                <div
                    className="
                        fixed inset-0 z-[10000]
                        flex items-center justify-center
                        bg-black/35 p-4
                        backdrop-blur-[3px]
                    "
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-playlist-title"
                        className="
                            w-full max-w-sm rounded-2xl
                            border border-[#DCEBF0]/80
                            bg-white p-5 shadow-xl
                            dark:border-white/10
                            dark:bg-[#1D303A]
                        "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2
                            id="delete-playlist-title"
                            className="text-lg font-bold text-[#304B68] dark:text-[#E3EEF4]"
                        >
                            Delete playlist?
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-[#526871] dark:text-[#A9C0CC]">
                            Are you sure you want to delete
                            {" "}<strong>{playlistData.playlistName}</strong>?
                            This action cannot be undone. Your songs and downloads will not be deleted.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn ara-btn-secondary rounded-xl px-4 py-2.5 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeletePlaylist}
                                className="
                                    rounded-xl bg-red-600 px-4 py-2.5
                                    font-semibold text-white
                                    transition-colors hover:bg-red-700
                                "
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeleteConfirmModal;