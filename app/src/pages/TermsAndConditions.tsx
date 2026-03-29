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
            </Stack>
        </BodyContainer>
    );
};

export default TermsAndConditions;
