import { Request, Response } from "express";
import { BlockList } from "./blocklist.model";

export async function blockUser(req: Request, res: Response) {
    const { blockedTo } = req.body;
    const { id: blockedBy } = req.user!;

    if (+blockedTo === +blockedBy) {
        res.status(400).send();
        return;
    }

    const alreadyBlocked = await BlockList.findOne({
        where: { blockedBy, blockedTo }
    });

    if (alreadyBlocked) {
        await BlockList.destroy({
            where: { blockedBy, blockedTo }
        });
    } else {
        await BlockList.create({
            blockedBy,
            blockedTo
        });
    }
    res.json();
}

export async function getSelfBlocklist(req: Request, res: Response) {
    const { id: blockedBy } = req.user!;
    const list = await BlockList.getBlockedUsers(blockedBy);
    res.json(list);
}