import { createClient } from "redis";

type SocketUserInfo = {
    id: number;
    name: string;
}

export interface Storage {
    getSocketUser(socketId: string): Promise<SocketUserInfo | null>;
    setSocketUser(socketId: string, user: SocketUserInfo): Promise<void>;
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
}

export const cache = new Cache();