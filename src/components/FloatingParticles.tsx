"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    baseOpacity: number;
    hue: number;
}

interface FloatingParticlesProps {
    count?: number;
    className?: string;
}

export default function FloatingParticles({ count = 50, className }: FloatingParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1,
                    opacity: 0,
                    baseOpacity: Math.random() * 0.3 + 0.1,
                    hue: Math.random() * 60 + 200, // Blue to purple range
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle) => {
                // Mouse attraction
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    particle.vx += (dx / distance) * force * 0.002;
                    particle.vy += (dy / distance) * force * 0.002;
                    particle.opacity = particle.baseOpacity + force * 0.4;
                } else {
                    particle.opacity = Math.max(0, particle.opacity - 0.01);
                }

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Add gentle drift
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Draw particle
                if (particle.opacity > 0.01) {
                    ctx.save();
                    ctx.globalAlpha = particle.opacity;

                    // Create gradient for glow effect
                    const gradient = ctx.createRadialGradient(
                        particle.x, particle.y, 0,
                        particle.x, particle.y, particle.size * 3
                    );
                    gradient.addColorStop(0, `hsl(${particle.hue}, 70%, 80%)`);
                    gradient.addColorStop(0.4, `hsl(${particle.hue}, 70%, 60%)`);
                    gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 40%, 0)`);

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Core particle
                    ctx.fillStyle = `hsl(${particle.hue}, 80%, 90%)`;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleResize = () => {
            resizeCanvas();
            initParticles();
        };

        resizeCanvas();
        initParticles();
        animate();

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            className={className || "fixed inset-0 pointer-events-none"}
            style={{ zIndex: 1 }}
        />
    );
}
