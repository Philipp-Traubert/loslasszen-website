import { ReactNode } from 'react';
import { FallingBlossoms } from './FallingBlossoms';
import paperTexture from '../assets/b67594e9b3c439245fdadadaacf25076d0420eda Large.jpeg';

interface LayoutProps {
  children: ReactNode;
  fixedBackground?: boolean;
  fixedBlossoms?: boolean;
  winterBlossoms?: boolean;
}

export function Layout({
  children,
  fixedBackground = true,
  fixedBlossoms = true,
  winterBlossoms = false,
}: LayoutProps) {
  return (
    <>
      {fixedBackground && (
        <div
          className="viewport-paper-texture"
          style={{ backgroundImage: `url(${paperTexture})` }}
          aria-hidden="true"
        />
      )}

      <div className="layout-container">
        {fixedBackground && (
          <div
            className="paper-texture"
            style={{ backgroundImage: `url(${paperTexture})` }}
          />
        )}

        {fixedBlossoms && (
          <div className="blossoms-layer" style={{ zIndex: 1 }} aria-hidden="true">
            <FallingBlossoms layer="back" winter={winterBlossoms} />
          </div>
        )}

        <div className="content-layer">{children}</div>

        {fixedBlossoms && (
          <div className="blossoms-layer" style={{ zIndex: 3 }} aria-hidden="true">
            <FallingBlossoms layer="front" winter={winterBlossoms} />
          </div>
        )}
      </div>
    </>
  );
}
