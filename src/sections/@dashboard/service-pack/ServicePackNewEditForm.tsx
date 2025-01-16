import * as Yup from 'yup';

import {
  Autocomplete,
  Button,
  Card,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { useEffect, useMemo } from 'react';

import { ATTRIBUTE_KEYS } from 'src/utils/constant';
import { AttributeKey } from 'src/@types/product';
import Iconify from 'src/components/Iconify';
import { LoadingButton } from '@mui/lab';
import NumberFormat from 'react-number-format';
import { Price } from 'src/@types/price';
import { ServicePack } from 'src/@types/service-pack';
import usePrice from 'src/hooks/usePrice';
import useServicePack from 'src/hooks/useServicePack';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<ServicePack, 'prices'> {
  prices: string[];
}

type Props = {
  isEdit: boolean;
  currentServicePack?: ServicePack;
};

export default function ServicePackNewEditForm({ isEdit, currentServicePack }: Props) {
  const defaultValues = useMemo(
    () => ({
      prices: currentServicePack?.prices.map((price) => price._id) || [],
      attributes: currentServicePack?.attributes.map((attribute) => ({
        ...attribute,
        unit: attribute.unit ? attribute.unit : undefined,
      })) || [
        {
          key: AttributeKey.VCPU,
          value: '',
          name: '',
          unit: '',
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentServicePack]
  );

  const { prices: PRICES } = usePrice();
  const { enqueueSnackbar } = useSnackbar();

  const { createServicePack, updateServicePack } = useServicePack();

  const NewServicePackSchema = Yup.object().shape({
    prices: Yup.array().of(Yup.string()).min(1, 'Prices is required'),
    attributes: Yup.array(
      Yup.object().shape({
        key: Yup.string().required('Attribute key is required'),
        value: Yup.string().required('Attribute value is required'),
        name: Yup.string().required('Attribute name is required'),
        unit: Yup.string(),
      })
    ).min(1, 'at least 1 attribute'),
  });
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewServicePackSchema),
    defaultValues,
  });
  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  useEffect(() => {
    if (isEdit && currentServicePack) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentServicePack]);

  const handleAdd = () => {
    append({
      key: AttributeKey.VCPU,
      value: '',
      name: '',
      unit: '',
    });
  };

  const handleRemove = (index: number) => {
    if (fields.length === 1) {
      enqueueSnackbar('At least one attribute is required', {
        variant: 'error',
      });
      return;
    }
    remove(index);
  };

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      createServicePack({
        servicePackInput: data,
      });
    } else {
      updateServicePack({
        servicePackInput: {
          _id: currentServicePack?._id as string,
          prices: data.prices,
          attributes: data.attributes,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Controller
          name="prices"
          control={control}
          rules={{ required: true }}
          render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
            <Autocomplete
              {...field}
              multiple
              freeSolo
              onChange={(_event, newValue) => field.onChange(newValue)}
              options={PRICES.map((price) => price._id)}
              renderOption={(props, priceId) => {
                const { name, defaultPrice } = PRICES.find((p) => p._id === priceId) as Price;

                return (
                  <li {...props}>
                    {name}
                    &nbsp; (
                    <NumberFormat
                      value={defaultPrice}
                      displayType={'text'}
                      thousandSeparator
                      suffix={' VNĐ'}
                    />
                    )
                  </li>
                );
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const foundPrice = PRICES.find((p) => p._id === option);
                  const label = () => (
                    <>
                      {foundPrice?.name}
                      &nbsp; (
                      <NumberFormat
                        value={foundPrice?.defaultPrice}
                        displayType={'text'}
                        thousandSeparator
                        suffix={' VNĐ'}
                      />
                      )
                    </>
                  );

                  return (
                    <Chip {...getTagProps({ index })} key={option} size="small" label={label()} />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={ref}
                  error={invalid}
                  label="Prices"
                  helperText={error?.message}
                />
              )}
            />
          )}
        />

        <Typography variant="h6" sx={{ color: 'text.disabled', my: 3 }}>
          Attributes:
        </Typography>

        <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
          {fields.map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                <RHFSelect
                  name={`attributes[${index}].key`}
                  size="small"
                  label="Key"
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                >
                  {ATTRIBUTE_KEYS.map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFTextField
                  name={`attributes[${index}].value`}
                  size="small"
                  type="text"
                  label="Value"
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  name={`attributes[${index}].name`}
                  size="small"
                  label="Name"
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  name={`attributes[${index}].unit`}
                  size="small"
                  label="Unit"
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="eva:trash-2-outline" />}
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        <Button
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ flexShrink: 0 }}
          onClick={handleAdd}
        >
          Add new attribute
        </Button>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Create Service Pack' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
