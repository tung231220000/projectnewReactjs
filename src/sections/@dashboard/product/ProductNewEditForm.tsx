import * as Yup from 'yup';

import {
  Autocomplete,
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
import GraphqlProductRepository, {
  CreateProductPayload,
  UpdateProductPayload,
} from 'src/apis/graphql/product';
import ProductRepository, { UploadBannerImagePayload } from 'src/apis/service/product';
import { useCallback, useEffect, useMemo } from 'react';

import { Advantage } from 'src/@types/advantage';
import { BonusService } from 'src/@types/bonus-service';
import { Category } from 'src/@types/category';
import { CustomFile } from 'src/components/upload';
import { DTS_TELECOM_BACKEND_API_DOMAIN } from 'src/utils/constant';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Product } from 'src/@types/product';
import { QaA } from 'src/@types/QaA';
import { ServicePack } from 'src/@types/service-pack';
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

const TAGS = ['cloud', 'server'];

// ----------------------------------------------------------------------

interface FormValuesProps
  extends Omit<
    Product,
    'banner' | 'category' | 'advantages' | 'questionsAndAnswers' | 'servicePacks' | 'bonusServices'
  > {
  banner: CustomFile | string;
  category: string;
  advantages: string[];
  questionsAndAnswers: string[];
  servicePacks: string[];
  bonusServices: string[];
}

type Props = {
  categories: Category[];
  advantages: Advantage[];
  QaAs: QaA[];
  servicePacks: ServicePack[];
  bonusServices: BonusService[];
  isEdit: boolean;
  currentProduct?: Product;
};

