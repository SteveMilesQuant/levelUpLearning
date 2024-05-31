import BodyContainer from "../components/BodyContainer";
import { Divider, Spinner, Stack } from "@chakra-ui/react";
import { EventPublic, useEvents } from "../events";
import { Fragment } from "react";

const Events = () => {
  const { data: events, error, isLoading } = useEvents();
  if (error) throw error;
  if (isLoading) return <Spinner />

  return (
    <BodyContainer>
      <Stack spacing={14} alignItems="center" width="100%">
        {events.map(event =>
          <Fragment key={event.id} >
            <EventPublic event={event} />
            <Divider
              orientation="horizontal"
              borderColor="brand.secondary"
              borderWidth={7}
            />
          </Fragment>
        )}
      </Stack>
    </BodyContainer >
  );
};

export default Events;
