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
  const src = `https://flagsapi.com/${countryCode}/flat/${size}.png`;

  return (
    <Image
      src={src}
      alt={`Bandeira: ${name}`}
      width={size}
      height={size}
      className="inline-block"
      unoptimized
    />
  );
}
