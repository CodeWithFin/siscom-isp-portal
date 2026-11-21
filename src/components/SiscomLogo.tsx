import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string;
  variant?: "header" | "footer";
  className?: string;
  priority?: boolean;
};

export function SiscomLogo({
  href = "/",
  variant = "header",
  className = "",
  priority = false,
}: Props) {
  const src =
    variant === "footer"
      ? "/brand/siscom-logo-footer.png"
      : "/brand/siscom-logo.png";

  const image = (
    <Image
      src={src}
      alt="SISCOM"
      width={567}
      height={120}
      priority={priority}
      className={`h-8 w-auto object-contain sm:h-9 ${className}`}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="SISCOM home">
      {image}
    </Link>
  );
}
