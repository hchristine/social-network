import { Request, Response } from 'express';
import { uploader } from '../../services/uploader';
import { User } from '../users/user.model';
import { Post } from './models/post.model';
import { rm } from 'fs/promises';
import { PostLike } from './models/post-likes.model';

export async function uploadPostImage(req: Request, res: Response) {
    if (!req.file?.path) {
        res.status(400).send();
        return;
    }

    const file = await uploader.resizeImage(req.file.path);
    const url = await uploader.upload(file);
    rm(file);

    res.send({
        url
    });
}

export async function createPost(req: Request, res: Response) {
    const { description, photos } = req.body;

    try {
        const post = await Post.create({
            description,
            photos,
            userId: req.user!.id
        });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(400).send(error);
    }
}

export async function getPost(req: Request, res: Response) {
    try {
        const post = await Post.findAll({
            include: [{
                model: User
            }]
        });
        res.json(post);
    }
    catch (error) {
        res.status(404).send();
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const post = await Post.findWithComments(Number(req.params.id));

        if (!post) {
            res.status(404).send();
            return;
        }
        res.json(post);
    }
    catch (error) {
        res.status(400).send(error);
    }
}

export async function likePost(req: Request, res: Response) {
    const { postId } = req.body;
    const { id: userId } = req.user!;

    const alreadyLiked = await PostLike.findOne({
        where: { postId, userId }
    })

    if (alreadyLiked) {
        await PostLike.destroy({
            where: { postId, userId }
        });
    } else {
        await PostLike.create({
            postId,
            userId
        });
    }

    res.json();
}

export async function getPostLikes(req: Request, res: Response) {
    const { id } = req.params;

    const likes = await PostLike.findUsersForPost(+id);
    res.json(likes);
}