import * as Yup from 'yup';

import { Alert, IconButton, InputAdornment, Stack } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { GENDERS, phoneRegExp } from 'src/utils/constant';

import { Gender } from 'src/apis/graphql/user';
import Iconify from '../../../components/Iconify';
import { LoadingButton } from '@mui/lab';
import useAuth from '../../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  surnameAndMiddleName: string;
  name: string;
  gender: Gender;
  phoneNumber: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    surnameAndMiddleName: Yup.string().required('Surname and middle name required'),
    name: Yup.string().required('Name required'),
    gender: Yup.string().required('Vui lòng chọn giới tính!'),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
      .required('Vui lòng nhập số điện thoại!'),
  });

  const defaultValues = {
    email: '',
    password: '',
    surnameAndMiddleName: '',
    name: '',
    gender: Gender.MR,
    phoneNumber: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await register(data);
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', { ...error, message: error.message });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="surnameAndMiddleName" label="Surname and middle name" />
          <RHFTextField name="name" label="Name" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect name="gender" label="Gender">
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </RHFSelect>
          <RHFTextField name="phoneNumber" label="Phone number" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
