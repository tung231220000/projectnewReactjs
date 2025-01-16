import * as Yup from 'yup';

import { Card, Stack, Typography } from '@mui/material';
import { FormProvider, RHFEditor, RHFTextField } from '../../../components/hook-form';
import { useEffect, useMemo } from 'react';

import { LoadingButton } from '@mui/lab';
import { QaA } from 'src/@types/QaA';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import useQaA from 'src/hooks/useQaA';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

type FormValuesProps = QaA;

type Props = {
  isEdit: boolean;
  currentQaA?: QaA;
};

export default function QaANewEditForm({ isEdit, currentQaA }: Props) {
  const { createQaA, updateQaA } = useQaA();

  const NewQaASchema = Yup.object().shape({
    question: Yup.string().required('Question is required'),
    answer: Yup.string().required('Answer is required'),
  });

  const defaultValues = useMemo(
    () => ({
      question: currentQaA?.question || '',
      answer: currentQaA?.answer || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQaA]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewQaASchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentQaA) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentQaA]);

  const onSubmit = async (data: FormValuesProps) => {
    if (!isEdit) {
      createQaA({
        questionAndAnswerInput: data,
      });
    } else {
      updateQaA({
        questionAndAnswerInput: {
          _id: currentQaA?._id as string,
          question: data.question,
          answer: data.answer,
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <RHFTextField name="question" label="Question" />

          <div>
            <LabelStyle>Content</LabelStyle>
            <RHFEditor simple name="answer" />
          </div>
        </Stack>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Create QaA' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
