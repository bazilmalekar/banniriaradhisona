
import React, { useEffect, useId, useState } from "react";
import "./playlist.css";
import { useAppDispatch, useAppSelector } from "../../services/hooks";
import { createPlaylist, deletePlaylist, editPlaylist, getPlaylist, resetEditPlaylistStatus, type Playlist } from "../../services/Slices/playlistSlice";
import type { RootState } from "../../services/store";
import PlaylistListSkeleton from "../../shared/SkeletonLoading/PlaylistListSkeleton";
import ActionBottomSheet from "../../shared/ActionBottomSheet/ActionBottomSheet";
import CreateEditModal from "../../components/playlists/CreateEditModal/CreateEditModal";
import DeleteConfirmModal from "../../components/playlists/DeleteConfirmModal/DeleteConfirmModal";

const playlistColors = [
    {
        key: "blue",
        accent: "#2680B8",
    },
    {
        key: "sage",
        accent: "#739D7B",
    },
    {
        key: "cream",
        accent: "#D3A34F",
    },
    {
        key: "softBlue",
        accent: "#397A9A",
    },
];

const Playlists: React.FC = () => {
    const dispatch = useAppDispatch();
    const { PlaylistData,
        CreatePlaylistDataState,
        CreatePlaylistDataError,
        PlaylistDataState,
        PlaylistDataError,
        EditPlaylistStatus,
        EditPlaylistError } = useAppSelector((state: RootState) => state.playlistSlice);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [nextId, setNextId] = useState(1);
    const [error, setError] = useState("");
    const [playlistData, setPlaylistData] = useState<Playlist | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingPlaylistId, setDeletingPlaylistId] = useState<string | null>(null);
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

    const isEditMode = editingPlaylist !== null;

    // const handleCreatePlaylist = (e: React.SubmitEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const name = playlistName.trim();
    //     if (!name) {
    //         setError("Please enter a playlist name.");
    //         return;
    //     }
    //     const alreadyExists = PlaylistData.some((playlist) => playlist.playlistName.toLowerCase() === name.toLowerCase());
    //     if (alreadyExists) {
    //         setError("A playlist with this name already exists.");
    //         return;
    //     }
    //     const color = playlistColors[(nextId - 1) % playlistColors.length];

    //     const newPlaylist: Playlist = {
    //         playlistId: crypto.randomUUID(),
    //         playlistName: name,
    //         userId: null,
    //         colorKey: color.key
    //     };

    //     // setPlaylists((prev) => [...prev, newPlaylist]);
    //     dispatch(createPlaylist(newPlaylist));
    //     setNextId((prev) => prev + 1);

    //     setPlaylistName("");
    //     setError("");
    //     setShowCreateModal(false);
    // };


    const handleCreatePlaylist = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = playlistName.trim();

        if (!name) {
            setError("Please enter a playlist name.");
            return;
        }

        const alreadyExists = PlaylistData.some(
            (playlist) =>
                playlist.playlistName.toLowerCase() === name.toLowerCase() &&
                playlist.playlistId !== editingPlaylist?.playlistId
        );

        if (alreadyExists) {
            setError("A playlist with this name already exists.");
            return;
        }

        try {
            if (isEditMode && editingPlaylist) {
                await dispatch(
                    editPlaylist({
                        playlistId: editingPlaylist.playlistId,
                        playlistName: name,
                        colorKey: editingPlaylist.colorKey
                    })
                ).unwrap();

                // Keep modal open to display edit success animation.
                return;
            }

            // Create mode
            const color = playlistColors[(nextId - 1) % playlistColors.length];

            const newPlaylist: Playlist = {
                playlistId: crypto.randomUUID(),
                playlistName: name,
                userId: null,
                colorKey: color.key
            };

            await dispatch(createPlaylist(newPlaylist)).unwrap();

            setNextId((prev) => prev + 1);

            setPlaylistName("");
            setError("");
            setShowCreateModal(false);

        } catch (err) {
            console.error("Failed to save playlist:", err);
        }
    };

    const handleOpenCreateModal = () => {
        setEditingPlaylist(null);
        setPlaylistName("");
        setError("");
        dispatch(resetEditPlaylistStatus());
        setShowCreateModal(true);
    };


    const closeModal = () => {
        setShowCreateModal(false);
        setPlaylistName("");
        setError("");
    };

    const handleDeletePlaylist = () => {
        if (!playlistData || deletingPlaylistId) return;

        setDeletingPlaylistId(playlistData.playlistId);
        setShowDeleteConfirm(false);
        setPlaylistData(null);
    };

    useEffect(() => {
        dispatch(getPlaylist());
    }, [dispatch]);

    useEffect(() => {
        if (EditPlaylistStatus !== "success") return;

        const timer = setTimeout(() => {
            setShowCreateModal(false);
            setEditingPlaylist(null);
            dispatch(resetEditPlaylistStatus());
        }, 1500);

        return () => clearTimeout(timer);
    }, [dispatch, EditPlaylistStatus]);

    if (PlaylistDataState === "loading") return <PlaylistListSkeleton />

    return (
        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">

            {/* Playlist banner */}
            <div className="
                mx-2 my-2 flex shrink-0 items-center gap-4
                rounded-2xl bg-[#E8F4FC] px-4 py-4
                dark:bg-[#263F4B]
                border border-[#DCEBF0]/80 dark:border-white/10
            ">

                {/* Playlist icon */}
                <div className="
                    flex size-16 shrink-0 items-center justify-center
                    rounded-2xl bg-[#D8EDFC]
                    dark:bg-[#304F5D]
                    border border-[#DCEBF0]/80 dark:border-white/10
                ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="text-[#1688DF] dark:text-[#83C9E8]"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                    >
                        <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2" />
                        <path fillRule="evenodd" d="M12 3v10h-1V3z" />
                        <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z" />
                        <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                    </svg>
                </div>

                {/* Heading and subtitle */}
                <div className="min-w-0 flex-1">
                    <h1 className="
                        text-xl font-bold leading-tight
                        text-[#304B68] dark:text-[#E3EEF4]
                        sm:text-2xl
                    ">
                        Playlists
                    </h1>

                    <p className="
                        mt-1 text-sm font-medium
                        text-[#71869E] dark:text-[#A9C0CC]
                        sm:text-base
                    ">
                        {PlaylistData.length} {PlaylistData.length === 1
                            ? "playlist"
                            : "playlists"} in your collection
                    </p>
                </div>

                {/* Create button */}
                <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="btn ara-btn-primary flex items-cneter justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="shrink-0"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                        />
                    </svg>
                    <span>Create</span>
                </button>
            </div>

            {/* Playlist collection */}
            <div className="
                min-h-0 flex-1 overflow-y-auto
                overscroll-contain px-3 pb-5
                sm:px-5
            ">



                {PlaylistData.length > 0 ? (
                    <div className="space-y-2">

                        {PlaylistData.map((playlist, index) => {
                            const color = playlistColors.find(
                                (item) => item.key === playlist.colorKey
                            )!;

                            return (
                                <div
                                    key={playlist.playlistId}
                                    style={{
                                        animationDelay:
                                            deletingPlaylistId === playlist.playlistId
                                                ? "0ms"
                                                : `${Math.min(index * 35, 350)}ms`,
                                    }}
                                    className={`
                                        ${deletingPlaylistId === playlist.playlistId
                                            ? "card-deleted"
                                            : "song-card-enter"
                                        }
                                        flex cursor-pointer items-center gap-3
                                        rounded-[1.15rem]
                                        border border-white/70
                                        bg-white/70
                                        px-3 py-3
                                        shadow-[0_4px_16px_rgba(57,122,154,0.04)]
                                        backdrop-blur-lg
                                        transition-all duration-200
                                        hover:-translate-y-0.5
                                        hover:bg-white/90
                                        dark:border-white/10
                                        dark:bg-[#1C303B]/45
                                        dark:hover:bg-[#263F4B]/70
                                        sm:gap-4 sm:px-5
                                    `}
                                    onAnimationEnd={(e) => {
                                        if (
                                            e.target !== e.currentTarget ||
                                            e.animationName !== "deleteCard" ||
                                            deletingPlaylistId !== playlist.playlistId
                                        ) {
                                            return;
                                        }

                                        void dispatch(
                                            deletePlaylist({ playlistId: playlist.playlistId })
                                        )
                                            .unwrap()
                                            .catch((err) => {
                                                console.error("Failed to delete playlist:", err);
                                                setError("Unable to delete playlist. Please try again.");
                                            })
                                            .finally(() => {
                                                setDeletingPlaylistId(null);
                                            });
                                    }}
                                >
                                    {/* Colour accent */}
                                    <div
                                        style={{
                                            backgroundColor: color.accent,
                                        }}
                                        className="h-12 w-1.5 shrink-0 rounded-full"
                                    />

                                    {/* Playlist information */}
                                    <div className="min-w-0 flex-1">
                                        <h2 className="
                                            text-base font-semibold leading-snug
                                            text-[#304B68] dark:text-[#E3EEF4]
                                            sm:text-lg
                                        ">
                                            {playlist.playlistName}
                                        </h2>

                                        <p className="
                                            mt-1 text-sm
                                            text-[#71869E] dark:text-[#A9C0CC]
                                        ">
                                            {/* {playlist.songCount} songs */}
                                            5 songs
                                        </p>
                                    </div>

                                    {/* More options */}
                                    <button
                                        type="button"
                                        aria-label={`Options for ${playlist.playlistName}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPlaylistData({
                                                playlistId: playlist.playlistId,
                                                playlistName: playlist.playlistName,
                                                colorKey: playlist.colorKey
                                            })
                                        }}
                                        className="
                                            flex size-9 shrink-0 items-center
                                            justify-center rounded-full
                                            text-[#8295AD]
                                            transition-colors
                                            hover:bg-sky-100/70
                                            dark:text-slate-400
                                            dark:hover:bg-slate-700
                                        "
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                            aria-hidden="true"
                                        >
                                            <circle cx="12" cy="5" r="1.8" />
                                            <circle cx="12" cy="12" r="1.8" />
                                            <circle cx="12" cy="19" r="1.8" />
                                        </svg>
                                    </button>

                                </div>
                            );
                        })}

                    </div>
                ) : (

                    /* Empty state */
                    <div className="
                        flex min-h-[260px] flex-col
                        items-center justify-center
                        rounded-[1.5rem]
                        border border-white/70
                        bg-white/45 px-5 py-8
                        text-center
                        shadow-[0_5px_20px_rgba(57,122,154,0.04)]
                        backdrop-blur-lg
                        dark:border-white/10
                        dark:bg-[#1C303B]/35
                    ">
                        <div className="
                            mb-4 flex size-16 items-center
                            justify-center rounded-full
                            bg-[#E5F2FC] text-[#1683D8]
                            dark:bg-slate-700/70 dark:text-sky-300
                        ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                            >
                                <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2" />
                                <path fillRule="evenodd" d="M12 3v10h-1V3z" />
                                <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z" />
                                <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </div>

                        <h2 className="
                            text-lg font-semibold
                            text-[#526B8D] dark:text-slate-200
                        ">
                            No playlists created yet
                        </h2>

                        <p className="
                            mt-2 max-w-sm text-sm leading-relaxed
                            text-[#8298B1] dark:text-slate-400
                            sm:text-base
                        ">
                            Create your first playlist and add songs to it.
                        </p>

                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="
                                mt-4 font-semibold text-[#3368A0]
                                hover:underline dark:text-[#83C9E8]
                            "
                        >
                            + Create Playlist
                        </button>
                    </div>
                )}
            </div>

            <CreateEditModal
                showCreateModal={showCreateModal}
                closeModal={closeModal}
                isEditMode={isEditMode}
                EditPlaylistStatus={EditPlaylistStatus}
                handleCreatePlaylist={handleCreatePlaylist}
                playlistName={playlistName}
                setPlaylistName={setPlaylistName}
                error={error}
                setError={setError}
            />

            <DeleteConfirmModal
                showDeleteConfirm={showDeleteConfirm}
                playlistData={playlistData}
                setShowDeleteConfirm={setShowDeleteConfirm}
                handleDeletePlaylist={handleDeletePlaylist}
            />

            <ActionBottomSheet
                isOpen={!!playlistData}
                onClose={() => setPlaylistData(null)}
            >
                {playlistData && (
                    <>
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-[#304B68] dark:text-[#E3EEF4]">{playlistData?.playlistName}</h3>
                            {/* <p className="mt-1 text-sm text-[#8295AD] dark:text-slate-400">Song {String(selectedSong?.songNumber).padStart(3, "0")} </p> */}
                        </div>
                        <button
                            type="button"
                            className="mt-1 flex w-full items-center gap-4 rounded-xl bg-red-50 px-4 py-3.5 text-left text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="shrink-0"
                            >
                                <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2" />
                                <path fillRule="evenodd" d="M12 3v8.5h-1V3z" />
                                <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z" />
                                <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                                <path d="M2 1.5 14.5 14" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"
                                />
                            </svg>
                            <span className="font-medium">Remove Playlist</span>
                        </button>
                        <button
                            type="button"
                            className="
                                mt-1 flex w-full items-center gap-4 rounded-xl
                                bg-[#E8F4FC] px-4 py-3.5 text-left
                                text-[#3368A0] transition-colors
                                hover:bg-[#DCEBF7]
                                dark:bg-[#3368A0]/15
                                dark:text-[#83C9E8]
                                dark:hover:bg-[#3368A0]/25
                            "
                            onClick={() => {
                                if (!playlistData) return;

                                setEditingPlaylist(playlistData);
                                setPlaylistName(playlistData.playlistName);
                                setError("");
                                setPlaylistData(null);
                                setShowCreateModal(true);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="shrink-0"
                                aria-hidden="true"
                            >
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                            </svg>

                            <span className="font-medium">Edit Playlist</span>
                        </button>
                    </>
                )
                }
            </ActionBottomSheet>
        </section >
    );
};

export default Playlists;
