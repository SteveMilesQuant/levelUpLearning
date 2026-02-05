import { SimpleGrid, Stack } from '@chakra-ui/react'
import LearnMoreItem from './LearnMoreItem'
import SectionTitle from './SectionTitle';

const LearnMoreGrid = () => {
    const gridColumns = { base: 2, lg: 2, xl: 4 };
    const spacing = { base: 2, lg: 5, xl: 8 };
    const paddingX = { base: 4, xl: 15 };
    const teaserBoxTitleFontSize = { base: 14, md: 24, lg: 28, xl: 28 };
    const teaserBoxLearnMoreFontSize = { base: 12, md: 22, lg: 24, xl: 24 };
    const teaserBoxHeight = { base: 100, md: 125, lg: 150, xl: 200 };

    return (
        <Stack fontFamily="kent" width="full" justify="space-around" paddingY={spacing} paddingX={{ base: 0, xl: 5 }}>
            <SectionTitle textLines={["SUMMER & TRACK OUT CAMPS", "CLINICS - PRIVATE EVENTS"]} />
            <SimpleGrid columns={gridColumns} paddingX={paddingX} spacing={spacing}>
                <LearnMoreItem
                    teaserBoxTitleFontSize={teaserBoxTitleFontSize}
                    teaserBoxLearnMoreFontSize={teaserBoxLearnMoreFontSize}
                    teaserBoxHeight={teaserBoxHeight}
                    title="EXPERT K-6 EDUCATORS"
                    desc="Our camps are run by certified, experienced K-6 teachers who bring professional expertise, a passion for learning, and a deep understanding of how to support and inspire young readers and writers."
                />
                <LearnMoreItem
                    teaserBoxTitleFontSize={teaserBoxTitleFontSize}
                    teaserBoxLearnMoreFontSize={teaserBoxLearnMoreFontSize}
                    teaserBoxHeight={teaserBoxHeight}
                    title="LITERACY FOCUS"
                    desc="Through grade-based instructional groups, campers receive targeted support aligned to their reading and writing levels, with activities intentionally designed to meet literacy goals in a fun, engaging, and memorable way."
                />
                <LearnMoreItem
                    teaserBoxTitleFontSize={teaserBoxTitleFontSize}
                    teaserBoxLearnMoreFontSize={teaserBoxLearnMoreFontSize}
                    teaserBoxHeight={teaserBoxHeight}
                    title="HANDS-ON LEARNING"
                    desc="Campers don’t just learn — they build, write, create, experiment, and explore."
                />
                <LearnMoreItem
                    teaserBoxTitleFontSize={teaserBoxTitleFontSize}
                    teaserBoxLearnMoreFontSize={teaserBoxLearnMoreFontSize}
                    teaserBoxHeight={teaserBoxHeight}
                    title="FUN & ENGAGING ACTIVITIES"
                    desc="Whether it’s collaborating on a comic book or solving an escape room, campers build confidence and connections that last."
                />
            </SimpleGrid>
        </Stack >
    )
}

export default LearnMoreGrid