import { Request, Response } from "express";
import { CommentLike } from "./models/comment-like.model";
import { Comment } from "./models/comment.model";

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

export async function likeComment(req: Request, res: Response) {
    const { commentId } = req.body;
    const { id: userId } = req.user!;

    const alreadyLiked = await CommentLike.findOne({
        where: { commentId, userId }
    });

    if (alreadyLiked) {
        await CommentLike.destroy({
            where: { commentId, userId }
        });
    } else {
        await CommentLike.create({
            commentId,
            userId
        });
    }
    res.json();
}

export async function getCommentLikes(req: Request, res: Response) {
    const { id } = req.params;

    const likes = await CommentLike.findUsersForComment(+id);
    res.json(likes);
}