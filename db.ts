import { MongoClient, Db, Collection } from "mongodb";

type CollectionCache = {
  [name: string]: Collection;
};

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) throw new Error("MONGO_URI environment variable is undefined");

const DB_NAME = process.env.DB_NAME as string;
if (!DB_NAME) throw new Error("DB_NAME environment variable is undefined");

let client: MongoClient | null = null;
let cachedDb: Db | null = null;
const cachedCollections: CollectionCache = {};

const connect = async () => {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db(DB_NAME + (process.env.ENVIRONMENT || "dev"));
};

const getCollection = async (collectionName: string) => {
  if (!cachedDb) {
    cachedDb = await connect();
  }

  if (!cachedCollections[collectionName]) {
    cachedCollections[collectionName] = cachedDb.collection(collectionName);
  }

  return cachedCollections[collectionName];
};

export default getCollection;
