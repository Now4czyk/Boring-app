import { Post } from './types';
import { PostModel, UserModel } from '../../models';
import { Request } from 'express';
import { decodeToken } from '../../middleware/decodeToken';
import { Decoded } from '../User/types';
import { remove } from 'lodash';
const queries = {
  getAllPosts: async (_: ParentNode, args: any, req: Request) => {
    decodeToken(req);

    return await PostModel.find().populate('user');
  },
  getPostById: async (_: ParentNode, args: { id: string }, req: Request) => {
    decodeToken(req);

    return await PostModel.findById({ _id: args.id }).populate('user');
  },
};

const mutations = {
  createPost: async (
    _: ParentNode,
    { title, description, imageUrl }: Post,
    req: Request
  ) => {
    const decodedUser = decodeToken(req) as Decoded;

    const user = await UserModel.findOne({ _id: decodedUser.userId });

    if (user) {
      const post = await new PostModel({
        title,
        description,
        imageUrl,
        user: user.id,
      }).save();

      user.posts.push(post.id);
      user.save();

      return {
        id: post.id,
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    }

    return {
      id: 'ID!',
      title: 'String!',
      description: ' String!',
      imageUrl: 'String',
      createdAt: 'String!',
      updatedAt: 'String!',
    };
  },

  deletePost: async (_: ParentNode, { id }: { id: string }, req: Request) => {
    const decodedUser = decodeToken(req) as Decoded;
    const post = await PostModel.findOne({ _id: id }).populate('user');

    if (post?.user.id === decodedUser.userId) {
      await PostModel.deleteOne({ _id: id });
      const user = await UserModel.findOne({
        _id: decodedUser.userId,
      }).populate('posts');
      remove(user?.posts || [], (post) => post.id === id);
      await user?.save();
    }

    return post;
  },

  updatePost: async (
    _: ParentNode,
    { title, description, imageUrl, id }: Post & { id: string },
    req: Request
  ) => {
    const decodedUser = decodeToken(req) as Decoded;
    const post = await PostModel.findOne({ _id: id }).populate('user');

    if (post?.user.id === decodedUser.userId) {
      post?.title = title;
      post?.title = title;
      post?.title = title;
    }

    return post;
  },
};

export const resolvers = { queries, mutations };
