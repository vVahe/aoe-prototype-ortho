interface WaveDividerProps {
  topColor: string;
  bottomColor: string;
  flip?: boolean;
}

export default function WaveDivider({ topColor, bottomColor, flip = false }: WaveDividerProps) {
  const d = flip
    ? 'M0,35 C360,70 1080,0 1440,35 L1440,60 L0,60 Z'
    : 'M0,35 C360,0 1080,70 1440,35 L1440,60 L0,60 Z';

  return (
    <div className="w-full leading-none -mb-px" style={{ backgroundColor: topColor }}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block w-full h-5 md:h-14"
        aria-hidden
      >
        <path d={d} fill={bottomColor} />
      </svg>
    </div>
  );
}
