import { Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleContext();
  return (
    <Flex w="full" gap={6} p={6} flexWrap="wrap">
      {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
        <Stack key={tableId} width="30%">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
            <SearchDialog tableId={tableId}/>
          </Flex>
          <ScheduleTable schedules={schedules}/>
        </Stack>
      ))}
    </Flex>
  );
}
