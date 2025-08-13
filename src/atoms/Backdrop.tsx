// src/atoms/Backdrop.tsx
export default function Backdrop() {
    return (
      <img
        src="/bg-glare.svg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none -z-10 opacity-90"
      />
    );
  }