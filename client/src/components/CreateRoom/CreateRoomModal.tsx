import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FaEdit, FaLock } from 'react-icons/fa';
import CreateDM from './CreateDM';
import CreateGroup from './CreateGroup';

export interface CreateRoomProps {
  onClose: () => void;
}

function CreateRoomModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Modal Trigger */}
      <IconButton aria-label='add-dm-room' icon={<FaEdit />} onClick={onOpen} />

      {/* Create room modal */}
      <Modal scrollBehavior='inside' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant='solid-rounded' isFitted>
              <TabList>
                <Tab fontWeight='bold'>DIRECT</Tab>
                <Tab fontWeight='bold'>GROUP</Tab>
              </TabList>
              <TabPanels mt='5'>
                <TabPanel>
                  <CreateDM onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <CreateGroup onClose={onClose} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter fontSize='xs'>
            <FaLock />*
            <Text size='xs' ml='2'>
              Private Account
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateRoomModal;
