import { Request, Response } from "express";
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

