import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";

export interface myProps {
  title: string;
}
const Header = ({ title }: myProps) => {
  return (
    <>
      <NextSeo
        title={`${title} - Majo`}
        additionalMetaTags={[
          {
            property: "og:image",
            content: `img/majo.png`,
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:description",
            content: `Majo is your average utility discord bot. Made using typescript btw. 🐈`,
          },
        ]}
      />
    </>
  );
};

export default Header;
