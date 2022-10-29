import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../../util/mongodb";
import { withSession } from "../../../../../util/session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, prefix } = req.query;

  if (req.method === "GET") {
    try {
      const db = await dbConnect();
      const data = await db.collection("guilds").findOne({ id });
      if (!data) {
        const d = await db.collection("guilds").insertOne({
          id: id,
          prefix: "!",
          language: "english",
          channels: null,
        });
        return res.send(d);
      }
      if (data) return res.send(data);
    } catch (e) {
      res.send(e);
    }
  }

  if (req.method === "POST") {
    try {
      if (!prefix) return res.send({ error: "No prefix value provided." });
      const db = await dbConnect();
      const data = await db.collection("guilds").findOne({ id });
      if (!data) {
        const newData = await db.collection("guilds").insertOne({
          id,
          prefix,
        });

        res.send(await db.collection("guilds").findOne({ guildId: id }));
      }
      if (data) {
        db.collection("guilds").updateOne(
          {
            id,
          },
          {
            $set: {
              prefix: prefix,
            },
          }
        );
      }
      res.send({ success: true });
    } catch (e) {
      res.send(e);
    }
  }
};

export default withSession(handler);
