import { Table, TableContainer, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import ThText from "../../components/ThText";
import ResourcesTableRow from "./ResourcesTableRow";
import { useState } from "react";
import TextButton from "../../components/TextButton";
import useResources from "../hooks/useResources";

export interface Props {
  resourceGroupId: number;
}

const ResourcesTable = ({ resourceGroupId }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const { data: resources } = useResources(resourceGroupId);

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <ThText>Title</ThText>
            <ThText>URL</ThText>
            <ThText>{/* placeholder for crud buttons */}</ThText>
          </Tr>
        </Thead>
        <Tbody>
          {resources?.map((resource) => (
            <ResourcesTableRow
              key={resource.id}
              resourceGroupId={resourceGroupId}
              resource={resource}
            />
          ))}
          {isAdding && (
            <ResourcesTableRow
              resourceGroupId={resourceGroupId}
              onCancel={() => setIsAdding(false)}
              onSuccess={() => setIsAdding(false)}
            />
          )}
          {!isAdding && (
            <Tr>
              <Td>
                <TextButton onClick={() => setIsAdding(true)}>Add</TextButton>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ResourcesTable;
