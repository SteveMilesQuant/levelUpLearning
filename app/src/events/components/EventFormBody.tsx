import { Stack, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'
import ImageDropzone from '../../components/ImageDropzone';
import { FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { FormData } from "../hooks/useEventForm";
import { useState } from 'react';
import EventTitleImage from './EventTitleImage';
import FlexTextarea from '../../components/FlexTextarea';
import InputError from '../../components/InputError';

interface Props {
    register: UseFormRegister<FormData>;
    getValues: UseFormGetValues<FormData>;
    errors: FieldErrors<FormData>;
    isReadOnly?: boolean;
}

const EventFormBody = ({ register, getValues, errors, isReadOnly }: Props) => {
    const [titleImage, setTitleImage] = useState<{ file: File; url: string } | undefined>();
    const onTitleImageDrop = (files: File[]) => {
        if (files.length === 0) return;
        setTitleImage({ file: files[0], url: URL.createObjectURL(files[0]) });
    }
    const onTitleImageDelete = () => {
        setTitleImage(undefined);
    }

    const onCarouselImageDrop = (files: File[]) => {
    }
    const onCarouselImageDelete = () => {

    }

    return (
        <Stack spacing={5}>
            <FormControl>
                <FormLabel>Title text</FormLabel>
                <InputError
                    label={errors.title?.message}
                    isOpen={errors.title ? true : false}
                >
                    <Input
                        {...register("title")}
                        type="text"
                        isReadOnly={isReadOnly}
                    />
                </InputError>
            </FormControl>
            <FormControl>
                <FormLabel>Title image</FormLabel>
                <Stack spacing={3}>
                    {titleImage && <EventTitleImage src={titleImage.url} alt="Title Image" onDelete={onTitleImageDelete} />}
                    {!isReadOnly && !titleImage && <ImageDropzone onDrop={onTitleImageDrop} />}
                </Stack>
            </FormControl>
            <FormControl>
                <FormLabel>Introduction</FormLabel>
                {isReadOnly && <FlexTextarea value={getValues("intro") || ""} />}
                {!isReadOnly &&
                    <InputError
                        label={errors.intro?.message}
                        isOpen={errors.intro ? true : false}
                    >
                        <Input
                            {...register("intro")}
                            as={Textarea}
                            size="xl"
                            height="15rem"
                            isReadOnly={false}
                        />
                    </InputError>
                }
            </FormControl>
            <FormControl>
                <FormLabel>Carousel Images</FormLabel>
                {!isReadOnly && <ImageDropzone onDrop={onCarouselImageDrop} />}
            </FormControl>
        </Stack>
    )
}

export default EventFormBody