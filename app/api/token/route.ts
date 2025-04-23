/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

import { initializeApp, getApps, getApp } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";

const Config = {};
const get = (obj: any, key: any, defaultValue: any) => {
  return defaultValue;
};

const firebaseAPIKey = get(
  Config,
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "AIzaSyBJ1Hcdu4G5H0N-rj7AF-N2SrJbvDxIqQo",
);
const firebaseAuthDomain = get(
  Config,
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "new-ieatta.firebaseapp.com",
);
const firebaseDatabaseUrl = get(
  Config,
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  "https://new-ieatta.firebaseio.com",
);
const firebaseProjectId = get(
  Config,
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "new-ieatta",
);
const firebaseStorageBucket = get(
  Config,
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "new-ieatta.appspot.com",
);
const firebaseMessagingSenderId = get(
  Config,
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "229321919225",
);
const firebaseAppId = get(
  Config,
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "1:229321919225:web:a33c8895c8e3cd6e9f3028",
);

const FIREBASE_WEB_CONFIGURE = {
  apiKey: firebaseAPIKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

const firebaseApp = !getApps().length
  ? initializeApp(FIREBASE_WEB_CONFIGURE)
  : getApp();
// const firebaseApp = initializeApp(FIREBASE_WEB_CONFIGURE);
const auth: Auth = getAuth(firebaseApp);

// http://localhost:3000/api/token?id_token=123
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const searchParams = new URL(req.url ?? "").searchParams;
  const idToken = searchParams.get("id_token");

  return NextResponse.json(
    { idToken },
    {
      status: 200,
    },
  );

  // const user = await auth.verifyIdToken(idToken ?? "");
  // if (user) {
  //   const custom_token = await auth.createCustomToken(user.uid);
  //   res.setHeader("Content-Type", "application/json");
  //   res.status(200).json({ custom_token });
  // } else {
  //   res.status(500).json({ error: "failed to create custom token" });
  // }
}
