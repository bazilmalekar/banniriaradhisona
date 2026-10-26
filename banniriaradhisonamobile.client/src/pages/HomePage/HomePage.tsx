import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../services/hooks";
import type { RootState } from "../../services/store";
import { getSong } from "../../services/Slices/homeSlice";
import { useNavigate, useSearchParams } from "react-router";
import ThemeToggle from "../../shared/ToggleTheme/ToggleTheme";

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const songIdParam = searchParams.get("songId");
    const songId = songIdParam ? Number(songIdParam) : undefined;

    const { data, error, dataState } = useAppSelector((state: RootState) => state.homeSlice);
    // const { data } = useAppSelector((state: RootState) => state.homeSlice);

    useEffect(() => {
        const loadSong = async () => {
            try {
                const result = await dispatch(getSong({ id: songId })).unwrap();
                navigate(`/song?songId=${result.song.songId}`, { replace: true });
            } catch (error) {
                console.error("Failed to fetch song:", error);
            }
        };

        void loadSong();
    }, [dispatch, songId, navigate]);


    return (
        <>
            <h6>{data?.song.songNumber}</h6>
            <h4>{data?.song.songTitleKa}</h4>
            <p>{data?.song.songLyr}</p>
            <ThemeToggle />
        </>
    );
}

export default HomePage;