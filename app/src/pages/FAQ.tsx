import { Heading, List, ListItem, Stack, Text } from '@chakra-ui/react'
import BodyContainer from '../components/BodyContainer'
import PageHeader from '../components/PageHeader'

const FAQ = () => {
    return (
        <BodyContainer>
            <PageHeader>FAQs</PageHeader>
            <Stack spacing={5} width={{ base: "100%", lg: "75%", xl: "50%" }}>
                <Stack spacing={3}>
                    <Heading fontSize="2xl">Who can attend the camps?</Heading>
                    <Text>We are open to rising 3rd through rising 7th graders, catering to children aged 8 to 12 years old.</Text>
                </Stack>
                <Stack spacing={3}>
                    <Heading fontSize="2xl">What is the focus of the camps?</Heading>
                    <Text>At Level Up Learning, we prioritize developing language arts skills while ensuring that every child experiences fun, engaging, and challenging activities. Our programs are designed to cultivate enjoyment in the learning process, encouraging creativity and critical thinking.</Text>
                </Stack>
                <Stack spacing={3}>
                    <Heading fontSize="2xl">How do you meet the needs of varying levels among campers?</Heading>
                    <Text>To address the diverse needs of our campers, we employ several strategies:</Text>
                    <List styleType="disc" stylePosition="inside" spacing={3}>
                        <ListItem>Grouping by Grades: Campers are placed into groups based on their grade levels, ensuring that activities and instruction are tailored to their developmental stage.</ListItem>
                        <ListItem>Utilization of Leveled Texts: We incorporate leveled reading materials, allowing each camper to engage with texts appropriate to their reading proficiency.</ListItem>
                        <ListItem>Varied Question Types and Vocabulary: Our curriculum incorporates a range of question types and vocabulary levels to accommodate differing abilities and challenge campers at their individual levels.</ListItem>
                    </List>
                </Stack>
                <Stack spacing={3}>
                    <Heading fontSize="2xl">How are students grouped during the camp?</Heading>
                    <Text>Campers are grouped into the following categories based on their grade levels:</Text>
                    <List styleType="disc" stylePosition="inside" spacing={3}>
                        <ListItem>3rd and 4th Grade Group</ListItem>
                        <ListItem>5th and 6th Grade Group</ListItem>
                        <ListItem>7th Grade Group</ListItem>
                    </List>
                    <Text>This grouping structure ensures that campers receive instruction and activities that align with their specific age and skill levels, fostering a supportive and enriching learning environment for all participants. However, we understand that proficiency levels can vary among individuals. Therefore, we allow for flexibility, enabling students to move up or down in grade groups based on their demonstrated proficiency and comfort level, ensuring that each child receives appropriate support and challenges.</Text>
                </Stack>
                <Stack spacing={3}>
                    <Heading fontSize="2xl">What is the cancellation policy?</Heading>
                    <Text>We understand that circumstances may arise that require changes to camp enrollment. Our cancellation policy is as follows:</Text>
                    <List styleType="disc" stylePosition="inside" spacing={3}>
                        <ListItem>Cancellations made at least one week prior to the start of the camp will receive a full refund.</ListItem>
                        <ListItem>Cancellations made less than one week prior to the start of the camp will receive a 50% refund or full credit for a future camp enrollment.</ListItem>
                    </List>
                </Stack>
            </Stack>
        </BodyContainer >
    )
}

export default FAQ