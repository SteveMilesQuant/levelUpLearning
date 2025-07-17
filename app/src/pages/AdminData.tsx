import { TableContainer, Table, Thead, Tr, Tbody, Td, Text, Link } from "@chakra-ui/react"
import BodyContainer from "../components/BodyContainer"
import PageHeader from "../components/PageHeader"
import ThText from "../components/ThText"

const AdminData = () => {
    return (
        <BodyContainer>
            <PageHeader>Data</PageHeader>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <ThText>Resources</ThText>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>
                                <Link href="https://docs.google.com/spreadsheets/d/1WiYekkHgyP3rMwSyd6WZCi3u9QqAxUKP0LxhzG8DOps/edit?usp=sharing" isExternal>
                                    <Text>Data excel</Text>
                                </Link>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </BodyContainer>
    )
}

export default AdminData