const statusItems = [
  "Collecting launch ramp reports",
  "Tracing marine area activity",
  "Syncing the latest catch totals",
];

const signalDots = Array.from({ length: 10 }, (_, index) => ({
  angle: index * 36,
  delay: `${index * 0.18}s`,
  size: index % 3 === 0 ? "h-3.5 w-3.5" : "h-2.5 w-2.5",
}));

export default function FullScreenLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading date range data"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#03111b] px-5 py-12 text-white sm:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(87,190,255,0.22),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(7,95,145,0.4),_transparent_36%),linear-gradient(135deg,_#02070d_5%,_#062135_45%,_#01050a_100%)]" />
      <div className="creel-loader-grid absolute inset-0 opacity-45" />
      <div className="creel-loader-glow absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-10 sm:gap-12">
        <div className="space-y-5 text-center">
          <p className="creel-eyebrow text-cyan-100/70">Puget Sound Creel</p>
          <div className="space-y-4">
            <h1 className="text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.04em] text-white sm:text-5xl">
              Charting the latest reports
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-cyan-50/75">
              Pulling date-range catch data, mapping survey activity, and
              preparing the Sound for a fresh scan.
            </p>
          </div>
        </div>

        {/* Sized against the viewport so the orbit rings never overflow a narrow
            phone, where a fixed 22rem was wider than the screen. */}
        <div className="creel-orbit-field relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 shadow-[0_0_70px_rgba(54,172,255,0.15)] backdrop-blur-[3px]" />
          <div className="absolute inset-[9%] rounded-full border border-cyan-200/10" />
          <div className="absolute inset-[21%] rounded-full border border-cyan-100/10" />
          <div className="absolute inset-[33%] rounded-full border border-cyan-100/10" />
          <div className="absolute inset-0 creel-loader-ring rounded-full border border-cyan-200/20" />
          <div className="absolute inset-[14%] creel-loader-ring rounded-full border border-cyan-200/15 [animation-delay:0.8s]" />
          <div className="absolute inset-[28%] creel-loader-ring rounded-full border border-cyan-200/10 [animation-delay:1.6s]" />
          <div className="absolute inset-0 creel-loader-sweep rounded-full" />
          <div className="absolute inset-0 rounded-full border border-white/5" />
          <div className="absolute h-px w-[78%] bg-gradient-to-r from-transparent via-cyan-100/25 to-transparent" />
          <div className="absolute h-[78%] w-px bg-gradient-to-b from-transparent via-cyan-100/25 to-transparent" />

          <div className="creel-loader-orbit absolute inset-0">
            {signalDots.map((dot) => (
              <div
                key={dot.angle}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `rotate(${dot.angle}deg)` }}
              >
                <div
                  style={{
                    transform: "translateY(calc(var(--orbit-size) * -0.482))",
                  }}
                >
                  <div
                    className={`creel-loader-dot ${dot.size} rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(147,230,255,0.9)]`}
                    style={{ animationDelay: dot.delay }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="creel-loader-orbit-reverse absolute inset-[14%]">
            {signalDots.slice(0, 6).map((dot) => (
              <div
                key={`inner-${dot.angle}`}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `rotate(${dot.angle + 24}deg)` }}
              >
                <div
                  style={{
                    transform: "translateY(calc(var(--orbit-size) * -0.331))",
                  }}
                >
                  <div
                    className="creel-loader-dot h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(98,212,255,0.8)]"
                    style={{ animationDelay: `${Number.parseFloat(dot.delay) + 0.4}s` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-100/20 bg-[#02111b]/80 shadow-[0_0_35px_rgba(70,190,255,0.16)] backdrop-blur-md sm:h-32 sm:w-32">
            <div className="absolute inset-3 rounded-full border border-cyan-100/15" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(113,223,255,0.22),_transparent_60%)]" />
            <div className="creel-loader-core relative h-3.5 w-3.5 rounded-full bg-cyan-100 shadow-[0_0_24px_rgba(133,232,255,0.95)]" />
            <div className="absolute bottom-6 text-[0.6rem] font-medium uppercase tracking-[0.5em] text-cyan-100/70">
              scanning
            </div>
          </div>
        </div>

        <div className="grid w-full max-w-4xl gap-3.5 sm:gap-4 md:grid-cols-3">
          {statusItems.map((item, index) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="creel-loader-dot h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-100 shadow-[0_0_16px_rgba(126,229,255,0.9)]"
                  style={{ animationDelay: `${index * 0.35}s` }}
                />
                <p className="text-sm font-medium tracking-[0.01em] text-white/90">
                  {item}
                </p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="creel-loader-progress h-full rounded-full bg-gradient-to-r from-cyan-200/70 via-sky-300 to-cyan-100"
                  style={{ animationDelay: `${index * 0.5}s` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="creel-label text-center text-cyan-100/45">
          Reading tides • Tracking ramps • Rendering the map
        </p>

        <span className="sr-only">Loading date range data.</span>
      </div>
    </div>
  );
}
