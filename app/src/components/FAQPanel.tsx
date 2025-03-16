import { Stack, Image } from "@chakra-ui/react";
import spiral from "../assets/spiral.webp";
import GoofyText from "./GoofyText";
import FAQItem from "./FAQItem";

const FAQPanel = () => {
    return (
        <Stack bgColor="white"
            marginX={{ base: 2, xl: 20 }}
            paddingBottom={{ base: 3, xl: 10 }}
            marginY={{ base: 2, xl: 8 }}
            spacing={{ base: 2, xl: 5 }}
            justifyContent="center"
            borderRadius={{ base: 10, xl: 30 }}
            width={{ base: "90vw", md: "80vw", xl: "70vw" }}
        >
            <Image src={spiral} width="100%" />
            <GoofyText fontSize={{ base: 24, lg: 36, xl: 54 }}>Frequently Asked Questions</GoofyText>
            <FAQItem
                question="Where are you located?"
                answer="As a new small business, we are currently working toward attaining a permanent establishment in the Apex area. For now, we are renting out spaces from local venues including Cornerstone Presbyterian Church and Apex United Methodist Church." />
            <FAQItem
                question="Who can attend the camps?"
                answer="During summer camps, we are open to rising 1st through rising 6th graders, catering to children aged 6 to 12 years old. We do hold 2 hour clinics throughout the year for older students as well. " />
            <FAQItem
                question="What is the main focus of the camps?"
                answer="We prioritize developing literacy skills while ensuring that every child experiences fun, engaging, and challenging activities. Our programs are designed to cultivate enjoyment in the learning process, encouraging creativity and critical thinking." />
            <FAQItem
                question="How do you meet the needs of varying age groups?"
                answer="Grouping by Grades: This ensures that activities and instruction are tailored to their developmental stage. Leveled Reading Materials: This allows each camper to engage with texts appropriate to their reading proficiency. Varied Question Types and Vocabulary: This allows us to accommodate differing abilities and challenge campers at their individual levels." />
            <FAQItem
                question="How are students grouped during the camp?"
                answer="Campers are grouped into two categories:
1st, 2nd, and 3rd Grade Group
4th, 5th, and 6th Grade Group
This ensures that campers receive instruction and activities that align with their specific age and skill levels. However, we understand that proficiency levels can vary among individuals. Therefore, we allow for flexibility between the groups based on their demonstrated proficiency and comfort level." />
            <FAQItem
                question="What kind of private events do you offer?"
                answer="Looking for a unique, engaging event for your club, Girl Scout troop, or birthday celebration? We offer exciting 2-hour private events that blend fun, teamwork, and critical thinking. Participants will work together to solve a captivating mystery through hands-on activities that keep them engaged from start to finish.
Our events are designed to encourage collaboration and creativity, making them perfect for building teamwork and communication skills. We bring the fun to your location or can host the event at one of the church spaces we partner with.
Whether you're celebrating a birthday, earning a badge, or just looking for a memorable group experience, we provide an event that’s both educational and unforgettable!
" />
            <FAQItem
                question="What is the cancellation policy?"
                answer="We understand that circumstances may arise that require changes to camp enrollment. 
Cancellations made at least one week prior to the start of the camp will receive a full refund.
Cancellations made less than one week prior to the start of the camp will receive full credit for a future camp enrollment" />

            <FAQItem
                question="What does my child need to bring with them to camp?"
                answer="For full day campers: pack a lunch, two snacks, and a water bottle for your to stay energized throughout the day. Half day campers only need one snack and on AM campers need a lunch. 
At certain points in the day we use devices for activities so if your child has a chromebook/iPad/other device, please have them bring it. No problem, if not. 
" />
        </Stack>
    )
}

export default FAQPanel