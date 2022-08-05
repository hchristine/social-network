import { Request, Response } from "express";
import { BlockList } from "../blocklist/blocklist.model";
import { Friends } from "./friend.model";

export async function sendFriendRequest(req: Request, res: Response) {
    const { sendTo } = req.body;
    const { id: sendBy } = req.user!;

    if (+sendTo === +sendBy) {
        res.status(400).send();
        return;
    }

    const isAllowed = await BlockList.isFriendshipPossible(sendBy, sendTo);

    if (!isAllowed) {
        res.status(403).send();
        return;
        
    }

    await Friends.create({
        sendTo,
        sendBy
    });
    res.send();
}

export async function acceptRequest(req: Request, res: Response) {
    const { sendBy } = req.body;
    const { id: sendTo } = req.user!;

    await Friends.acceptRequest(sendBy, sendTo);

    res.send();
}

export async function rejectRequest(req: Request, res: Response) {
    const { sendBy } = req.params;
    const { id: sendTo } = req.user!;

    await Friends.rejectRequest(+sendBy, sendTo);

    res.send();
}

export async function getPendingRequests(req: Request, res: Response) {
    const { id: sendBy } = req.user!;
    const requests = await Friends.getPendingRequests(sendBy);
    res.json(requests);
}