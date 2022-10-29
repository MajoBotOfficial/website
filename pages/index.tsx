import type { GetServerSideProps, NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import NavbarComponent from "../components/Navbar";
import { withIronSessionSsr } from "iron-session/next";
import { PageProps } from "../typings/types";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Home: NextPage = ({ user }: PageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.r) {
      location.replace("/");
    }
  }, []);

  return (
    <>
      <NavbarComponent user={user} />
      <div className={"jumbotron text-center bg-transparent"}>
        <h1 className={"display-3"}>My bot</h1>
        <p className={"lead"}>
          The best bot <FontAwesomeIcon className={"pl-2"} icon={faStar} />
        </p>
        <Button className={"me-2"} variant={"dark"}>
          Invite me
        </Button>
        <Button variant={"dark"}>Go to dashboard</Button>
      </div>
      <Header title={"Home"} />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function indexRoute({ req }) {
    const { user } = req.session;

    return {
      props: user ? { user } : {},
    };
  },
  {
    password: process.env.COOKIE_SECRET as string,
    cookieName: "c-session",
    ttl: 15 * 24 * 3600,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: true,
    },
  }
);

export default Home;
