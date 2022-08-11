import { Request, Response } from "express";
import { Op } from "sequelize";
import { sequelize } from "../../db/database";
import { auth } from "../../services/auth";
import { User } from './user.model';

export async function register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
        const user = await User.register({
            name,
            email,
            password,
        });

        const token = await auth.sign({
            id: user.id
        });
        res.json({ token });
    }
    catch (error) {
        res.status(400).send(error);
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        const user = await User.login({ email, password });
        const token = await auth.sign({
            id: user.id,
        });
        res.json({ token });
    }
    catch (error) {
        res.status(404).send(error);
    }
}

export async function edit(req: Request, res: Response) {
    const { name, email } = req.body;
    try {
        await User.update({ name, email }, { where: { id: req.user!.id } });
        res.send();
    }
    catch (error) {
        res.status(404).send(error);
    }
}

export async function getFeed(req: Request, res: Response) {
    const { id } = req.user!;
    const feed = await User.getFeed(id);
    res.json(feed);
}

export async function getAllUsers(req: Request, res: Response) {
    const allUsers = await User.findAll({
        where: {
            id: {
                [Op.ne]: req.user!.id
            }
        },
        attributes: {
            include: [[
                sequelize.literal(`(EXISTS((SELECT * FROM "Friends" 
                WHERE (("sendTo"=${req.user!.id} AND "sendBy"="User".id) OR ("sendTo"="User".id AND "sendBy"=${req.user!.id})) AND "requestStatus"='Accepted')))`),
                'isFriend'
            ], [
                sequelize.literal(`(EXISTS((SELECT * FROM "Friends" 
                WHERE (("sendTo"=${req.user!.id} AND "sendBy"="User".id) OR ("sendTo"="User".id AND "sendBy"=${req.user!.id})) AND "requestStatus"='Pending')))`),
                'hasPendingRequest'
            ], [
                sequelize.literal(`EXISTS(SELECT * FROM "BlockLists" WHERE "blockedBy" = ${req.user!.id} AND "blockedTo" = "User".id)`),
                'isBlocked'
            ]],
            exclude: ['password', 'createdAt', 'updatedAt']
        }
    });
    res.json(allUsers);
}