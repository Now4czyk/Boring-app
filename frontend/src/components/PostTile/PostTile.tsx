import { FC, useState } from "react";
import {
  COMMENT_POST,
  FETCH_POST_BY_ID,
  GetPostById,
  LIKE_POST,
  PostPopulated,
} from "graphql/Post";
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, MD } from "utils";
import { Decoded } from "types";
import jwt_decode from "jwt-decode";
import useTranslation from "translations/hooks/useTranslations";
import { PostTilePopover } from "./Popovers/PostTilePopover";
import { Comment, Recommend, ThumbUp } from "@mui/icons-material";
import { UserComment } from "../Comment";
import { useMutation, useQuery } from "@apollo/client";

interface PostTileProps {
  post: PostPopulated;
}

export const PostTile: FC<PostTileProps> = ({ post: { id: postId } }) => {
  const navigate = useNavigate();
  const matches = useMediaQuery(MD);
  const { t } = useTranslation();
  const [content, setContent] = useState<string>("");
  const [commentMode, setCommentMode] = useState<boolean>(false);
  const { data, refetch } = useQuery<GetPostById>(FETCH_POST_BY_ID, {
    variables: { postId },
  });

  const [likePost] = useMutation(LIKE_POST, {
    variables: {
      postId,
    },
  });

  const [commentPost] = useMutation(COMMENT_POST, {
    variables: {
      postId,
      content,
    },
  });

  const isLiked = data?.getPostById.likes.find(
    (like) => like.id === jwt_decode<Decoded>(auth.getToken() || "").userId
  );

  const handleComment = async () => {
    if (content) {
      await commentPost();
      await refetch({
        variables: {
          postId,
        },
      });
      setContent("");
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid lightgray",
        borderRadius: "0.5rem",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Stack justifyContent="space-between" flexDirection="row">
        <Stack flexDirection="row">
          <Avatar sx={{ height: "2rem", width: "2rem" }} />
          <Typography
            sx={{
              cursor: "pointer",
              lineHeight: "2rem",
              marginLeft: "0.3rem",
              fontWeight: "500",
            }}
            onClick={() => navigate(`/users/${data?.getPostById.user.id}`)}
          >
            {`${data?.getPostById.user.firstName} ${data?.getPostById.user.lastName}`}
          </Typography>
          <Typography
            sx={{
              lineHeight: "2rem",
            }}
          >
            &nbsp;
            {new Date(
              parseInt(data?.getPostById.createdAt || "")
            ).toLocaleTimeString("pl", {
              hour: "2-digit",
              minute: "2-digit",
            }) +
              " " +
              new Date(
                parseInt(data?.getPostById.createdAt || "0")
              ).toLocaleDateString()}
          </Typography>
        </Stack>
        {jwt_decode<Decoded>(auth.getToken() || "").userId ===
          data?.getPostById.user.id && <PostTilePopover postId={postId} />}
      </Stack>
      <Typography
        sx={{
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "1.5rem",
          marginTop: "0.5rem",
        }}
        onClick={() => navigate(`/posts/${postId}`)}
      >
        {data?.getPostById.title}
      </Typography>
      <Typography align="justify">{data?.getPostById.description}</Typography>
      <Stack alignItems="center">
        <img
          src={data?.getPostById.imageUrl}
          style={{
            maxWidth: matches ? "40rem" : "20rem",
            marginTop: "1rem",
            maxHeight: matches ? "40rem" : "20rem",
          }}
        />
      </Stack>
      <Stack flexDirection="row">
        <Stack>
          <Stack flexDirection="row">
            <Recommend />
            <Typography>{data?.getPostById.likes.length}</Typography>
          </Stack>
          <Stack flexDirection="row">
            <Button
              variant={isLiked ? "contained" : "text"}
              onClick={async () => {
                await likePost();
                await refetch({
                  variables: {
                    postId,
                  },
                });
              }}
            >
              <ThumbUp />
              <Typography sx={{ marginLeft: "0.5rem" }}>
                {" "}
                {t("actions.like")}
              </Typography>
            </Button>
          </Stack>
        </Stack>
        <Stack>
          <Typography lineHeight="1.5rem">
            {data?.getPostById.comments.length +
              " " +
              t("post.comment", data?.getPostById.comments.length)}
          </Typography>
          <Stack flexDirection="row">
            <Button onClick={() => setCommentMode(!commentMode)}>
              <Comment />
              <Typography sx={{ marginLeft: "0.5rem" }}>
                {" "}
                {t("actions.comment")}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {commentMode && (
        <Stack
          sx={{
            border: "1px solid lightgray",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          {data?.getPostById.comments.map((comment) => (
            <UserComment comment={comment} />
          ))}
          <Box sx={{ width: "100%", display: "flex", margin: "0.5rem 0" }}>
            <TextField
              sx={{ width: "100%" }}
              variant="standard"
              color="primary"
              value={content}
              placeholder={t("actions.typeMessage")}
              focused
              onChange={(event) => setContent(event.target.value)}
              multiline
            />
            <Button sx={{ marginLeft: "1rem" }} onClick={handleComment}>
              {t("actions.comment")}
            </Button>
          </Box>
        </Stack>
      )}
    </Box>
  );
};
