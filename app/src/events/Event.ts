
import { Link } from "../interfaces/Link"
import { Image } from "../interfaces/Image"

export interface EventData {
    title: string;
    intro?: string;
    link?: Link;
}

export interface Event extends EventData {
    id: number;
    title_image?: Image;
    images?: Image[];
}