import { Stack, FormControl, FormLabel, Input, Textarea, HStack, Text } from '@chakra-ui/react'
import ImageDropzone from '../../components/ImageDropzone';
import { FieldErrors, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { FormData } from "../hooks/useEventForm";
import EventTitleImage from './EventTitleImage';
import FlexTextarea from '../../components/FlexTextarea';
import InputError from '../../components/InputError';
import DeleteButton from '../../components/DeleteButton';
import EditableImage from '../../components/EditableImage';
import ActionButton from '../../components/ActionButton';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { ImageFile } from '../../interfaces/Image';



interface Props {
    register: UseFormRegister<FormData>;
    getValues: UseFormGetValues<FormData>;
    errors: FieldErrors<FormData>;
    isReadOnly?: boolean;
    titleImage?: ImageFile;
    setTitleImage: (imageFile?: ImageFile) => void;
    carouselImages: ImageFile[];
    setCarouselImages: (imageList: ImageFile[]) => void;
    imageDeleteList?: ImageFile[];
    setImageDeleteList?: (imageList: ImageFile[]) => void;
}

const EventFormBody = ({ register, getValues, errors, isReadOnly, titleImage, setTitleImage, carouselImages, setCarouselImages, imageDeleteList, setImageDeleteList }: Props) => {
    const handleTitleImageDrop = (files: File[]) => {
        if (files.length === 0) return;
        setTitleImage({ image: { id: undefined, url: URL.createObjectURL(files[0]), list_index: 0 }, file: files[0] });
    }
    const handleTitleImageDelete = () => {
        if (titleImage && titleImage.image.id && setImageDeleteList) {
            setImageDeleteList([...(imageDeleteList || []), titleImage]);
        }
        setTitleImage(undefined);
    }


    const handleCarouselImageDrop = (files: File[]) => {
        if (files.length === 0) return;
        const newImage = { image: { url: URL.createObjectURL(files[0]), list_index: carouselImages.length }, file: files[0] };
        setCarouselImages([...carouselImages, newImage]);
    }
    const handleCarouselImageDelete = (index: number) => {
        const newList: ImageFile[] = carouselImages
            .filter(i => i.image.list_index != index)
            .map(i => i.image.list_index < index ? i : { image: { ...i.image, list_index: i.image.list_index - 1 }, file: i.file });
        const deleteImage = carouselImages[index];
        if (deleteImage.image.id && setImageDeleteList) {
            setImageDeleteList([...(imageDeleteList || []), deleteImage]);
        }
        setCarouselImages(newList);
    }
    const handleMoveImageUp = (index: number) => {
        if (index === 0) return;
        const listPartOne = carouselImages.filter(i => i.image.list_index < index - 1);
        const listPartTwo = carouselImages.filter(i => i.image.list_index > index);
        const newImageOne = {
            image: { ...carouselImages[index].image, list_index: index - 1 }, file: carouselImages[index].file
        };
        const newImageTwo = {
            image: { ...carouselImages[index - 1].image, list_index: index }, file: carouselImages[index - 1].file
        };
        const newList = [...listPartOne, newImageOne, newImageTwo, ...listPartTwo];
        setCarouselImages(newList);
    }
    const handleMoveImageDown = (index: number) => {
        if (index === carouselImages.length - 1) return;
        const listPartOne = carouselImages.filter(i => i.image.list_index < index);
        const listPartTwo = carouselImages.filter(i => i.image.list_index > index + 1);
        const newImageOne = {
            image: { ...carouselImages[index].image, list_index: index + 1 }, file: carouselImages[index + 1].file
        };
        const newImageTwo = {
            image: { ...carouselImages[index].image, list_index: index }, file: carouselImages[index].file
        };
        setCarouselImages([...listPartOne, newImageOne, newImageTwo, ...listPartTwo]);
    }

    return (
        <Stack spacing={5}>
            <FormControl>
                <FormLabel>Title (internal use only)</FormLabel>
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
                    {titleImage &&
                        <EventTitleImage src={titleImage.image.url} alt="Title Image"
                            buttonSet={
                                isReadOnly ? [] : [<DeleteButton onConfirm={handleTitleImageDelete}>Title Image</DeleteButton>]
                            } />}
                    {!isReadOnly && !titleImage && <ImageDropzone onDrop={handleTitleImageDrop} />}
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
                <Stack spacing={3} >
                    {carouselImages?.map(
                        (image, index) =>
                            <EditableImage key={index} src={image.image.url} alt={"Carousel Image " + index} height={{ base: 500 }}
                                buttonSet={
                                    isReadOnly ? [] :
                                        [
                                            <ActionButton
                                                Component={FaArrowUp}
                                                label="Move up"
                                                onClick={() => handleMoveImageUp(index)}
                                                disabled={index === 0}
                                            />,
                                            <ActionButton
                                                Component={FaArrowDown}
                                                label="Move down"
                                                onClick={() => handleMoveImageDown(index)}
                                                disabled={index === carouselImages.length - 1}
                                            />,
                                            <DeleteButton onConfirm={() => handleCarouselImageDelete(index)}>{"Carousel Image " + index}</DeleteButton>
                                        ]} />
                    )}
                    {!isReadOnly && <ImageDropzone onDrop={handleCarouselImageDrop} />}
                </Stack>
            </FormControl>
            <FormControl>
                <FormLabel>Link</FormLabel>
                <Stack spacing={1}>
                    <HStack>
                        <Text>URL:</Text>
                        <InputError
                            label={errors.link_url?.message}
                            isOpen={errors.link_url ? true : false}
                        >
                            <Input
                                {...register("link_url")}
                                type="text"
                                isReadOnly={isReadOnly}
                            />
                        </InputError>
                    </HStack>
                    <HStack>
                        <Text>Text:</Text>
                        <InputError
                            label={errors.link_text?.message}
                            isOpen={errors.link_text ? true : false}
                        >
                            <Input
                                {...register("link_text")}
                                type="text"
                                isReadOnly={isReadOnly}
                            />
                        </InputError>
                    </HStack>
                </Stack>
            </FormControl>
        </Stack>
    )
}

export default EventFormBody