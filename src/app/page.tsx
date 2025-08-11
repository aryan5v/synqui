import Threads from "../components/Threads";
import TextPressure from "../components/TextPressure";

export default function Home() {
  return (
    <main className="relative min-h-dvh flex items-center justify-center overflow-hidden">
      {/* Cool threads background */}
      <div className="absolute inset-0 -z-20">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Threads
            amplitude={1}
            distance={0}
            enableMouseInteraction={true}
          />
        </div>
      </div>



      <section className="w-full max-w-[920px] px-6 md:px-10">
        <div className="flex flex-col items-center text-center gap-6 md:gap-8 text-white">
          <div style={{ position: "relative", height: 140, width: "100%" }}>
            <TextPressure
              text="synqui"
              flex
              alpha={false}
              stroke={false}
              width
              weight
              italic
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={48}
            />
          </div>
          <p className="text-sm md:text-base text-white/90 italic mb-2">
            (sync + &ldquo;qui&rdquo; (Latin for who))
          </p>
          <p className="text-base md:text-lg text-white font-medium">
            think. faster. smarter. together.
          </p>
          <p className="mt-2 text-sm md:text-base tracking-[0.25em] text-white/90">
            coming soon
          </p>
          <a
            href="mailto:hello@synqui.com"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm md:text-base font-medium text-white hover:bg-white hover:text-black transition-colors"
          >
            contact us
          </a>
        </div>
      </section>
    </main>
  );
}
