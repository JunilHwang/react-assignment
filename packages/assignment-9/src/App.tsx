import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleProvider } from './ScheduleContext';
import { ScheduleTables } from "./ScheduleTables.tsx";

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleTables/>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
