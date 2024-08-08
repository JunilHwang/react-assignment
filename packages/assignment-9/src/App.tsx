import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { ScheduleProvider } from './ScheduleContext';
import ScheduleTable from './ScheduleTable';
import SearchDialog from './SearchDialog';

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <Flex w="full" gap="10px" p="10px" flexWrap="wrap">
          <Box width="30%">
            <ScheduleTable key={1} />
          </Box>
          <Box width="30%">
            <ScheduleTable key={2} />
          </Box>
          <Box width="30%">
            <ScheduleTable key={3} />
          </Box>
          <Box width="30%">
            <ScheduleTable key={4} />
          </Box>
        </Flex>
        <SearchDialog />
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
