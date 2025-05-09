import { SimpleGrid, Stack, useBreakpointValue } from '@chakra-ui/react'
import LearnMoreItem from './LearnMoreItem'
import SectionTitle from './SectionTitle';

const LearnMoreGrid = () => {
    const gridColumns = { base: 2, lg: 2, xl: 4 };
    const spacing = { base: 2, lg: 5, xl: 8 };
    const paddingX = { base: 5, xl: 20 };
    const sectionTitle = useBreakpointValue({
        base: ["SUMMER & TRACK OUT CAMPS", "CLINICS - PRIVATE EVENTS"],
        xl: ["SUMMER & TRACK OUT CAMPS - CLINICS - PRIVATE EVENTS"]
    });

    return (
        <Stack fontFamily="kent" width="full" spacing={spacing} paddingY={spacing}>
            <SectionTitle textLines={sectionTitle} />
            <SimpleGrid columns={gridColumns} paddingX={paddingX} spacing={spacing}>
                <LearnMoreItem title="EXPERT K-6 EDUCATORS" desc="Our camps are run by certified, experienced K-6 teachers who bring professional expertise, a passion for learning, and a deep understanding of how to support and inspire young readers and writers." />
                <LearnMoreItem title="LITERACY FOCUS" desc="Through grade-based instructional groups, campers receive targeted support aligned to their reading and writing levels, with activities intentionally designed to meet literacy goals in a fun, engaging, and memorable way." />
                <LearnMoreItem title="HANDS-ON LEARNING" desc="Campers don’t just learn — they build, write, create, experiment, and explore." />
                <LearnMoreItem title="FUN & ENGAGING ACTIVITIES" desc="Whether it’s collaborating on a comic book or solving an escape room, campers build confidence and connections that last." />
            </SimpleGrid>
        </Stack>
    )
}

export default LearnMoreGrid