export default function ProductNewEditForm({
  categories,
  advantages,
  QaAs,
  servicePacks,
  bonusServices,
  isEdit,
  currentProduct,
}: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncUploadBannerImage } = useMutation(
    (payload: UploadBannerImagePayload) => ProductRepository.uploadBannerImage(payload),
    {
      onError() {
        enqueueSnackbar('Không thể upload ảnh banner!', {
          variant: 'error',
        });
      },
    }
  );
  const { mutateAsync: mutateAsyncCreateProduct } = useMutation(
    (payload: CreateProductPayload) => GraphqlProductRepository.createProduct(payload),
    {
      onError() {
        enqueueSnackbar('Không thể tạo sản phẩm!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Tạo sản phẩm thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.product.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncUpdateProduct } = useMutation(
    (payload: UpdateProductPayload) => GraphqlProductRepository.updateProduct(payload),
    {
      onError() {
        enqueueSnackbar('Không thể cập nhật sản phẩm!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Cập nhật sản phẩm thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.product.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );

  const defaultValues = useMemo(
    () => ({
      key: currentProduct?.key || '',
      banner: currentProduct?.banner || '',
      category: currentProduct?.category._id || categories[0]._id,
      intro: currentProduct?.intro || '',
      title: currentProduct?.title || '',
      description: currentProduct?.description || '',
      advantages: currentProduct?.advantages.map((advantage) => advantage._id) || [],
      questionsAndAnswers: currentProduct?.questionsAndAnswers.map((QaA) => QaA._id) || [],
      tags: currentProduct?.tags || [],
      isContact: currentProduct ? currentProduct.isContact : true,
      servicePacks: currentProduct?.servicePacks.map((pack) => pack._id) || [],
      bonusServices: currentProduct?.bonusServices.map((service) => service._id) || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );
  const NewEditProductSchema = Yup.object().shape({
    key: Yup.string().required('Key is required'),
    banner: Yup.string().required('Banner is required'),
    category: Yup.string().required('Category is required'),
    intro: Yup.string().required('Intro is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    advantages: Yup.array().min(1, 'Advantage is required'),
    questionsAndAnswers: Yup.array().min(1, 'Q&A is required'),
    tags: Yup.array().min(1, 'Tag is required'),
    servicePacks: Yup.array(),
    bonusServices: Yup.array(),
  });
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewEditProductSchema),
    defaultValues,
  });
  const {
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const watchIsContact = watch('isContact');

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  useEffect(() => {
    if (watchIsContact) {
      setValue('servicePacks', []);
      setValue('bonusServices', []);
    } else {
      setValue('servicePacks', defaultValues.servicePacks);
      setValue('bonusServices', defaultValues.bonusServices);
    }
  }, [defaultValues.bonusServices, defaultValues.servicePacks, setValue, watchIsContact]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'banner',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const filesData = new FormData();
        filesData.append(`file`, file);
        const response = await mutateAsyncUploadBannerImage(filesData);
        setValue(`banner`, `${DTS_TELECOM_BACKEND_API_DOMAIN}/${response.path}`);
      }
    },
    [mutateAsyncUploadBannerImage, setValue]
  );

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      mutateAsyncCreateProduct({
        productInput: data,
      });
    } else {
      mutateAsyncUpdateProduct({
        productInput: {
          ...data,
          _id: currentProduct?._id as string,
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
              <LabelStyle>Banner</LabelStyle>
              <RHFUploadSingleFile name="banner" maxSize={3145728} onDrop={handleDrop} />
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

              <RHFSelect name="category" label="Category">
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="title" label="Title" />

              <RHFTextField name="intro" label="Intro" />
            </Box>

            <Box sx={{ mt: 3 }}>
              <LabelStyle>Description</LabelStyle>
              <RHFEditor simple name="description" />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name="advantages"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(_event, newValue) => field.onChange(newValue)}
                      options={advantages.map((advantage) => advantage._id)}
                      renderOption={(props, advantageId) => {
                        const { title } = advantages.find(
                          (a) => a._id === advantageId
                        ) as Advantage;

                        return <li {...props}>{title}</li>;
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const foundAdvantage = advantages.find((a) => a._id === option);

                          return (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              size="small"
                              label={foundAdvantage?.title}
                            />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={ref}
                          error={invalid}
                          label="Advantages"
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="questionsAndAnswers"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(_event, newValue) => field.onChange(newValue)}
                      options={QaAs.map((QaA) => QaA._id)}
                      renderOption={(props, QaAId) => {
                        const { question } = QaAs.find((a) => a._id === QaAId) as QaA;

                        return <li {...props}>{question}</li>;
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const foundQaA = QaAs.find((s) => s._id === option);

                          return (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              size="small"
                              label={foundQaA?.question}
                            />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={ref}
                          error={invalid}
                          label="Question &#38; Answer"
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFSwitch name="isContact" label="Is Contact" />

                {!watchIsContact && (
                  <>
                    <Controller
                      name="servicePacks"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          freeSolo
                          onChange={(_event, newValue) => field.onChange(newValue)}
                          options={servicePacks.map((service) => service._id)}
                          renderOption={(props, servicePackId) => {
                            const { prices } = servicePacks.find(
                              (s) => s._id === servicePackId
                            ) as ServicePack;

                            return <li {...props}>{prices[0].name}</li>;
                          }}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                              const foundServicePack = servicePacks.find((s) => s._id === option);

                              return (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={option}
                                  size="small"
                                  label={foundServicePack?.prices[0].name}
                                />
                              );
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputRef={ref}
                              error={invalid}
                              label="Service Packs"
                              helperText={error?.message}
                            />
                          )}
                        />
                      )}
                    />

                    <Controller
                      name="bonusServices"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          freeSolo
                          onChange={(_event, newValue) => field.onChange(newValue)}
                          options={bonusServices.map((service) => service._id)}
                          renderOption={(props, bonusServiceId) => {
                            const { key, minValue, maxValue, unit } = bonusServices.find(
                              (s) => s._id === bonusServiceId
                            ) as BonusService;

                            return (
                              <li
                                {...props}
                              >{`${key} (${minValue} ${unit} -  ${maxValue} ${unit})`}</li>
                            );
                          }}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                              const { key, minValue, maxValue, unit } = bonusServices.find(
                                (s) => s._id === option
                              ) as BonusService;

                              return (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={option}
                                  size="small"
                                  label={`${key} (${minValue} ${unit} -  ${maxValue} ${unit})`}
                                />
                              );
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputRef={ref}
                              error={invalid}
                              label="Bonus Services"
                              helperText={error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </>
                )}
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Controller
                name="tags"
                control={control}
                rules={{ required: true }}
                render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={TAGS}
                    onChange={(_event, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          size="small"
                          label={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={ref}
                        error={invalid}
                        label="Tags"
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
