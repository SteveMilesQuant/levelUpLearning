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

  /* It's tempting to pass in resources, but it's better for query updates to get it separately */
  const { data: resources } = useResources(resourceGroupId);

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <ThText>Title</ThText>
            <ThText>URL</ThText>
            <ThText>{/* placeholder for up/down buttons */}</ThText>
            <ThText>{/* placeholder for crud buttons */}</ThText>
          </Tr>
        </Thead>
        <Tbody>
          {resources
            ?.sort((a, b) => a.list_index - b.list_index)
            .map((resource) => (
              <ResourcesTableRow
                key={resource.id}
                resourceGroupId={resourceGroupId}
                resource={resource}
                list_length={resources.length}
              />
            ))}
          {isAdding && (
            <ResourcesTableRow
              resourceGroupId={resourceGroupId}
              onCancel={() => setIsAdding(false)}
              onSuccess={() => setIsAdding(false)}
              list_length={resources ? resources.length : 0}
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
