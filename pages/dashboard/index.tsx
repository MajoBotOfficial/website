import { withIronSessionSsr } from "iron-session/next";
import type { GetServerSideProps, NextPage } from "next";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { dbConnect } from "../../util/mongodb";
import { Guild, PageProps, User } from "../../typings/types";
import { Card, Image } from "react-bootstrap";
import CardHeader from "react-bootstrap/CardHeader";
import NavbarComponent from "../../components/Navbar";

const Dashboard: NextPage = ({ user, guilds }: PageProps) => {
  return (
    <>
      <Header title={"Dashboard"} />
      <NavbarComponent user={user} />
      <Sidebar user={user as User} guilds={guilds as Guild[]} />
      <div id={"sidebarExtension"}>
        <header className={"text-center pt-4"}>
          <div className={"large-icon rounded"}>
            <Image rounded={true} src={user?.avatar} />
          </div>
          <h4 className={"pt-2"}>
            {user?.name}
            <span className={"text-muted"}>#{user?.discriminator}</span>
          </h4>
          <div className={"p-4"}>
            <select
              disabled={true}
              id={"themeSelect"}
              className={"form-control"}
            >
              <option>Select theme (disabled)</option>
            </select>
          </div>
        </header>
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
        user && data?.guilds ? { user, guilds: [...new Set(data.guilds)] } : {},
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
export default Dashboard;
