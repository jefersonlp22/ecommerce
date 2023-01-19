import React from "react";

interface Slider {
  width?: number;
  height?: number;
  fill?: string;
}

const ArrowPrev: React.FC<Slider> = ({ height, width, fill }) => {
  return (
    <svg
      width={width ? width : "25"}
      height={height ? height : "50"}
      viewBox="0 0 25 50"
    >
      <path
        fill={fill || "#FFF"}
        fillRule="evenodd"
        d="M2.34 24.163L21.985 4.35c.463-.467 1.204-.467 1.667 0 .463.467.463 1.214 0 1.681L4.844 25l18.81 18.968c.462.466.462 1.215 0 1.681-.228.23-.533.352-.83.352-.297 0-.602-.114-.83-.352L2.349 25.835c-.463-.457-.463-1.214-.009-1.672z"
      />
    </svg>
  );
};

const ArrowNext: React.FC<Slider> = ({ height, width, fill }) => {
  return (
    <svg
      width={width ? width : "25"}
      height={height ? height : "50"}
      viewBox="0 0 25 50"
    >
      <path
        fill={fill || "#FFF"}
        fillRule="evenodd"
        d="M23.66 25.837L4.015 45.65c-.463.467-1.204.467-1.667 0-.463-.467-.463-1.214 0-1.681L21.156 25 2.346 6.033c-.462-.466-.462-1.215 0-1.681.228-.23.533-.352.83-.352.297 0 .602.114.83.352l19.646 19.813c.463.457.463 1.214.009 1.672z"
      />
    </svg>
  );
};

export { ArrowPrev, ArrowNext };
