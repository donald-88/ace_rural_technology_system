// config/server.ts - for server-side operations
import * as sdk from "node-appwrite";

export const {
    NEXT_PUBLIC_PROJECT_ID: PROJECT_ID,
    API_KEY,
    NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
    NEXT_PUBLIC_INVENTORY_COLLECTION_ID: INVENTORY_COLLECTION_ID,
    NEXT_PUBLIC_TEAM_COLLECTION_ID: TEAM_COLLECTION_ID,
    NEXT_PUBLIC_ACCESS_COLLECTION_ID: ACCESS_COLLECTION_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client();
client
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);

export const database = new sdk.Databases(client);
export const account = new sdk.Account(client);
export const users = new sdk.Users(client)