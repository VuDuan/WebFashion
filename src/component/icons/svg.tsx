import React from "react";
import Use from "./use";

type Props = { src: string } & JSX.IntrinsicElements["svg"];

const Svg = ({ src, ...rest }: Props) => {
  return (
    <svg {...rest}>
      <Use href={src} />
    </svg>
  );
};

export default Svg;
