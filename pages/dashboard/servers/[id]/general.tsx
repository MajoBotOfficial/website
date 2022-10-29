import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { withIronSessionSsr } from "iron-session/next";
import { dbConnect } from "../../../../util/mongodb";
import { Guild, PageProps, User } from "../../../../typings/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import NavbarComponent from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import GuildSidebar from "../../../../components/GuildSidebar";
import Image from "next/image";
import {
  Button,
  Card,
  FormControl,
  FormText,
  InputGroup,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const GeneralSettings: NextPage = ({ user, guilds }: PageProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [currentGuild, setCurrentGuild] = useState<Guild>();
  const [prefix, setPrefix] = useState<string>("");
  const [newPrefix, setNewPrefix] = useState("");
  function getPrefix(origin: string) {
    return fetch(origin + "/api/client/guilds/" + id + "/general", {
      method: "GET",
    }).then(async (e) => {
      const res = await e.json();
      if (res.error) return undefined;
      return res.prefix;
    });
  }

  function changePrefix(origin: string, value: string) {
    return fetch(
      origin + "/api/client/guilds/" + id + "/general" + `?prefix=${value}`,
      {
        method: "POST",
      }
    );
  }
  useEffect(() => {
    if (!id) return location.replace("/404");

    if (!user || !guilds) return location.replace("/");

    getPrefix(window.origin).then((r) => setPrefix(r));
    setCurrentGuild(guilds?.find((e) => e.id == id));
  }, []);
  const handleSave = (doc: any) => {
    if (
      prefix == newPrefix ||
      (document.getElementById("new-prefix") as any).value == prefix
    ) {
      return toast.warn("You cannot save the same prefix", {
        position: toast.POSITION.BOTTOM_CENTER,
        draggable: false,
        pauseOnHover: false,
      });
    }
    if (prefix?.length < 0) {
      return toast.warn("The prefix needs to be 1 character or more", {
        position: toast.POSITION.BOTTOM_CENTER,
        draggable: false,
        pauseOnHover: false,
      });
    }
    changePrefix(origin, newPrefix);
    toast.success(`Successfully saved the prefix`, {
      position: toast.POSITION.TOP_RIGHT,
      draggable: false,
      pauseOnHover: false,
      icon: (
        <Image
          src={"/img/check.png"}
          alt="Logo"
          className="w-8 bg-transparent rounded-full"
          width={32}
          height={32}
        />
      ),
    });
  };
  return (
    <>
      <Header title={"General"} />
      <NavbarComponent user={user} />
      <Sidebar user={user as User} guilds={guilds as Guild[]} />
      <GuildSidebar guild={currentGuild} />
      <div className={"d-flex"}>
        {" "}
        <ToastContainer />
      </div>

      <div className={"col mh-100 overflow-hidden ps-5"}>
        <div className={"module row justify-content-start"}>
          <Card className={"metricCard"}>
            <Card.Header>Prefix:</Card.Header>
            <Card.Body>
              <FormControl
                id={"new-prefix"}
                defaultValue={prefix}
                onChange={(doc) => setNewPrefix(doc.target.value)}
                placeholder={"The prefix"}
              />
              <br />
              <Button onClick={handleSave} variant={"success"}>
                Save
              </Button>
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
export default GeneralSettings;
