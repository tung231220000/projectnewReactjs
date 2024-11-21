import { useLocation, useParams } from 'react-router';

import { BlogNewPostForm } from '../../sections/@dashboard/blog';
import { Container } from '@mui/material';
import GraphqlPostRepository from 'src/apis/graphql/post';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Page from '../../components/Page';
import { Post } from 'src/@types/post';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentPost, setCurrentPost] = useState<Post>();

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
          setCurrentPost(data.data.post);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );

  const isEdit = pathname.includes('edit');

  return (
    <Page title={!isEdit ? 'Blog: Create a new post' : 'Blog: Edit a post'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new post' : 'Edit Post'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: !isEdit ? 'New Post' : capitalCase(_id) },
          ]}
        />

        <BlogNewPostForm isEdit={isEdit} currentPost={currentPost} />
      </Container>
    </Page>
  );
}
