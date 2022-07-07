import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Task, TaskList } from "@prisma/client";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { HiPlus } from "react-icons/hi";
import CreateTaskModal from "./modals/CreateTaskModal";

type TaskListWithTasks = {
  tasks: Task[];
} & TaskList;

type ComponentProps = {
  taskLists: TaskListWithTasks[];
  onDragEnd: (result: any) => void;
};

const Board: React.FC<ComponentProps> = ({ taskLists, onDragEnd }) => {
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [currentListId, setCurrentListId] = useState("");

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="taskList" direction="horizontal">
        {(provided, snapshot) => (
          <HStack
            ref={provided.innerRef}
            w="full"
            h="100%"
            rounded={5}
            mt={10}
            alignItems="flex-start"
            bg="gray.100"
            overflowX="auto"
            {...provided.droppableProps}
          >
            {taskLists?.map((list, index) => (
              <Box key={list.id} minW="250px" h="100%">
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      h="100%"
                      rounded={5}
                      bg="blue.100"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Droppable droppableId={"tasks-" + index} type="TASK">
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            minW="250px"
                            h="100%"
                            rounded={5}
                            bg="blue.100"
                            {...provided.droppableProps}
                          >
                            <HStack p={2} justifyContent="space-between">
                              <Text fontSize="md" fontWeight="bold">
                                {list.name}
                              </Text>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setCurrentListId(list.id);
                                  setCreateTaskModalOpen(true);
                                }}
                              >
                                <HiPlus />
                              </Button>
                            </HStack>
                            {list.tasks?.map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    p={2}
                                    m={2}
                                    rounded={5}
                                    bg="green.100"
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Text fontSize="md" fontWeight="bold">
                                      {task.name}
                                    </Text>
                                    <Text fontSize="sm" noOfLines={1}>
                                      {task.description}
                                    </Text>
                                  </Box>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    </Box>
                  )}
                </Draggable>
              </Box>
            ))}
            {provided.placeholder}
          </HStack>
        )}
      </Droppable>
      {currentListId && (
        <CreateTaskModal
          key={currentListId}
          listId={currentListId}
          isOpen={createTaskModalOpen}
          onClose={() => setCreateTaskModalOpen(false)}
        />
      )}
    </DragDropContext>
  );
};

export default Board;
