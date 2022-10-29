import { Guild, User } from "./typings/types";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
    guilds?: Array<Guild>;
  }
}
