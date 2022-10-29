import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import NavbarComponent from "../components/Navbar";
import { withIronSessionSsr } from "iron-session/next";
import { PageProps } from "../typings/types";
import { Accordion, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import Header from "../components/Header";

const Commands: NextPage = ({ user, commands }: PageProps) => {
  const [cat, setCat] = useState(commands?.[0].category);
  const categories = [...new Set(commands?.map((c: any) => c.category))];
  return (
    <>
      <Header title={"Commands"} />
      <NavbarComponent user={user} />
      <Container>
        <div className={"jumbotron bg-transparent"}>
          <h1 className={"display-3"}>Commands</h1>
          <p className={"lead"}>View Bot&apos;s commands</p>
          <hr />
        </div>
        <section id={"commandsSection"}>
          <div className={"row px-4"}>
            <div id={"categories"} className={"col-sm-3"}>
              <ul className={"list-group mb-2"}>
                {categories.map((category: string) => (
                  <li
                    key={category}
                    className={`list-group-item`}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setCat(category);
                    }}
                    id={category}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
            <div id="commands" className={"col-sm-9"}>
              <ul className={"list-group"}>
                {commands
                  ?.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    else if (a.name > b.name) return 1;
                    return 0;
                  })
                  .filter(
                    (com) => com.category.toLowerCase() === cat.toLowerCase()
                  )
                  .map((c) => (
                    <Accordion
                      className={"mb-2"}
                      key={c.name}
                      defaultActiveKey="25"
                    >
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>{c.name}</Accordion.Header>
                        <Accordion.Body>
                          <br />
                          {c.aliases.length > 0 ? (
                            <>
                              <strong>Aliases:</strong>
                              {c.aliases.map((a: string) => (
                                <span className={"ms-1"} key={a}>
                                  {a}
                                </span>
                              ))}
                              <br />
                              <strong>Example: </strong>
                              <span style={{ color: "rgb(0, 123, 255)" }}>
                                {c.options.examples
                                  ? c.options.examples[0]
                                  : "No example."}
                              </span>
                              <br />
                              <strong>Description: </strong>
                              <span>{c.description}</span>
                            </>
                          ) : (
                            <>
                              <strong>Aliases:</strong>
                              <span className={"ms-1"}>No aliases.</span>
                              <br />
                              <strong>Example: </strong>
                              <span style={{ color: "rgb(0, 123, 255)" }}>
                                {c.options.examples
                                  ? c.options.examples[0]
                                  : "No example."}
                              </span>
                              <br />
                              <strong>Description: </strong>
                              <span>{c.description}</span>
                            </>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))}
              </ul>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function indexRoute({ req }) {
    const { user }: any = req.session;
    const { data } = await fetch(
      `${process.env.BOT_API as string}/commands`
    ).then((res) => res.json());

    return {
      props: user ? { user, commands: data } : { commands: data },
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

export default Commands;
