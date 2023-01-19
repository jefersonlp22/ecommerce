import React from "react";

/**
 *
 * @param uri
 * @param width
 * @param height
 * @param operation [cover, cover:center, cover:smart, cover:attention, cover:entropy, cover:face, cover:contain, width, height] https://imageboss.me/docs/operations/cover
 */

interface ImageProps {
  uri: string;
  width: number;
  height: number;
  operation: string;
  className?: string;
}

const ImageBoss: React.FC<ImageProps> = ({
  operation,
  uri,
  width,
  height,
  className
}) => {
  let imageBoosUrl = "https://img.imageboss.me/peoplecommerce";

  uri = uri?.replace(process.env.REACT_APP_S3_URL, "");

  imageBoosUrl += "/" + operation;
  if (operation.indexOf("cover") >= 0) {
    imageBoosUrl += "/" + width + "x" + height;
  } else if (operation.indexOf("width") >= 0) {
    imageBoosUrl += "/" + width;
  } else if (operation.indexOf("height") >= 0) {
    imageBoosUrl += "/" + height;
  }

  imageBoosUrl += uri;

  if (uri.indexOf(process.env.REACT_APP_SANDBOX_S3_URL) > -1) {
    imageBoosUrl = uri
  }


  return (
    <>
      <img
        src={imageBoosUrl}
        className={className}
        loading="eager"
        alt="default"
      />
    </>
  );
};

export { ImageBoss };
