import { ImageResponse } from 'next/og';

export const alt =
  'VAHECO — Websites voor orthodontistenpraktijken in Nederland';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FAFAF7',
          color: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: '0.18em',
          }}
        >
          VAHECO
        </div>
        <div
          style={{
            marginTop: 16,
            width: 56,
            height: 4,
            background: '#2C5F5D',
          }}
        />
        <div
          style={{
            display: 'flex',
            marginTop: 80,
            fontSize: 56,
            lineHeight: 1.15,
            maxWidth: 980,
            color: '#1A1A1A',
          }}
        >
          Websites die door AI worden gevonden — gebouwd voor
          orthodontistenpraktijken in Nederland.
        </div>
      </div>
    ),
    { ...size },
  );
}
