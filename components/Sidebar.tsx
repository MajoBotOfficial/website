import { Image, Tooltip } from "react-bootstrap";
import { Guild, User } from "../typings/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export interface MyProps {
  user: User;
  guilds: Guild[];
}
const Sidebar = ({ user, guilds }: MyProps) => {
  return (
    <div className={"float-start overflow-auto"} id={"sidebar"}>
      <a href={"/dashboard"}>
        <div className={"icon rounded shadow"}>
          <Image rounded={true} src={user.avatar} />
        </div>
      </a>
      <hr />
      {guilds.map((g) => (
        <a key={g.id} href={`/dashboard/servers/${g.id}`}>
          <div className={"icon rounded shadow my-2"}>
            {g.icon ? (
              <Image
                rounded={true}
                src={`https://cdn.discordapp.com/icons/${g?.id}/${g?.icon}.png`}
              />
            ) : (
              <Image
                rounded={true}
                src={decodeURI(
                  `https://ui-avatars.com/api/?name=${g.name
                    .split(" ")
                    .join("+")}`
                )}
              />
            )}
          </div>
        </a>
      ))}
      <a href={"/invite"}>
        <div className={"icon rounded shadow my-2"}>
          <p className={"abbr text-success text-center"}>
            <FontAwesomeIcon icon={faPlus} />
          </p>
        </div>
      </a>
    </div>
  );
};

export default Sidebar;
