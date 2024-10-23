// config/server.ts - for server-side operations
import * as sdk from "node-appwrite";

export const {
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    INVENTORY_COLLECTION_ID,
    TEAM_COLLECTION_ID,
    ACCESS_COLLECTION_ID,
    ENDPOINT,
} = process.env;

const client = new sdk.Client();
client
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);

export const database = new sdk.Databases(client);
export const account = new sdk.Account(client);
export const users = new sdk.Users(client)