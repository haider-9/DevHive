import { Client, Account, Storage, OAuthProvider, Databases, ID } from 'appwrite';

const client = new Client();
const databases = new Databases(client);

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
const postCollectionId = process.env.NEXT_PUBLIC_POST_COLLECTION_ID;

if (!endpoint || !projectId || !databaseId) {
    throw new Error('Required Appwrite configuration is missing. Please check your environment variables.');
}

try {
    client
        .setEndpoint(endpoint)
        .setProject(projectId);
} catch (error) {
    console.error('Appwrite initialization error:', error);
    throw new Error('Failed to initialize Appwrite services');
}

export { client, OAuthProvider, databases, ID };
export const account = new Account(client);
export const storage = new Storage(client);
export const DATABASE_ID = databaseId;
export const POST_COLLECTION_ID = postCollectionId;
