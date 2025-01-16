import * as Yup from 'yup';

import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { useCallback, useEffect, useMemo } from 'react';

import { CustomFile } from '../../../components/upload';
import { LoadingButton } from '@mui/lab';
import { SolutionCategory } from 'src/@types/solution-category';
import { fData } from '../../../utils/formatNumber';
import { useForm } from 'react-hook-form';
import useSolutionCategory from 'src/hooks/useSolutionCategory';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<SolutionCategory, 'icon'> {
  icon: CustomFile | string;
}

type Props = {
  isEdit: boolean;
  currentSolutionCategory?: SolutionCategory;
};

export default function SolutionCategoryNewEditForm({ isEdit, currentSolutionCategory }: Props) {
  const { createSolutionCategory, updateSolutionCategory } = useSolutionCategory();

  const NewSolutionCategorySchema = Yup.object().shape({
    icon: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
    title: Yup.string().required('Title is required'),
  });
  const defaultValues = useMemo(
    () => ({
      icon: currentSolutionCategory?.icon || '',
      title: currentSolutionCategory?.title || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSolutionCategory]
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewSolutionCategorySchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentSolutionCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentSolutionCategory]);

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      createSolutionCategory({
        file: data.icon,
        title: data.title,
      });
    } else {
      updateSolutionCategory({
        _id: currentSolutionCategory?._id as string,
        file: data.icon,
        title: data.title,
      });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'icon',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="icon"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Icon allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <RHFTextField name="title" label="Title" />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Solution Category' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
