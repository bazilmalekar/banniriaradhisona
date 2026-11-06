import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../services/hooks";
import {
    fetchFavouriteSong,
    markFavourite
} from "../../../services/Slices/favoriteSlice";
import "./MarkFavourite.css";

interface MarkFavouriteProps {
    songId?: number;
    songNumber?: number;
    songTitleKa?: string;
}

const MarkFavourite: React.FC<MarkFavouriteProps> = ({
    songId,
    songNumber,
    songTitleKa
}) => {
    const dispatch = useAppDispatch();

    const [animation, setAnimation] = useState<"add" | "remove" | null>(null);
    const [showFilledHeart, setShowFilledHeart] = useState(false);
    const { favouriteSongdata, favouriteSongdataState } = useAppSelector(state => state.favoriteSlice);

    const isFavourite = favouriteSongdata?.songId === songId;

    useEffect(() => {
        if (favouriteSongdataState !== "success") return;
        setShowFilledHeart(favouriteSongdata?.songId === songId);
    }, [favouriteSongdata, favouriteSongdataState, songId]);

    const toggleFavourite = async () => {
        if (!songId || animation) return;
        if (isFavourite) {
            setAnimation("remove");
            setTimeout(async () => {
                const result = await dispatch(markFavourite({ songId, songNumber, songTitleKa }));
                if (markFavourite.fulfilled.match(result)) setShowFilledHeart(false);
                setAnimation(null);
            }, 250);
        } else {
            const result = await dispatch(markFavourite({ songId, songNumber, songTitleKa }));
            if (markFavourite.fulfilled.match(result)) {
                setShowFilledHeart(true);
                setAnimation("add");
                setTimeout(() => {
                    setAnimation(null);
                }, 350);
            }
        }
    };

    useEffect(() => {
        if (!songId) return;
        void dispatch(fetchFavouriteSong({ songId }));
    }, [dispatch, songId]);

    return (
        <button
            type="button"
            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
            onClick={toggleFavourite}
            disabled={favouriteSongdataState === "loading"}
            className="flex size-10 items-center justify-center rounded-full text-[#59799F] transition-colors hover:bg-sky-100/70 hover:text-rose-500 dark:text-slate-300 dark:hover:bg-slate-700"
        >
            {showFilledHeart ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className={`text-[#397A9A] dark:text-[#83C9E8] ${animation === "add" ? "animate-heart-pop" : ""
                        } ${animation === "remove" ? "animate-heart-fade-out" : ""
                        }`}
                >
                    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="text-[#71869E] dark:text-[#A9C0CC]"
                >
                    <path
                        d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </button>
    );
};

export default MarkFavourite;