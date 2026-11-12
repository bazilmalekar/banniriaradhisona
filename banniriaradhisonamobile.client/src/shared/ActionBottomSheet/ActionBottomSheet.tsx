
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ActionBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    ariaLabel?: string;
}

const ActionBottomSheet: React.FC<ActionBottomSheetProps> = ({
    isOpen,
    onClose,
    children,
    ariaLabel = "Action options",
}) => {
    const touchStartY = useRef(0);
    const currentTranslateY = useRef(0);
    const sheetRef = useRef<HTMLDivElement>(null);

    const [translateY, setTranslateY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Open animation
    useEffect(() => {
        if (!isOpen) {
            setIsSheetOpen(false);
            setTranslateY(0);
            currentTranslateY.current = 0;
            return;
        }
        const frame = requestAnimationFrame(() => { setIsSheetOpen(true) });
        return () => cancelAnimationFrame(frame);
    }, [isOpen]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const distance = Math.max(0, e.touches[0].clientY - touchStartY.current);
        currentTranslateY.current = distance;
        setTranslateY(distance);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (currentTranslateY.current > 80) {
            const height = sheetRef.current?.offsetHeight ?? 300;
            setTranslateY(height);
            setTimeout(() => {
                onClose();
                setTranslateY(0);
                currentTranslateY.current = 0;
            }, 250);
        } else {
            setTranslateY(0);
            currentTranslateY.current = 0;
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                className="w-full max-w-lg rounded-t-2xl bg-white p-4 pb-6 dark:bg-[#1D303A]"
                style={{
                    transform: `translateY(calc(${isSheetOpen ? "0%" : "100%"} + ${translateY}px))`,
                    transition: isDragging
                        ? "none"
                        : "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
                    touchAction: "pan-x",
                }}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Sheet handle */}
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
                {children}
            </div>
        </div>,
        document.body
    );
};

export default ActionBottomSheet;
