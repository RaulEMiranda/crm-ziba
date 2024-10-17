// firebaseAdmin.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // o utiliza una clave de servicio json
    // credential: admin.credential.cert({
    //   projectId: "your-project-id",
    //   clientEmail: "your-client-email",
    //   privateKey: "your-private-key"
    // }),
  });
}

const adminAuth = admin.auth();
export { adminAuth };
