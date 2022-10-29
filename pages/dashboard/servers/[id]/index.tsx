import type { NextPage } from "next";
import Header from "../../../../components/Header";
import Sidebar from "../../../../components/Sidebar";
import { GetServerSideProps } from "next";
import { withIronSessionSsr } from "iron-session/next";
import { dbConnect } from "../../../../util/mongodb";
import { Guild, PageProps, User } from "../../../../typings/types";
import { Card, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUsers,
  faCrown,
  faSmile,
  faAddressCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { APIGuild, APIUser } from "discord-api-types/v9";
import NavbarComponent from "../../../../components/Navbar";
import GuildSidebar from "../../../../components/GuildSidebar";

const GeneralModule: NextPage = ({ user, guilds }: PageProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [currentGuild, setCurrentGuild] = useState<Guild>();
  const [guildData, setGuildData] = useState<APIGuild>();
  const [ownerData, setOwnerData] = useState<APIUser>();

  useEffect(() => {
    if (!id) return location.replace("/404");

    if (!user || !guilds) return location.replace("/");

    setCurrentGuild(guilds?.find((e) => e.id == id));
  }, []);
  useEffect(() => {
    if (!guildData) {
      fetch(`${window.origin}/api/client/guilds/${id}`).then(async (d) => {
        const res = await d.json();
        setGuildData(res.guild);
        setOwnerData(res.owner);
      });
    }
  });

  return (
    <>
      <Header title={"General"} />
      <NavbarComponent user={user} />
      <Sidebar user={user as User} guilds={guilds as Guild[]} />
      <GuildSidebar guild={currentGuild} />
      <div className={"col mh-100 overflow-hidden ps-5"}>
        <div className={"module row justify-content-start"}>
          {" "}
          <Card className={"metricCard"}>
            <Card.Header>
              <FontAwesomeIcon className={"pe-2"} icon={faUser} />
              Members:
            </Card.Header>
            <Card.Body>{guildData?.approximate_member_count} members</Card.Body>
          </Card>
          <Card className={"ms-3 metricCard"}>
            <Card.Header>
              <FontAwesomeIcon className={"pe-2"} icon={faAddressCard} />
              Roles:
            </Card.Header>
            <Card.Body>{guildData?.roles.length} roles</Card.Body>
          </Card>
          <Card className={"ms-3 metricCard"}>
            <Card.Header>
              <FontAwesomeIcon className={"pe-2"} icon={faSmile} />
              Emoji&apos;s:
            </Card.Header>
            <Card.Body>{guildData?.emojis.length} emoji&apos;s</Card.Body>
          </Card>
          <Card className={"ms-3 metricCard"}>
            <Card.Header>
              <FontAwesomeIcon className={"pe-2"} icon={faCrown} />
              Owner:
            </Card.Header>
            <Card.Body>
              {ownerData?.username}#{ownerData?.discriminator}
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function indexRoute({ req }) {
    const db = await dbConnect();
    const { user } = req.session;
    const data: any = await db.collection("users").findOne({ _id: user?.id });
    return {
      props:
        user && data?.guilds
          ? { user, guilds: [...new Set(data?.guilds)] }
          : {},
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
export default GeneralModule;
