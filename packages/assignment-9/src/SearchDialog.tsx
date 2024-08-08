import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react';
import { useScheduleContext } from './ScheduleContext';
import { Lecture } from './types';
import { parseSchedule } from "./utils.ts";
import axios from "axios";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setSchedulesMap } = useScheduleContext();

  const [lectures, setLectures] = useState<Lecture[]>([]);

  const filteredLectures = lectures.filter(lecture =>
    lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addLecture = (lecture: Lecture) => {
    if (!searchInfo) {
      return;
    }

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map(schedule => ({
      ...schedule,
      lecture
    }))

    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules]
    }));
  };

  useEffect(() => {
    const fetchLectures = async () => {
      const results = await Promise.all([
        axios.get<Lecture[]>('/schedules-majors.json'),
        axios.get<Lecture[]>('/schedules-liberal-arts.json'),
      ]);

      setLectures(results.flatMap(result => result.data).slice(0, 10));
    };

    fetchLectures();
  }, []);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="xl">
      <ModalOverlay/>
      <ModalContent maxW="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={4}>
            <Input
              placeholder="과목명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>과목코드</Th>
                  <Th>과목명</Th>
                  <Th>학점</Th>
                  <Th>전공</Th>
                  <Th>시간</Th>
                  <Th>학년</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredLectures.map((lecture, index) => (
                  <Tr key={`${lecture.id}-${index}`}>
                    <Td>{lecture.id}</Td>
                    <Td>{lecture.title}</Td>
                    <Td>{lecture.credits}</Td>
                    <Td dangerouslySetInnerHTML={{ __html: lecture.major }}/>
                    <Td dangerouslySetInnerHTML={{ __html: lecture.schedule }}/>
                    <Td>{lecture.grade}</Td>
                    <Td>
                      <Button size="sm" colorScheme="green" onClick={() => addLecture(lecture)}>추가</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
