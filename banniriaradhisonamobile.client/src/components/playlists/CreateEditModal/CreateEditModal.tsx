import React from "react";

interface CreateEditModalProps {
    showCreateModal: boolean;
    closeModal: () => void;
    isEditMode: boolean;
    EditPlaylistStatus: "success" | "idle" | "loading" | "failed";
    handleCreatePlaylist: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
    playlistName: string;
    setPlaylistName: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const CreateEditModal: React.FC<CreateEditModalProps> = ({
    showCreateModal,
    closeModal,
    isEditMode,
    EditPlaylistStatus,
    handleCreatePlaylist,
    playlistName,
    setPlaylistName,
    error,
    setError
}) => {
    return (
        <>
            {showCreateModal && (
                <div
                    className="
                        fixed inset-0 z-[9999]
                        flex items-center justify-center
                        bg-black/30 backdrop-blur-[2px] p-4
                        playlist-backdrop-enter
                    "
                    onClick={closeModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-playlist-title"
                        onClick={(e) => e.stopPropagation()}
                        className="
                            playlist-modal-enter
                            w-full max-w-md rounded-2xl
                            border border-[#DCEBF0]/80
                            bg-white p-5 shadow-xl
                            dark:border-white/10
                            dark:bg-[#1D303A]
                        "
                    >
                        {isEditMode && EditPlaylistStatus === "success" ? (
                            /* Edit success screen */
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="
                                    mb-4 flex size-16 items-center justify-center
                                    rounded-full bg-green-100
                                    dark:bg-green-500/15
                                ">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        className="text-green-600 dark:text-green-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m5 12 4 4L19 6"
                                        />
                                    </svg>
                                </div>

                                <h2 className="text-xl font-bold text-[#304B68] dark:text-[#E3EEF4]">
                                    Playlist Updated!
                                </h2>

                                <p className="mt-2 text-sm text-[#526871] dark:text-[#A9C0CC]">
                                    Your playlist has been updated successfully.
                                </p>
                            </div>
                        ) : (
                            /* Create / Edit form */
                            <>
                                <h2
                                    id="create-playlist-title"
                                    className="
                                        text-xl font-bold
                                        text-[#304B68] dark:text-[#E3EEF4]
                                    "
                                >
                                    {isEditMode ? "Edit Playlist" : "Create Playlist"}
                                </h2>

                                <form
                                    onSubmit={handleCreatePlaylist}
                                    className="mt-5 space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="playlistName"
                                            className="
                                                mb-2 block text-sm font-medium
                                                text-[#526871] dark:text-[#A9C0CC]
                                            "
                                        >
                                            Playlist name
                                        </label>

                                        <input
                                            id="playlistName"
                                            type="text"
                                            autoFocus
                                            maxLength={60}
                                            value={playlistName}
                                            onChange={(e) => {
                                                setPlaylistName(e.target.value);
                                                setError("");
                                            }}
                                            placeholder="Enter playlist name"
                                            className="
                                                w-full rounded-xl
                                                border border-[#C8DFDB]
                                                bg-white px-4 py-3
                                                text-[#263B45] outline-none
                                                placeholder:text-[#8298B1]
                                                focus:border-[#3368A0]
                                                focus:ring-2 focus:ring-[#3368A0]/20
                                                dark:border-white/10
                                                dark:bg-[#263F4B]
                                                dark:text-[#E3EEF4]
                                            "
                                        />

                                        {error && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="btn ara-btn-secondary rounded-xl px-4 py-2.5 font-medium"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn ara-btn-primary rounded-xl px-4 py-2.5 font-medium"
                                        >
                                            {isEditMode ? "Save Changes" : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateEditModal;