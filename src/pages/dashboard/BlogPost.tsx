import { BlogPostHero, BlogPostTags } from 'src/sections/@dashboard/blog';
import { Box, Button, Card, Container, Divider, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { paramCase, sentenceCase } from 'change-case';

import GraphqlPostRepository from 'src/apis/graphql/post';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Markdown from 'src/components/MarkDown';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { Post } from '../../@types/post';
import { SkeletonPost } from '../../components/skeleton';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function BlogPost() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const { _id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useQuery(
    ['fetchPost', _id],
    () =>
      GraphqlPostRepository.fetchPost({
        postInput: {
          _id: _id as string,
        },
      }),
    {
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy bài viết!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          setPost(data.data.post);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
          setError(data.errors[0].message);
        }
      },
    }
  );

  return (
    <Page title="Blog: Post Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Post Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.posts },
            { name: sentenceCase(_id as string) },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.blog.edit(paramCase(_id as string))}
            >
              Edit
            </Button>
          }
        />

        {post && (
          <Card>
            <BlogPostHero post={post} />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {post.description}
              </Typography>

              <Markdown children={post.body} />

              <Box sx={{ my: 5 }}>
                <Divider />
                <BlogPostTags post={post} />
                <Divider />
              </Box>
            </Box>
          </Card>
        )}

        {!post && !error && <SkeletonPost />}

        {error && <Typography variant="h6">404 {error}!</Typography>}
      </Container>
    </Page>
  );
}
