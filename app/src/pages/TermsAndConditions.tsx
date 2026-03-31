import { Box, Link, ListItem, OrderedList, Stack, Text } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import BodyContainer from "../components/BodyContainer";

const TermsAndConditions = () => {
    return (
        <BodyContainer>
            <PageHeader>Terms & Conditions</PageHeader>
            <Stack spacing={3} fontSize={12}>
                <Text fontWeight="bold" fontSize={14}>
                    Level Up Learning NC SMS Terms of Service
                </Text>
                <Text>
                    Level Up Learning NC, LLC ("Company," "we," or "us") offers a mobile
                    messaging program (the "Program") which you agree to use and
                    participate in subject to these Mobile Messaging Terms and Conditions
                    and our{" "}
                    <Link href="/privacy" color="brand.primary" textDecoration="underline">
                        Privacy Policy
                    </Link>
                    . By opting in to or participating in the Program, you accept and
                    agree to these terms and conditions, including, without limitation,
                    your agreement to resolve any disputes with us through binding,
                    individual-only arbitration, as detailed in the "Dispute Resolution"
                    section below.
                </Text>

                <Text fontWeight="bold">Program Description</Text>
                <Text>
                    By opting in to the Program, you consent to receive recurring SMS/MMS
                    messages from Level Up Learning NC. These messages may include, but
                    are not limited to: enrollment confirmations, class and camp
                    reminders, schedule updates, event announcements, and other
                    notifications related to Level Up Learning NC programs and services.
                </Text>

                <Text fontWeight="bold">Opt-In</Text>
                <Text>
                    You may opt in to the Program by providing your phone number and
                    consenting to receive text messages during account registration or
                    through other methods as described on our website. By opting in, you
                    confirm that you are the account holder for the mobile number provided
                    or have the account holder's permission.
                </Text>

                <Text fontWeight="bold">Opt-Out</Text>
                <Box>
                    <Text fontWeight="bold">
                        You can cancel the SMS service at any time. Simply text "STOP" to
                        any message you receive from us. After you send the text message
                        "STOP" to us, we will send you a confirmation message to confirm
                        that you have been unsubscribed. After this, you will no longer
                        receive SMS messages from us. If you want to join again, sign up as
                        you did the first time and we will start sending SMS messages to you
                        again.
                    </Text>
                </Box>

                <Text fontWeight="bold">Help</Text>
                <Text>
                    If you are experiencing issues with the messaging program, you can
                    reply with the keyword HELP for more assistance, or you can get help
                    directly by contacting us:
                </Text>
                <Box paddingLeft={4}>
                    <Text>
                        Email:{" "}
                        <Link
                            href="mailto:info@leveluplearningnc.com"
                            color="brand.primary"
                            textDecoration="underline"
                        >
                            info@leveluplearningnc.com
                        </Link>
                    </Text>
                    <Text>Phone: (919) 439-0924</Text>
                </Box>

                <Text fontWeight="bold">Carrier Liability</Text>
                <Text>
                    Carriers are not liable for delayed or undelivered messages.
                </Text>

                <Text fontWeight="bold">Message & Data Rates</Text>
                <Text>
                    As always, message and data rates may apply for any messages sent to
                    you from us and to us from you. Message frequency varies based on your
                    account activity. If you have any questions about your text plan or
                    data plan, it is best to contact your wireless provider.
                </Text>

                <Text fontWeight="bold">Privacy</Text>
                <Text>
                    If you have any questions regarding privacy, please read our{" "}
                    <Link href="/privacy" color="brand.primary" textDecoration="underline">
                        Privacy Policy
                    </Link>
                    .
                </Text>

                <Text fontWeight="bold">Dispute Resolution</Text>
                <Text>
                    In the event of any dispute, claim, or controversy arising out of or
                    relating to these terms or the Program, you and the Company agree to
                    resolve such disputes through binding arbitration on an individual
                    basis. You agree that by entering into these terms, you and the
                    Company are each waiving the right to a trial by jury or to
                    participate in a class action.
                </Text>

                <Text fontWeight="bold">Changes to Terms</Text>
                <Text>
                    The Company reserves the right to modify these terms at any time. We
                    will notify you of any material changes by posting the updated terms
                    on our website. Your continued participation in the Program after such
                    modifications constitutes your acceptance of the updated terms.
                </Text>

                <Text fontWeight="bold">Contact Information</Text>
                <Text>
                    Level Up Learning NC, LLC
                    <br />
                    310 Nantucket Dr.
                    <br />
                    Cary, North Carolina 27513
                </Text>
                <Text>
                    Email:{" "}
                    <Link
                        href="mailto:info@leveluplearningnc.com"
                        color="brand.primary"
                        textDecoration="underline"
                    >
                        info@leveluplearningnc.com
                    </Link>
                </Text>
                <Text>Phone: (919) 439-0924</Text>
                <Text>Effective as of March 29, 2026</Text>

                <Box height={6} />

                <Text fontWeight="bold" fontSize={14} id="waiver">
                    Level Up Learning Summer Camp Waiver, Release of Liability, and Hold Harmless Agreement
                </Text>
                <Text>
                    By checking the box, I, the parent or legal guardian of the
                    participating child, acknowledge and agree to the following terms
                    regarding my child's participation in Level Up Learning summer camp
                    programs, organized by Karen Miles and Megan Miller of Level Up
                    Learning, including camps held at partnering churches or other
                    locations:
                </Text>

                <OrderedList spacing={3} paddingLeft={4}>
                    <ListItem>
                        <Text fontWeight="bold">Acknowledgment and Assumption of Risk</Text>
                        <Text>
                            I understand that participation in camp activities involves
                            inherent risks, including but not limited to physical activity
                            and social interaction. I voluntarily assume full responsibility
                            for any injury, loss, or damage to my child or family members
                            resulting from participation.
                        </Text>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">Indemnification</Text>
                        <Text>
                            I agree to indemnify, defend, and hold harmless Karen Miles,
                            Megan Miller, Level Up Learning, and all associated parties
                            (including rental locations) from any claims, damages, judgments,
                            costs, or expenses (including attorney fees) arising from my
                            child's participation in the camp.
                        </Text>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">Fees for Damages</Text>
                        <Text>
                            I agree to pay for any damages caused by my child or family
                            members to camp facilities or property due to negligent,
                            reckless, or willful behavior.
                        </Text>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">Consent</Text>
                        <Text>
                            I consent to the participation of my child in the Level Up
                            Learning camp, and agree on behalf of the above minor to all of
                            the terms and conditions of this agreement.
                        </Text>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">Medical Treatment Authorization</Text>
                        <Text>
                            In the event of an injury to the above minor during the
                            above-described activities, I give my permission to Karen Miles
                            and Megan Miller or to the employees, representatives, or agents
                            of Level Up Learning to arrange for all necessary medical
                            treatment for which I shall be financially responsible.
                        </Text>
                        <Text marginTop={2}>
                            This authority begins on the first day of camp and remains in
                            effect until the camp concludes or I revoke it in writing.
                        </Text>
                        <Text marginTop={2}>This includes:</Text>
                        <OrderedList styleType="lower-alpha" paddingLeft={4} marginTop={1}>
                            <ListItem>
                                The power to seek appropriate medical treatment or attention
                                on behalf of my child as may be required by the
                                circumstances, including without limitation, that of a
                                licensed medical physician and/or a hospital;
                            </ListItem>
                            <ListItem>
                                The power to authorize medical treatment or medical
                                procedures in an emergency situation.
                            </ListItem>
                        </OrderedList>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">Applicable Law</Text>
                        <Text>
                            Any legal or equitable claim that may arise from participation in
                            the above shall be resolved under North Carolina law.
                        </Text>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">No Duress and Legal Counsel</Text>
                        <Text>
                            I agree and acknowledge that I am under no pressure or duress to
                            sign this agreement and that I have been given a reasonable
                            opportunity to review it before signing. I further agree and
                            acknowledge that I am free to have my own legal counsel review
                            this agreement if I so desire. I further agree and acknowledge
                            that Karen Miles and Megan Miller have offered to refund any fees
                            I have paid to use its facilities if I choose not to sign this
                            agreement.
                        </Text>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">Arm's Length Agreement</Text>
                        <Text>
                            This agreement and each of its terms are the product of an arm's
                            length negotiation between the Parties. In the event any
                            ambiguity is found to exist in the interpretation of this
                            agreement or any of its provisions, the Parties, and each of
                            them, explicitly reject the application of any legal or equitable
                            rule of interpretation which would lead to a construction either
                            "for" or "against" a particular party based upon their status as
                            the drafter of a specific term, language, or provision giving
                            rise to such ambiguity.
                        </Text>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">Enforceability</Text>
                        <Text>
                            The invalidity or unenforceability of any provision of this
                            agreement, whether standing alone or as applied to a particular
                            occurrence or circumstance, shall not affect the validity or
                            enforceability of any other provision of this agreement or of any
                            other applications of such provision, as the case may be. Such
                            invalid or unenforceable provision shall be deemed not to be a
                            part of this agreement.
                        </Text>
                    </ListItem>
                    <ListItem>
                        <Text fontWeight="bold">Dispute Resolution</Text>
                        <Text>
                            The parties will attempt to resolve any dispute arising out of or
                            relating to this agreement through friendly negotiations among
                            the parties. If the matter is not resolved by negotiation, the
                            parties will resolve the dispute using the below Alternative
                            Dispute Resolution (ADR) procedure: Any controversies or
                            disputes arising out of or relating to this agreement will be
                            submitted to mediation in accordance with any statutory rules of
                            mediation. If mediation does not successfully resolve the
                            dispute, then the parties may proceed to seek an alternative form
                            of resolution in accordance with any other rights and remedies
                            afforded to them by law.
                        </Text>
                    </ListItem>
                </OrderedList>
            </Stack>
        </BodyContainer>
    );
};

export default TermsAndConditions;
