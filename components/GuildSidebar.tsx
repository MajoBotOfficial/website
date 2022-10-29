import type { NextPage } from "next";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";

export interface myProps {
  guild: any;
}
const GuildSidebar = ({ guild }: myProps) => {
  return (
    <div className={"d-flex justify-content-center"} id={"sidebarExtension"}>
      <header className={"text-center mt-3"}>
        <div className={"large-icon rounded"}>
          <Image
            rounded={true}
            src={
              guild?.icon
                ? `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.png`
                : `${decodeURI(
                    `https://ui-avatars.com/api/?name=${guild?.name
                      .split(" ")
                      .join("+")}`
                  )}`
            }
          />
        </div>
        <h4 className={"pt-2"}>{guild?.name}</h4>
        <div className={"tabs navbar-nav"}>
          <div className={"category"}>Modules</div>
          <a id={"overview"} href={`/dashboard/servers/${guild?.id}`}>
            <FontAwesomeIcon className={"pe-1"} icon={faUsers} /> Overview
          </a>
          <a id={"general"} href={`/dashboard/servers/${guild?.id}/general`}>
            <FontAwesomeIcon className={"pe-1"} icon={faStar} />
            General
          </a>
          <a id={"channels"} href={`/dashboard/servers/${guild?.id}/channels`}>
            <FontAwesomeIcon className={"pe-1"} icon={faHashtag} />
            Channels
          </a>
        </div>
      </header>
    </div>
  );
};

export default GuildSidebar;
