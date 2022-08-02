import { Request, Response } from "express";
import { Comment } from "./comment.model";

export async function createComment(req: Request, res: Response) {
    const { text, postId } = req.body;

    try {
        const comment = await Comment.create({
            text,
            postId,
            userId: req.user!.id
        });
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(400).send(error);
    }
}