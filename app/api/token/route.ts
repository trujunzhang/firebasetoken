/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse, NextRequest } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import type { ServiceAccount } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";

// https://github.com/expo/fyi/blob/main/creating-google-service-account.md
// issue: Could not load the default credentials.
// run the following commands:
//    gcloud auth application-default login
//    gcloud auth application-default set-quota-project new-ieatta

const serviceAccount: ServiceAccount = {
  projectId: "new-ieatta",
  // private_key_id: "1a0b1201fb3fddffd78e2cf6416a61364e244c48",
  privateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDyedIb7GAjDQYv\ncEt7Lix/Mc5R9cnybpGj55PunPcAxKvPOaJTz6HRMwuioX652SD940UXanQmr8a7\nqOqU17N7auUkourhTwCjiAg36Qu/DpQQM5Y9Eymir6vk/DMXc8zxKiv76dR12LA3\nRbTMl0A/tnoJIifTo9TUNd/Owc5/tq8Rr+9Iq+Y3mFZoQ9OilOlZsNBFefyRKMIM\no3FimDpESfDkkyzhWzoovKn1R3q8nRXV1ZWbcWB1V+cotqmthWTaYbanWcEqYOPX\nPz5AhcTKv4bRujvow/ArJxC4O9a7xL9GzB9w/1cYNNz68eOiXMNEuNXkzZWDVUvB\n32VGMjujAgMBAAECggEAZEN6XaCG+kdq7NfO5m8n6CqUqXBsoqoU4AUktxDB1Ff+\nwVAQLv7W5zXn1EZaLAg8K6+8BJw4zjx1/WgyI/zzkw+XE+ioHiV4Wqan21Kq0ER7\ndh2WvMd9Om/QsP2WNNbmAj0RdffxKg/BggF5avYKE65lVPyCInIG0f86/fhG5qi6\nKyDTymgwrWkUho9B6dn5Aofyhkjk90ed+hr5vKa6RGCHm7x0/ouNfdpKq3qsvdL/\nL85Hs87WDtcOGGQehSxMcWtqG22ANg6KdlHvILzkaB1cF6eDju372m2il6dVmtUc\nWZEYJoGTe7nymswPfuQl9lHGgxgeqwRvMI01xWtXdQKBgQD/qKZnEXO7SGqVyXBT\nxLYt3w1UDDBerV/ZesbgJWQj+cMeoaFgPV/+s1ZWKy/8s81dZG1KwIKfTwRoDHvS\nY+R8dwlT9DS0z8iYwmg8/5JdUUI5i5/WY31/G1aaxkuJlZd6S9q1RQ33D5SkPh3a\nq9gJjOyNcaARCM+UZ+uzTqCTpQKBgQDyzKqkHT3CZEvMVAeNBl1AvQtcPDPfdRyP\nn2Agu5c9dfM+4HUpno78vQMh4U7004eqeSY1SaIQH0hYaGQ/Hi9d/gf007rgNrpt\nu6x5+wMfQTVapAfEBo6hYxUCoa9o5asQdbZj0Cb07Kx/ydWzF9vvC3IsPk7rHr4E\nMz2NCLpPpwKBgAQUlwNSHfzBPSJC4s4Td6znwHi08Rixv7Pi58WwExcX52tXvRGi\nKSQRjLE3Yz6vR/nTnoLw66TLSBC5EkjbW0w5Qiba4PR51IPLpopCsf1XTK1KczSi\nxd//ebRisdXyU0aaa1U1UvG8h+zPKP7Se1I7s5LWW22qLFX8CqEEAkAZAoGBAIuG\ne6UVvLDh7AD+ZNxwxNP4DvgxDGokJYaPQrFsu6uxBVijqhCBso+gmpU0oaflive2\n6PMEXmI/Z9aOHtV6piOwYKgbqC9Co/19NM9gJNooId31lxTZ48rwYlmByohQOu6Z\nhndzXX+wJizFMs3ZLyT+gdzU7YsFvpIxU/ShCFfPAoGAMpEznghhpDx0W149CSsq\n9XJYtflitFfoDvup9kRwhxKT0JxOtXwXfRU/oL5/mj+nBfCi2R9ga+RLsNcJeONN\nDjkXVMpBNaeM+qUhyAcnlFIM9PEhZsTYE+GVKY0nRW7dHjD9lMCZs62PSnwu02Gs\nEFDHI9ZLm5EcxurJ4al1gIw=\n-----END PRIVATE KEY-----\n",
  clientEmail: "generate-customtoken@new-ieatta.iam.gserviceaccount.com",
  // client_id: "109371931717613691410",
  // auth_uri: "https://accounts.google.com/o/oauth2/auth",
  // token_uri: "https://oauth2.googleapis.com/token",
  // auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  // client_x509_cert_url:
  //   "https://www.googleapis.com/robot/v1/metadata/x509/generate-customtoken%40new-ieatta.iam.gserviceaccount.com",
  // universe_domain: "googleapis.com",
};

const firebaseApp = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

const auth: Auth = getAuth(firebaseApp);

// http://localhost:3000/api/token?id_token=123
export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url ?? "").searchParams;
  const idToken = searchParams.get("id_token");

  // const idToken = "";

  // return NextResponse.json(
  //   { idToken },
  //   {
  //     status: 200,
  //   },
  // );

  const user = await getAuth().verifyIdToken(idToken ?? "");
  if (user) {
    const custom_token = await getAuth().createCustomToken(user.uid);
    // res.setHeader("Content-Type", "application/json");
    // res.status(200).json({ custom_token });
    return NextResponse.json(
      { custom_token },
      // { user },
      {
        status: 200,
      },
    );
  } else {
    // res.status(500).json({ error: "failed to create custom token" });
    return NextResponse.json(
      { error: "failed to create custom token" },
      {
        status: 500,
      },
    );
  }
}
