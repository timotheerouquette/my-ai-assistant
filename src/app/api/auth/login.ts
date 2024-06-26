import { setAuthCookie } from "@/app/auth";
import { NextApiRequest, NextApiResponse } from "next";

const checkUserAuthorized = (req: NextApiRequest): boolean => {
  const USERNAME = process.env.PROTECTED_USERNAME;
  const PASSWORD = process.env.PROTECTED_PASSWORD;

  const basicAuth = req.headers.authorization;

  if (basicAuth !== undefined) {
    const auth = basicAuth.split(" ")[1];
    const [user, pwd] = Buffer.from(auth, "base64").toString().split(":");

    if (user === USERNAME && pwd === PASSWORD) {
      return true;
    }
  }

  return false;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const isUserAuthorized = checkUserAuthorized(req);

    if (!isUserAuthorized) {
      return res
        .status(401)
        .setHeader("WWW-Authenticate", 'Basic realm="Secure Area"')
        .json({});
    }

    await setAuthCookie(req, res);

    // Redirect to homepage
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res.status(401).json(error);
  }
}
