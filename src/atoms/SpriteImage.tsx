import React from 'react';

type Props = React.SVGProps<SVGImageElement> & {
  href: string;             // '/oval.svg' 등
  x: number;
  y: number;
  width: number;
  height: number;
  center?: boolean;         // (x,y)를 중심좌표로 사용할지
  opacity?: number;
};

export function SpriteImage({ href, x, y, width, height, center = false, opacity = 1, ...rest }: Props) {
  const ox = center ? x - width / 2 : x;
  const oy = center ? y - height / 2 : y;
  return <image href={href} x={ox} y={oy} width={width} height={height} opacity={opacity} {...rest} />;
}