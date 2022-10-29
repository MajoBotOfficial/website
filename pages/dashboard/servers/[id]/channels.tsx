import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { withIronSessionSsr } from "iron-session/next";
import { dbConnect } from "../../../../util/mongodb";
import {
  doNothing,
  Guild,
  GuildChannel,
  PageProps,
  User,
} from "../../../../typings/types";
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
  FormSelect,
  FormText,
  InputGroup,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
interface OptionPost {
  channel?: string;
  message?: string;
}

interface Props {
  user?: User;
  guilds?: Array<Guild>;
}

const optionVariants = {
  normal: "text-neutral-300",
  danger: "text-red-600 font-semibold",
};

interface Option {
  label: string;
  link?: string;
  icon?: string;
  variant?: keyof typeof optionVariants;
  onClick?: (e: any) => void;
  customId?: string;
}

const ChannelSettings: NextPage = ({ user, guilds }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const [currentGuild, setCurrentGuild] = useState<Guild>();
  const [origin, setOrigin] = useState("");
  const [channels, setChannels] = useState<Option[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pickedChannel, setPickedChannel] = useState<string>();
  const [pickedChannelId, setPickedChannelId] = useState("");
  const [currentSetChannel, setCurrentSetChannel] = useState("");

  function changeChannel(origin: string, options: OptionPost) {
    return fetch(
      origin +
        "/api/client/guilds/" +
        id +
        "/logging" +
        `?${options.channel ? `modlog=${options.channel}` : ""}`,
      {
        method: "POST",
      }
    );
  }

  function getChannels(origin: string): Promise<Array<GuildChannel>> {
    return fetch(origin + "/api/client/guilds/" + id + "/channels", {
      method: "GET",
    }).then(async (e) => {
      const res = await e.json();
      return res.filter((e: any) => e.type == 0);
    });
  }

  function getCurrentSetChannel(origin: string) {
    return fetch(origin + "/api/client/guilds/" + id + "/logging", {
      method: "GET",
    }).then(async (e) => {
      const res = await e.json();
      if (res.error) return undefined;
      else if (res.channels && res.channels?.modlog) {
        const fetchedChannel = await fetchChannel(origin, res.channels.modlog);
        return await fetchedChannel;
      }
      return null;
    });
  }

  function fetchChannel(origin: string, channel_id: string) {
    return fetch(
      origin +
        "/api/client/guilds/" +
        id +
        "/channels?channel_id=" +
        channel_id,
      {
        method: "POST",
      }
    ).then(async (e) => {
      const res = await e.json();
      if (res.error) return undefined;
      else return res;
    });
  }

  useEffect(() => {
    if (!id) return location.replace("/404");
    if (!user || !guilds) return location.replace("/");

    setOrigin(window.origin);

    fetch(window.origin + "/api/client/guilds").then(async (e) => {
      const res = await e.json();

      doNothing();

      try {
        if (!res?.find((e: Guild) => e.id == id)) location.replace("/404");
      } catch (e) {}
    });

    setCurrentGuild(guilds?.find((e) => e.id == id));

    getChannels(window.origin).then((e) => {
      const array: Option[] = [];
      e.forEach((r) => {
        array.push({
          label: `#${r.name}`,
          variant: "normal",
          customId: `${r.id}`,
        });
      });

      setChannels(array);
    });

    getCurrentSetChannel(window.origin).then((e) => {
      setCurrentSetChannel(e.id);
    });
  }, []);
  const handleSubmit = () => {
    if (!pickedChannelId)
      return toast.error("Invalid channel selected", {
        position: "bottom-center",
        draggable: false,
        pauseOnHover: false,
      });
    if (currentSetChannel === pickedChannelId)
      return toast.error("Invalid channel selected", {
        position: "bottom-center",
        draggable: false,
        pauseOnHover: false,
      });
    console.log(pickedChannelId);
    changeChannel(origin, {
      channel: pickedChannelId,
      message: "yes",
    });
    toast.success(`Successfully saved the modlog channel`, {
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
          <Card className={"w-25"}>
            <Card.Header>Modlog:</Card.Header>
            <Card.Body>
              <FormSelect onChange={(e) => setPickedChannelId(e.target.value)}>
                <option key={0}>Select channel</option>
                {channels.map((ch) => (
                  <option
                    selected={currentSetChannel === ch.customId}
                    value={ch.customId}
                    key={ch.customId}
                  >
                    {ch.label}
                  </option>
                ))}
              </FormSelect>
              <br />
              <Button onClick={handleSubmit} variant={"success"}>
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
export default ChannelSettings;
