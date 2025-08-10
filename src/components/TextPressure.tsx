"use client";

import { useEffect, useRef, useState } from "react";

type TextPressureProps = {
    text: string;
    flex?: boolean;
    alpha?: boolean;
    stroke?: boolean;
    width?: boolean;
    weight?: boolean;
    italic?: boolean;
    textColor?: string;
    strokeColor?: string;
    minFontSize?: number; // px
    className?: string;
};

// Interactive variable-font headline: adjusts wght/wdth/ital based on pointer proximity.
// Works best with variable fonts that support these axes. Falls back gracefully otherwise.
export default function TextPressure({
    text,
    flex = true,
    alpha = false,
    stroke = false,
    width = true,
    weight = true,
    italic = true,
    textColor = "#ffffff",
    strokeColor = "#ffffff",
    minFontSize = 36,
    className,
}: TextPressureProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [fontSize, setFontSize] = useState<number>(minFontSize);

    // Track pointer inside container and adjust axes
    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        let rafId: number | null = null;
        let pointerX = 0;
        let pointerY = 0;

        const updateAxes = () => {
            const rect = node.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = (pointerX - centerX) / (rect.width / 2);
            const dy = (pointerY - centerY) / (rect.height / 2);
            const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy));
            const pressure = 1 - dist; // 0 (edge) → 1 (center)

            // Axis ranges (best-effort defaults for variable fonts)
            const wght = weight ? Math.round(400 + pressure * 400) : 400; // 400 → 800
            const wdth = width ? Math.round(100 + pressure * 25) : 100; // 100 → 125
            const ital = italic ? (pressure > 0.65 ? 1 : 0) : 0; // toggle italic near center

            node.style.setProperty("--tp-wght", String(wght));
            node.style.setProperty("--tp-wdth", String(wdth));
            node.style.setProperty("--tp-ital", String(ital));

            // Alpha fade optional
            node.style.setProperty("--tp-alpha", alpha ? String(0.7 + 0.3 * pressure) : "1");

            rafId = window.requestAnimationFrame(updateAxes);
        };

        const onPointerMove = (e: PointerEvent) => {
            pointerX = e.clientX;
            pointerY = e.clientY;
        };

        const onResize = () => {
            const rect = node.getBoundingClientRect();
            // Scale font size relative to container height for responsive behavior
            const target = Math.max(minFontSize, Math.floor(rect.height * 0.5));
            setFontSize(target);
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("resize", onResize);
        onResize();
        rafId = window.requestAnimationFrame(updateAxes);

        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("resize", onResize);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [alpha, italic, weight, width, minFontSize]);

    const wrapperStyle: React.CSSProperties = flex
        ? { display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }
        : { height: "100%" };

    const textStyle: React.CSSProperties = {
        color: textColor,
        fontSize,
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        fontVariationSettings: `'wght' var(--tp-wght, 400), 'wdth' var(--tp-wdth, 100), 'ital' var(--tp-ital, 0)`,
        opacity: "var(--tp-alpha, 1)",
        WebkitTextStroke: stroke ? `1px ${strokeColor}` : undefined,
        textShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)",
        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))",
    } as React.CSSProperties;

    return (
        <div ref={containerRef} className={className} style={{ position: "relative", ...wrapperStyle }}>
            <span style={textStyle}>{text}</span>
        </div>
    );
}


