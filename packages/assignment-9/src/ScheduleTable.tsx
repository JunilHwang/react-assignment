import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/react';
import { DAY_LABELS, 분 } from "./constants";
import { fill2, parseHnM } from './utils';
import { Schedule } from "./types.ts";

interface Props {
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string, time: number }) => void;
}

const TIMES = [
  ...Array(18)
    .fill(0)
    .map((v, k) => v + k * 30 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

  ...Array(6)
    .fill(18 * 30 * 분)
    .map((v, k) => v + k * 55 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;


const ScheduleTable = ({ schedules, onScheduleTimeClick }: Props) => {

  const getLectureBySchedule = (day: string, time: number) =>
    schedules.find(
      (schedule) => schedule.day === day && schedule.range[0] === time
    );

  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };

  const handleRemoveLecture = (day: string, time: number) => {
    const selected = getLectureBySchedule(day, time);
    if (selected) {
      // You might want to implement a toast notification here
    }
  };

  return (
    <Box border="1px solid" borderColor="gray.300">
      <Flex
        as="header"
        h="40px"
        borderBottom="1px solid"
        borderColor="gray.300"
        zIndex={100}
        bg="white"
      >
        <Grid templateColumns="20% repeat(6, 1fr)" w="full">
          <GridItem>
            <Flex align="center" justify="center" h="full" bg="gray.100">
              <Text>교시</Text>
            </Flex>
          </GridItem>
          {DAY_LABELS.map((day) => (
            <GridItem key={day} borderLeft="1px solid" borderColor="gray.300">
              <Flex align="center" justify="center" h="full" bg="gray.100">
                <Text dangerouslySetInnerHTML={{ __html: day }}/>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </Flex>

      <Flex>
        <VStack width="20%" spacing={0}>
          {TIMES.map((time, timeKey) => (
            <VStack
              key={timeKey}
              h="30px"
              w="full"
              bg={timeKey > 17 ? 'gray.200' : 'gray.100'}
              borderTop={timeKey > 0 ? '1px solid' : 'none'}
              borderColor="gray.300"
              spacing={0}
              justifyContent="center"
            >
              <Text fontSize="xs">{fill2(timeKey + 1)} ({time})</Text>
            </VStack>
          ))}
        </VStack>

        {DAY_LABELS.map((day) => (
          <VStack key={day} w={`${80 / 6}%`} spacing={0}>
            {TIMES.map((_, timeKey) => {
              const schedule = getLectureBySchedule(day, timeKey + 1);
              return (
                <Box
                  key={timeKey}
                  h="30px"
                  w="full"
                  bg={timeKey > 17 ? 'gray.100' : 'white'}
                  borderTop={timeKey > 0 ? '1px solid' : 'none'}
                  borderLeft="1px solid"
                  borderColor="gray.300"
                  cursor="pointer"
                  _hover={{ bg: 'yellow.100' }}
                  onClick={() => onScheduleTimeClick?.({ day, time: timeKey + 1 })}
                >
                  {schedule && (
                    <Popover>
                      <PopoverTrigger>
                        <Box
                          h={`calc(${schedule.range.length * 30 - 1}px)`}
                          bg={getColor(schedule.lecture.id)}
                          p={2}
                          fontSize="13px"
                          pos="relative"
                        >
                          <Text fontWeight="bold">{schedule.lecture.title}</Text>
                          <Text>{schedule.room}</Text>
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow/>
                        <PopoverCloseButton/>
                        <PopoverBody>
                          <Text>강의를 삭제하시겠습니까?</Text>
                          <Button colorScheme="red" size="xs" onClick={() => handleRemoveLecture(day, timeKey + 1)}>
                            삭제
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  )}
                </Box>
              );
            })}
          </VStack>
        ))}
      </Flex>
    </Box>
  );
};

export default ScheduleTable;
