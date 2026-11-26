import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function IconColo(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={3.5}
        strokeWidth={1.5}
        d="M2.5 3h19m-19 18h19M5 3v18M19 3v18M9 6.5h6v11H9Zm0 3.75h6m-6 3.5h6"
      />
    </svg>
  );
}

export function IconPole(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Zm-2 7h2m14 0h2m-8-4l-3 4h4l-3 4"
      />
    </svg>
  );
}

export function IconFibre(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={3.5}
        strokeWidth={1.5}
        d="M8.5 15.5h7v5h-7Zm1 0c0-4.5-4-6-4-9m6.5 9v-9m2.5 9c0-4.5 4-6 4-9m-13-3h.01m6.49 0h.01m6.49 0h.01"
      />
    </svg>
  );
}

export function IconNode(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <g fill="none">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 21.32V12.2"
        />
        <circle
          cx="12"
          cy="9.09"
          r="3.1"
          fill="currentColor"
          opacity=".2"
          transform="rotate(90 12 9.1)"
        />
        <circle
          cx="12"
          cy="9.09"
          r="3.1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          transform="rotate(90 12 9.1)"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M6.63 12.4A6.3 6.3 0 0 1 5.4 8.69c0-1.65.56-3.04 1.23-3.72m10.74 7.43a6.3 6.3 0 0 0 1.23-3.72c0-1.65-.56-3.04-1.23-3.72M3.85 14.72A10 10 0 0 1 1.72 8.7a9.2 9.2 0 0 1 2.13-6.02m16.3 12.04a10 10 0 0 0 2.13-6.02a9.2 9.2 0 0 0-2.13-6.02"
        />
      </g>
    </svg>
  );
}

export function IconAsn(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 48 48"
      aria-hidden
      {...props}
    >
      <path d="M0 0h48v48H0z" fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.751 43a34.4 34.4 0 0 1 13.219-2.653a34.2 34.2 0 0 1 13.279 2.629m-13.255-5.809s10.84-11.687 10.84-21.328C34.833 9.853 29.98 5 23.993 5S13.155 9.853 13.155 15.839c0 9.641 10.84 21.328 10.84 21.328m-3.322-25.105v10.043"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23.319 22.105V12.062h3.287c1.86 0 3.366 1.51 3.366 3.373s-1.507 3.373-3.366 3.373H23.32"
      />
    </svg>
  );
}

export function IconCapacity(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 32 32"
      aria-hidden
      {...props}
    >
      <path d="M0 0h32v32H0z" fill="none" />
      <path
        fill="currentColor"
        d="M10 24a6 6 0 1 0 12 0a6 6 0 0 0-12 0m2 0c0-2.206 1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4s-4-1.794-4-4M30 5a3 3 0 0 0-6 0a2.99 2.99 0 0 0 2 2.816V13a6.03 6.03 0 0 1-2 4.467V15h-2v6h6v-2h-2.717A8.04 8.04 0 0 0 28 13V7.816A2.99 2.99 0 0 0 30 5m-3 1a1 1 0 1 1 0-2a1 1 0 0 1 0 2m-8.414 5.586L17 13.172V7.816A2.992 2.992 0 0 0 16 2a2.992 2.992 0 0 0-1 5.816v5.356l-1.586-1.586L12 13l4 4l4-4zM16 4a1 1 0 1 1 0 2a1 1 0 0 1 0-2M8 15v2.467A6.03 6.03 0 0 1 6 13V7.816A2.992 2.992 0 0 0 5 2a2.992 2.992 0 0 0-1 5.816V13a8.04 8.04 0 0 0 2.717 6H4v2h6v-6zM5 4a1 1 0 1 1 0 2a1 1 0 0 1 0-2"
      />
    </svg>
  );
}

export function IconRadio(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7.63 7.53A7.3 7.3 0 0 1 12 6.08c1.94 0 3.56.66 4.36 1.45M4.92 4.25a11.6 11.6 0 0 1 7.06-2.48c3.13 0 5.32 1.1 7.06 2.48m-9.49 8.37H5.01a.5.5 0 0 0-.5.45l-.32 3.05c-.05.41.43.73.83.6c1.94-.65 4.83-.35 4.83 2.42c0 3.86-4.53 3.71-5.78 1.68m15.75-7.68a4.8 4.8 0 1 0-.05 8.59c.35-.17.52-.26.67-.5s.15-.5.15-1v-1.48c0-.47 0-.7-.14-.85s-.39-.15-.86-.15h-1.56"
      />
    </svg>
  );
}

const ICONS: Record<string, (props: IconProps) => ReactElement> = {
  colo: IconColo,
  pole: IconPole,
  fibre: IconFibre,
  node: IconNode,
  asn: IconAsn,
  cap: IconCapacity,
  g5: IconRadio,
};

export function CatalogueIcon({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const Icon = ICONS[productId] ?? IconNode;
  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-siscom-soft text-siscom ${className}`}
    >
      <Icon />
    </span>
  );
}
