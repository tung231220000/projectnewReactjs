import * as Yup from 'yup';

import { Box, Card, Grid, Typography, styled } from '@mui/material';
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
import GraphqlServiceRepository, {
  CreateServicePayload,
  UpdateServicePayload,
} from 'src/apis/graphql/service';
import ServiceRepository, { UploadThumbnailPayload } from 'src/apis/service/service';
import { useCallback, useEffect, useMemo } from 'react';

import { CustomFile } from 'src/components/upload';
import { DTS_TELECOM_BACKEND_API_DOMAIN } from 'src/utils/constant';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Service } from 'src/@types/service';
import { Trademark } from 'src/@types/trademark';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<Service, 'thumbnail' | 'trademark'> {
  thumbnail: CustomFile | string;
  trademark: string;
}

type Props = {
  isEdit: boolean;
  trademarks: Trademark[];
  currentService?: Service;
};

export default function ServiceNewEditForm({ isEdit, trademarks, currentService }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewServiceSchema = Yup.object().shape({
    key: Yup.string().required('Key is required'),
    thumbnail: Yup.mixed().test('required', 'Thumbnail is required', (value) => value !== ''),
    trademark: Yup.string().required('Trademark is required'),
  });
  const defaultValues = useMemo(
    () => ({
      key: currentService?.key || '',
      thumbnail: currentService?.thumbnail || '',
      trademark: currentService?.trademark._id || trademarks[0]._id,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentService]
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewServiceSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: mutateAsyncUploadThumbnail } = useMutation(
    (payload: UploadThumbnailPayload) => ServiceRepository.uploadThumbnail(payload),
    {
      onError() {
        enqueueSnackbar('Không thể upload ảnh banner!', {
          variant: 'error',
        });
      },
    }
  );
  const { mutateAsync: mutateAsyncCreateService } = useMutation(
    (payload: CreateServicePayload) => GraphqlServiceRepository.createService(payload),
    {
      onError() {
        enqueueSnackbar('Không thể tạo linh kiện!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Tạo linh kiện thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.service.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncUpdateService } = useMutation(
    (payload: UpdateServicePayload) => GraphqlServiceRepository.updateService(payload),
    {
      onError() {
        enqueueSnackbar('Không thể cập nhật linh kiện!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Cập nhật linh kiện thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.service.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );

  useEffect(() => {
    if (isEdit && currentService) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentService]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'thumbnail',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadThumbnail(filesData);
        setValue(`thumbnail`, `${DTS_TELECOM_BACKEND_API_DOMAIN}/${response.path}`);
      }
    },
    [mutateAsyncUploadThumbnail, setValue]
  );

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      mutateAsyncCreateService({
        serviceInput: data,
      });
    } else {
      mutateAsyncUpdateService({
        serviceInput: {
          ...data,
          _id: currentService?._id as string,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <div>
              <LabelStyle>Thumbnail</LabelStyle>
              <RHFUploadSingleFile name="thumbnail" maxSize={3145728} onDrop={handleDrop} />
            </div>

            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
                mt: 3,
              }}
            >
              <RHFTextField name="key" label="Key" />

              <RHFSelect name="trademark" label="Trademark">
                {trademarks.map((trademark) => (
                  <option key={trademark._id} value={trademark._id}>
                    {trademark.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {!isEdit ? 'Create Service' : 'Save Changes'}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
