import { Button, HStack, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import FunInfoBox from './FunInfoBox'
import SectionTitle from './SectionTitle';
import { Carousel } from 'react-responsive-carousel';
import { useState } from 'react';

const FamilyTestimonials = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const showButtons = useBreakpointValue({ base: false, md: true });

    const spacing = { base: 2, lg: 5, xl: 8 };
    const fontSize = { base: 18, md: 24, lg: 30, xl: 34 };
    const width = { base: "80%", lg: "70%", xl: "60%" };
    const height = { base: 450, md: 450, lg: 550, xl: 650 };

    const quoteList = [
        '“My daughter attended a Level up Learning camp and I can’t say enough great things! The facility where they held the camp was impressive and my daughter had so much fun with the experience. The teachers who led the camp made everything exciting with mysteries and clues and rewards, and my daughter told me she can’t wait to sign up for the next session! I would definitely recommend this to any parent!”',

        'Our Girl Scout troop had the BEST time with Level Up. We had 13 girls in grades 2-5 and there were opportunities to work in smaller groups. It was so cool to see their different personalities working together across their different ages. The mix of use of technology and visuals/written riddles kept things interesting and meant that people with different skills got to lead at different times. It was definitely a challenge for a group of leaders to take turns but what a fantastic experience!! Thank you so much!',

        'My daughter had an amazing experience at the summer camp "Think Like a Lawyer", where they learned about and practiced debate and mock trials. The two wonderful teachers, Ms. Miles and Ms. Miller, are truly experienced educators. They prepared so many engaging activities for the campers, inspiring their creativity and critical thinking. This camp exceeded my expectations in every aspect. I would definitely send my daughter again whenever our schedule permits.',

        'My kid really enjoyed Writing and ELA camp with Ms.Miles and Ms. Miller last month. They prepared camp very well and support my kid on writing. It\'s a great academy camp for 4-7 grade with a mix of outdoor, indoor activities, reading, writing and discussion. Will keep coming back for sure! Thank you so much!',

        'This is our first time to join this summer camp, because we recently move to this area. My friend strongly recommend this one for me. My son Andy so loves it! Everyday he is so excited to go to the camp, he used to be not school boy :). The teachers are very responsible, sweet and patient. Andy has leaned a lot and also makes new friends.',

        'My 5th grader and his friend 3rd grader had a great time at writing camp! He learned some strategies for writing a paper. I was surprised with the final paper he brought home on the last day. He enjoyed the camp with friends as well. I highly recommend Level Up Learning Camp!',

        'My son had the best experience at the EOG Prep Camp. Ms. Miles and Ms. Miller did an amazing job engaging him in the activities. He came out of the class with a giant smile and told me it was the best class ever because they made learning fun! He is more confident in his test-taking abilities following this class and I know he is well-prepared for his EOG. I highly recommend Level Up Learning to anyone with children taking EOG tests and anyone needing extra support. Thank you so much for making this such a wonderful and positive experience for my child.',

        'My daughter attended an EOG review class and had a great time. The instructors made reading fun with games and treats. They also sent home additional reading packets for practice.',

        'My daughter attended the Spring Break breakout camp and loved it. When you think of ELA camp, fun might not be the first thing to come to mind, but my daughter came home excited about all of the activities and had tons of FUN while learning. Ms. Miles and Ms.Miller are able to execute creative and exciting lessons where the kids don\'t even realize they are learning...definitely an art! We will be back!',
    ];


    const handlePrev = () => {
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : prev);
    };

    const handleNext = () => {
        setSelectedIndex((prev) => prev < quoteList.length - 1 ? prev + 1 : prev); // Wrap-around logic
    };


    return (
        <Stack fontFamily="kent" width={width} spacing={spacing} paddingY={spacing}>
            <SectionTitle textLines={["OUR FAMILIES SAY:"]} />
            <Carousel
                selectedItem={showButtons && selectedIndex || undefined}
                onChange={showButtons ? (index) => setSelectedIndex(index) : undefined}
                autoPlay={false}
                infiniteLoop={false}
                // interval={3000}
                showStatus={false}
                showThumbs={false}
                showArrows={false}
                showIndicators={false}
            >
                {quoteList.map((quote, index) =>
                    <Stack height={height} marginX={2} justify="start">
                        <FunInfoBox key={index}>
                            <Text fontFamily="roboto" textColor="brand.primary" textAlign="center" fontSize={fontSize} lineHeight={1.2}>
                                {quote}
                            </Text>
                        </FunInfoBox>
                    </Stack>
                )}
            </Carousel>

            {showButtons &&
                <HStack width="full" justify="space-around">
                    <Button variant="outline" isDisabled={selectedIndex === 0} onClick={handlePrev}>
                        <Text textColor="brand.gradient2" textAlign="center" fontSize={fontSize}>Prev</Text>
                    </Button>
                    <Button variant="outline" isDisabled={selectedIndex === quoteList.length - 1} onClick={handleNext}>
                        <Text textColor="brand.gradient2" textAlign="center" fontSize={fontSize}>Next</Text>
                    </Button>
                </HStack>
            }
        </Stack >
    )
}

export default FamilyTestimonials