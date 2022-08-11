import { Server, Socket } from "socket.io";
import http from 'http';

import { auth } from "../services/auth";
import { User } from "../module/users/user.model";
import { Storage } from "./cache";
import { Message } from "../module/messages/message.model";

export enum SocketEvent {
    Connection = 'connection',
    OnlineUsers = 'online-users',
    NewMessage = 'new-message',
    Disconnect = 'disconnect'
}

type NewMessagePayload = {
    userId: number,
    message: string
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

    private listenEvents() {
        this.io.on(SocketEvent.Connection, (socket) => {
            this.listenChatEvents(socket);
            this.emitCurrentOnlineUsers(socket);
            this.onDisconnect(socket);
        });
    }

    private useTokenValidation() {
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
                await this.storage.setSocketId(id, socket.id);
                await this.storage.setSocketUser(socket.id, user);
                next()
            } catch {
                next(new Error('Could not join the server'));
            }
        })
    }

    private listenChatEvents(socket: Socket) {
        socket.on(SocketEvent.NewMessage, async (payload: NewMessagePayload) => {
            const { userId, message } = payload;
            const { sockets } = this.io.of('/');

            const socketId = await this.storage.getSocketId(userId);

            if (socketId && sockets.has(socketId)) {
                const socket = sockets.get(socketId)!;
                socket.emit(SocketEvent.NewMessage, message);
            }

            const sender = await this.storage.getSocketUser(socket.id);

            if (sender) {
                Message.create({
                    content: message,
                    senderId: sender.id,
                    receiverId: userId,
                    isRead: !!socketId && sockets.has(socketId)
                });
            }
        });
    }

    private emitCurrentOnlineUsers(socket: Socket) {
        const keysIter = this.io.of('/').sockets.keys();
        const clients = Array.from(keysIter);
        const promises = clients.map(async (socketId) => {
            const user = await this.storage.getSocketUser(socketId);

            if (!user) { throw new Error(''); }
            return user;
        });

        Promise.all(promises)
            .then((result) => {
                this.io.emit(SocketEvent.OnlineUsers, result);
            });
    }

    private onDisconnect(socket: Socket) {
        socket.on(SocketEvent.Disconnect, () => this.emitCurrentOnlineUsers(socket));
    }
}