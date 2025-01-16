import React from "react";
import * as Yup from 'yup';

import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import GraphqlPartnerRepository, {
  CreatePartnerPayload,
  UpdatePartnerPayload,
} from 'src/apis/graphql/partner';
import PartnerRepository, { UploadLogoPayload } from 'src/apis/service/partner';
import { useCallback, useEffect, useMemo } from 'react';

import { CustomFile } from 'src/components/upload';
import { DTS_TELECOM_BACKEND_API_DOMAIN } from 'src/utils/constant';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Partner } from 'src/@types/partner';
import { fData } from 'src/utils/formatNumber';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<Partner, 'logo'> {
  logo: CustomFile | string;
}

type Props = {
  isEdit: boolean;
  currentPartner?: Partner;
};

export default function PartnerNewEditForm({ isEdit, currentPartner }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewPartnerSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    logo: Yup.mixed().test('required', 'Logo is required', (value) => value !== ''),
  });
  const defaultValues = useMemo(
    () => ({
      name: currentPartner?.name || '',
      logo: currentPartner?.logo || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPartner]
  );
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewPartnerSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: mutateAsyncUploadLogo } = useMutation(
    (payload: UploadLogoPayload) => PartnerRepository.uploadLogo(payload),
    {
      onError() {
        enqueueSnackbar('Không thể upload logo!', {
          variant: 'error',
        });
      },
    }
  );
  const { mutateAsync: mutateAsyncCreatePartner } = useMutation(
    (payload: CreatePartnerPayload) => GraphqlPartnerRepository.createPartner(payload),
    {
      onError() {
        enqueueSnackbar('Không thể tạo đối tác!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Tạo đối tác thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.partner.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncUpdatePartner } = useMutation(
    (payload: UpdatePartnerPayload) => GraphqlPartnerRepository.updatePartner(payload),
    {
      onError() {
        enqueueSnackbar('Không thể cập nhật đối tác!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Cập nhật đối tác thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.partner.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );

  useEffect(() => {
    if (isEdit && currentPartner) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPartner]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'logo',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = async (data: FormValuesProps) => {
    const { name, logo } = data;
    let payload = undefined;

    if (typeof logo === 'string') {
      payload = {
        partnerInput: {
          name,
          logo,
        },
      };
    } else {
      const response = await mutateAsyncUploadLogo({ file: logo });

      payload = {
        partnerInput: {
          name,
          logo: `${DTS_TELECOM_BACKEND_API_DOMAIN}/${response.path}`,
        },
      };
    }

    if (!isEdit) {
      mutateAsyncCreatePartner(payload);
    } else {
      mutateAsyncUpdatePartner({
        partnerInput: {
          ...payload.partnerInput,
          _id: currentPartner?._id as string,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="logo"
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
            <RHFTextField name="name" label="Name" />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Partner' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
