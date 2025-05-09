import { SimpleGrid, Stack } from "@chakra-ui/react"
import SectionTitle from "../homepage/components/SectionTitle"
import LearnMoreItem from "../homepage/components/LearnMoreItem"

const LiteraryFocusPanel = () => {
    const spacing = { base: 2, md: 5, lg: 10 };
    const margin = { base: "5%", md: "10%", lg: "10%", xl: "20%" };

    return (
        <Stack fontFamily="kent" bgColor="white" width="full" spacing={spacing} paddingY={spacing}>
            <SectionTitle textLines={["LITERACY SKILLS WE INCORPORATE:"]} />
            <SimpleGrid columns={2} paddingX={margin} spacing={spacing}>
                <LearnMoreItem title="Reading Comprehension" desc="Campers practice understanding what they read by making connections, asking questions, and thinking about the meaning behind the text." />
                <LearnMoreItem title="Summarizing" desc="Campers learn to tell the most important parts of a story or article in their own words—without giving away too much or leaving out key points." />
                <LearnMoreItem title="Plot Development" desc="Campers break down the events of a story to understand how the problem, rising action, climax, and resolution all work together." />
                <LearnMoreItem title="Textual Evidence" desc="Campers learn how to go back into the text to find proof that supports their answers, ideas, or opinions." />
                <LearnMoreItem title="Context Clues" desc="Campers learn to use clues from the surrounding text to figure out the meaning of unfamiliar words—building vocabulary as they go!" />
                <LearnMoreItem title="Inferencing" desc="Campers use clues from the text and their own thinking to figure out what the author is showing but not directly saying." />
                <LearnMoreItem title="Theme" desc="Campers explore the deeper message or life lesson behind a story and learn how to explain what the author is trying to teach." />
                <LearnMoreItem title="Tone" desc="Campers discover how an author’s word choices help create a mood or feeling, like excitement, sadness, or humor. " />
                <LearnMoreItem title="Central Idea & Key Details" desc="Campers learn how to find the most important idea in a nonfiction passage and identify the key details that support it." />
                <LearnMoreItem title="Topic" desc="Campers practice identifying what a nonfiction text is mostly about in just a word or short phrase. " />
                <LearnMoreItem title="Characterization" desc="Campers explore how authors reveal what characters are like through their actions, words, thoughts, and how others respond to them." />
                <LearnMoreItem title="Author's Purpose" desc="Campers explore why an author wrote a text—whether it’s to inform, entertain, persuade, or express an idea." />
            </SimpleGrid>
        </Stack>
    )
}

export default LiteraryFocusPanel