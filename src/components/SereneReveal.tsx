interface SereneRevealProps {
    children: React.ReactNode;
    delay?: number;
    scrollDelay?: number;
    className?: string;
}

export function SereneReveal({ children, className = '' }: SereneRevealProps) {
    return (
        <div className={className}>
            <div>{children}</div>
        </div>
    );
}
