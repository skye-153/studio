import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" />
      <path d="m15.6 8.4-4.2 4.2" />
      <path d="M12 12h.01" />
      <path d="m8.4 15.6 4.2-4.2" />
      <path d="M12 12h.01" />
      <path d="M12 12h.01" />
    </svg>
  ),
};
