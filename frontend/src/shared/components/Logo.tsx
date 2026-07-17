export default function Logo() {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-black text-black">
        {'</>'}
      </div>

      <div>

        <h1 className="text-3xl font-black tracking-tight">

          <span className="text-white">
            Dev
          </span>

          <span className="text-cyan-400">
            Sync
          </span>

        </h1>

        <p className="-mt-1 text-sm text-zinc-400">
          Real-Time Collaboration
        </p>

      </div>

    </div>
  );
}