interface InkSplashHeadingProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function InkSplashHeading({ children, className = '' }: InkSplashHeadingProps) {
  return (
    <div className={`ink-splash-heading-wrapper ${className}`}>
      <div>{children}</div>
    </div>
  );
}
