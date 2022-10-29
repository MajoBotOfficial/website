import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../../util/mongodb";
import { withSession } from "../../../../../util/session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, modlog } = req.query;

  if (req.method === "GET") {
    try {
      const db = await dbConnect();
      const data = await db.collection("guilds").findOne({ id });
      if (!data) return res.send({ error: "Couldn't find data" });
      if (data) return res.send(data);
    } catch (e) {
      res.send(e);
    }
  }

  if (req.method === "POST") {
    try {
      if (!modlog) return res.send({ error: "No modlog channel provided." });
      const db = await dbConnect();
      const data = await db.collection("guilds").findOne({ id });
      if (!data) {
        await db.collection("guilds").insertOne({
          id,
          channels: {
            modlog,
          },
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
              channels: {
                modlog,
              },
            },
          }
        );
        res.send(await db.collection("guilds").findOne({ guildId: id }));
      }
    } catch (e) {
      res.send(e);
    }
  }
};

export default withSession(handler);
