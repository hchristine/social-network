import { Request, Response } from "express";
import { Op } from "sequelize";
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
    try {
        await Friends.create({
            sendTo,
            sendBy
        });
        res.send();
    }
    catch {
        res.status(500).send();
    }
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

export async function unFriend(req: Request, res: Response) {
    const friendId = +req.params.friendId;

    // debugger;
    await Friends.destroy({
        where: {
            [Op.or]: [
                { sendBy: req.user!.id, sendTo: friendId },
                { sendTo: req.user!.id, sendBy: friendId }
            ]
        }
    });

    res.send();
}