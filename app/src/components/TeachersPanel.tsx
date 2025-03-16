import { useBreakpointValue } from "@chakra-ui/react"
import karen from "../assets/karen.webp";
import karen_carousel from "../assets/karen_carousel.webp";
import megan from "../assets/megan.webp";
import TeachersPanelImages from "./TeachersPanelImages";
import { TeachersPanelCarousel } from "./TeachersPanelCarousel";

const TeachersPanel = () => {
    const karenImage = useBreakpointValue({
        base: karen_carousel,
        xl: karen
    }) || karen;
    const teacherImageList = [
        { src: megan, alt: "Megan Miller" },
        { src: karenImage, alt: "Karen Miles" },
    ];
    const Component = useBreakpointValue({
        base: () => <TeachersPanelCarousel imageList={teacherImageList} />,
        xl: () => <TeachersPanelImages imageList={teacherImageList} />
    });

    return Component ? <Component /> : null;
}

export default TeachersPanel