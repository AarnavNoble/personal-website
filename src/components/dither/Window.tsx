import type { CSSProperties, PointerEvent, ReactNode } from "react";

type Props = {
  tag: string;
  title?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onBarPointerDown?: (e: PointerEvent<HTMLDivElement>) => void;
  id?: string;
};

// A desktop-style panel: hairline border, square corner handles, a file-name
// tag above the top-left corner and an optional title bar.
export function Window({ tag, title, children, className = "", style, onBarPointerDown, id }: Props) {
  return (
    <div className={`win ${className}`} style={style} data-win={id}>
      <span className="win-tag">{tag}</span>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      {title && (
        <div className={`win-bar${onBarPointerDown ? " draggable" : ""}`} onPointerDown={onBarPointerDown}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
