import { useId } from 'react';

export default function ArtIcon() {
  const maskId = useId();
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <defs>
        <mask id={maskId}>
          {/* Keep everything in the mask that is white */}
          <rect width="24" height="24" fill="white" />
          {/* Paint wells / color drops cutouts in black (making them transparent holes) */}
          <circle cx="7.5" cy="10.5" r="1.2" fill="black" />
          <circle cx="11.5" cy="7.5" r="1.2" fill="black" />
          <circle cx="16.5" cy="9.5" r="1.2" fill="black" />
        </mask>
      </defs>
      <path 
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.82 0 3.43-.88 4.47-2.24.4-.52.26-1.26-.3-1.61L15 17.5c-.83-.52-1.91-.32-2.5.47-.69.93-1.8 1.53-3.05 1.53-2.21 0-4-1.79-4-4s1.79-4 4-4c.73 0 1.41.21 2 .56.88.52 2.02.26 2.58-.6L18 9.5c.34-.52.22-1.22-.26-1.6C16.27 6.57 14.23 6 12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.1 0 2-.9 2-2 0-.3-.07-.59-.2-.85-.16-.32-.23-.69-.17-1.06.12-.76.78-1.32 1.55-1.32h1.37c2.51 0 4.5-1.99 4.5-4.5C22 5.98 17.51 2 12 2z" 
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}

