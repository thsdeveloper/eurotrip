import Image from "next/image";

export function CountryFlag({
  countryCode,
  name,
  size = 64,
}: {
  countryCode: string;
  name: string;
  size?: 16 | 24 | 32 | 48 | 64;
}) {
  const code = countryCode.toLowerCase();
  const h = Math.round(size * 0.75);
  const src = `https://flagcdn.com/${size}x${h}/${code}.png`;

  return (
    <Image
      src={src}
      alt={`Bandeira: ${name}`}
      width={size}
      height={h}
      className="inline-block rounded-sm"
      unoptimized
    />
  );
}
