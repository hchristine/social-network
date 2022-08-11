import { Request, Response } from "express";
import { Message } from "./message.model";

export async function getConversation(req: Request, res: Response) {
    const { id: receiverId } = req.params;
    const { id: senderId } = req.user!;

    if (Number.isNaN(+receiverId)) {
        res.status(400).send('Receiver id is not a number');
        return;
    }

    const conversation = await Message.getHistory(senderId, +receiverId);

    res.json(conversation);
}