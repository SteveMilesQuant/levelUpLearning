import useCamps, { CampQuery } from "../hooks/useCamps";
import CampGrid from "./CampGrid";

interface Props {
    campQuery: CampQuery;
    isReadOnly?: boolean;
    showPastCamps: boolean;
    disableQuery: boolean;
}

const CampsQuery = ({ campQuery, isReadOnly, showPastCamps, disableQuery }: Props) => {
    const {
        data: camps,
        isLoading,
        error,
    } = useCamps(campQuery, disableQuery);

    if (isLoading) return null;
    if (error) throw error;

    return (
        <CampGrid camps={camps} isReadOnly={isReadOnly} showPastCamps={showPastCamps} />
    )
}

export default CampsQuery