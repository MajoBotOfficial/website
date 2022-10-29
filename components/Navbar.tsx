import React from "react";
import { Container, Nav, Navbar, Dropdown, Image } from "react-bootstrap";
import {
  faChalkboard,
  faCode,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "../typings/types";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";

export interface MyProps {
  user: User | undefined | null;
}
export default function NavbarComponent({ user }: MyProps) {
  return (
    <>
      <Navbar expand="lg" className={"me-2 ms-3"}>
        <Navbar.Brand href="/">Bot</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href={"/dashboard"}>
              <FontAwesomeIcon icon={faChalkboard} />
              <span className={"ms-1 pl-1"}>Dashboard</span>
            </Nav.Link>
            <Nav.Link href={"/commands"}>
              <FontAwesomeIcon icon={faCode} />
              <span className={"ms-1 pl-1"}>Commands</span>
            </Nav.Link>
            <Nav.Link>
              <FontAwesomeIcon icon={faGithub} />
              <span className={"ms-1 pl-1"}>Github</span>
            </Nav.Link>
            <Nav.Link>
              <FontAwesomeIcon icon={faDiscord} />
              <span className={"ms-1 pl-1"}>Invite</span>
            </Nav.Link>
          </Nav>
          <Nav className={"ms-auto"}>
            {user ? (
              <Dropdown>
                <DropdownToggle>
                  <Image rounded className={"user-avatar"} src={user.avatar} />
                  <span className={"ps-2"}>{user.name}</span>
                </DropdownToggle>
                <DropdownMenu align={"end"}>
                  <DropdownItem>Dashboard</DropdownItem>
                  <hr />
                  <DropdownItem href={"/api/auth/logout"}>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Nav.Link href={"/api/auth/login"}>
                <FontAwesomeIcon icon={faSignInAlt} />
                <span className={"ms-1 pl-1"}>Login</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
