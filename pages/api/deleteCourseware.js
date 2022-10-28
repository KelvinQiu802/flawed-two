import prisma from "../../db/prisma";
import verify from "./verify";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const token = req.headers.token;
  const user = await verify(token);
  if (user) {
    let _ = await prisma.courseware.delete({
      where: {
        coursewareId: body.coursewareId,
      },
    });

    res.status(200).json({ res: true });
    return;
  }
  res.status(403).json();
  return;
}
