import { Server } from "socket.io";
import http from 'http';

import { auth } from "../services/auth";
import { User } from "../module/users/user.model";
import { Storage } from "./cache";

export enum SocketEvent {
    Connection = 'connection',
    OnlineUsers = 'online-users',
}

export class SocketHandler {
    private io: Server;
    private storage: Storage;

    constructor(server: http.Server, storage: Storage) {
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:3001",
            }
        });
        this.storage = storage;
        this.useTokenValidation();
        this.listenEvents();

    }

    useTokenValidation() {
        this.io.use(async (socket, next) => {
            const { token } = socket.handshake.auth;
            try {
                const { id } = await auth.verify(token);
                const user = await User.findByPk(id, {
                    attributes: ['id', 'name']
                });
                if (user === null) {
                    next(new Error('User not found.'));
                    return;
                };
                await this.storage.setSocketUser(socket.id, user);
                next()
            } catch {
                next(new Error('Could not join the server'));
            }
        })
    }

    listenEvents() {
        this.io.on(SocketEvent.Connection, (socket) => {
            const keysIter = this.io.of('/').sockets.keys();
            const clients = Array.from(keysIter);
            const promises = clients.map(async (socketId) => {
                const user = await this.storage.getSocketUser(socketId);

                if (!user) { throw new Error(''); }
                return user;
            });

            Promise.all(promises)
                .then((result) => {
                    socket.emit(SocketEvent.OnlineUsers, result);
                });
        });
    }
}