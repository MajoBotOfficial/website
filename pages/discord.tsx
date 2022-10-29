import type { NextPage } from "next";
import { Button } from "react-bootstrap";
import Head from "next/head";
import Header from "../components/Header";

const Discord: NextPage = () => {
  return (
    <>
      <Header title={"Redirecting..."} />
      <Head>
        <meta httpEquiv="Content-Type" content="text/html charset=utf-8" />
        <meta
          httpEquiv="refresh"
          content="3;URL=https://discord.gg/aY3DCHHp8x"
        />
      </Head>
      <div className={"d-flex flex-md-column"}>
        <div
          className={
            "align-items-center justify-content-center text-center align-content-center"
          }
        >
          <h1>Redirecting...</h1>
          <p className={"lead"}>You are being redirected to our discord...</p>
          <h5>If you don&apos;t get redirected click the button below!</h5>
          <Button href={"https://discord.gg/aY3DCHHp8x"} variant={"dark"}>
            Join discord
          </Button>
        </div>
      </div>
    </>
  );
};

export default Discord;
