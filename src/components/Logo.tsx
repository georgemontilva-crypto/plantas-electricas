export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg className={`logo ${className}`} viewBox="175.6 45.2 60 26.4" role="img" aria-label="AKX">
      <path
        fill="currentColor"
        d="M182.97 57.63l2.49-6.35 2.39 6.32zM191.27 66.03h3.83l-8.24-19.74h-2.75l-8.3 19.74h3.83l2.02-5.05 7.46-.02zM207.23 66.03h4.54l-9.42-10.22 9.62-9.52h-3.72l-8.64 8.1v-8.1h-3.36V66h3.36v-7.96h.25zM234.51 66.03l-9.04-9.78 7.56-9.96h-3.83l-5.65 7.4-5.64-7.4h-3.83l7.56 9.96-9.04 9.78h4.53l6.42-7.22 6.43 7.22z"
      />
      <path fill="#A6DB40" d="M175.8 67.65l2.67 3.54h53.37l2.67-3.54z" />
    </svg>
  );
}
