import Image from 'next/image';

type WavePreloaderProps = {
  fullScreen?: boolean;
};

export default function WavePreloader({ fullScreen = true }: WavePreloaderProps) {
  return (
    <div className={fullScreen ? 'flex min-h-screen items-center justify-center px-4' : 'flex items-center justify-center py-10'}>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          <span className="preloader-ring preloader-ring-1" />
          <span className="preloader-ring preloader-ring-2" />
          <span className="preloader-ring preloader-ring-3" />
          <span className="preloader-ring preloader-ring-4" />
          <Image
            src="/images/bgpreloader.png"
            alt="Orine Credit logo"
            width={56}
            height={56}
            priority
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
        </div>
        <div className="mt-3 inline-flex items-center gap-2">
          <p className="preloader-brand text-sm font-semibold">Orine Credit</p>
          <span className="preloader-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
