import { createClient } from "redis";

type SocketUserInfo = {
    id: number;
    name: string;
}

export interface Storage {
    getSocketUser(socketId: string): Promise<SocketUserInfo | null>;
    setSocketUser(socketId: string, user: SocketUserInfo): Promise<void>;
    getSocketId(userId: number): Promise<string | null>;
    setSocketId(userId: number, socketId: string): Promise<void>;
}

class Cache implements Storage {
    private client: ReturnType<typeof createClient>;

    constructor() {
        this.client = createClient();
    }

    connect() {
        return this.client.connect();
    }

    async getSocketUser(socketId: string): Promise<SocketUserInfo | null> {
        const data = await this.client.get(socketId);

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    }

    async setSocketUser(socketId: string, user: SocketUserInfo): Promise<void> {
        const userStr = JSON.stringify(user);
        await this.client.set(socketId, userStr);
    }

    async getSocketId(userId: number) {
        return this.client.get(userId.toString());
    }

    async setSocketId(userId: number, socketId: string) {
        const userIdStr = userId.toString();
        await this.client.set(userIdStr, socketId);
    }
}

export const cache = new Cache();