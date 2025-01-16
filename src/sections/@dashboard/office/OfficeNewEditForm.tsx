import React from "react";
import * as Yup from 'yup';

import { Card, Grid, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import GraphqlOfficeRepository, {
  CreateOfficePayload,
  UpdateOfficePayload,
} from 'src/apis/graphql/office';
import { useEffect, useMemo } from 'react';

import { LoadingButton } from '@mui/lab';
import { Office } from 'src/@types/office';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

type FormValuesProps = Office;

type Props = {
  isEdit: boolean;
  currentOffice?: Office;
};

export default function OfficeNewEditForm({ isEdit, currentOffice }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewOfficeSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    hotline: Yup.string().required('Hotline is required'),
    fax: Yup.string().required('Fax is required'),
    address: Yup.string().required('Address is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });
  const defaultValues = useMemo(
    () => ({
      name: currentOffice?.name || '',
      hotline: currentOffice?.hotline || '',
      fax: currentOffice?.fax || '',
      address: currentOffice?.address || '',
      email: currentOffice?.email || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOffice]
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewOfficeSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: mutateAsyncCreateOffice } = useMutation(
    (payload: CreateOfficePayload) => GraphqlOfficeRepository.createOffice(payload),
    {
      onError() {
        enqueueSnackbar('Không thể tạo văn phòng!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Tạo văn phòng thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.office.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncUpdateOffice } = useMutation(
    (payload: UpdateOfficePayload) => GraphqlOfficeRepository.updateOffice(payload),
    {
      onError() {
        enqueueSnackbar('Không thể cập nhật văn phòng!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Cập nhật văn phòng thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.office.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );

  useEffect(() => {
    if (isEdit && currentOffice) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentOffice]);

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      mutateAsyncCreateOffice({
        officeInput: data,
      });
    } else {
      mutateAsyncUpdateOffice({
        officeInput: {
          ...data,
          _id: currentOffice?._id as string,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Name" />

              <RHFTextField name="hotline" label="Hotline" />

              <RHFTextField name="fax" label="Fax" />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="address" label="Address" />

              <RHFTextField name="email" label="Email" />
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Office' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
