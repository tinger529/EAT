import React, {useState} from "react";
import {
    Button,
    Table,
    Tabs,
    Flex,
    Box,
    Center,
    Text,
    useToast,
    Card,
    CardBody,
    VStack,
    Heading,
    HStack,
    CardFooter,
    IconButton,
    ButtonGroup,
    Input,
    Stack,
    FormControl,
    FormLabel,
    Select,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    NumberInput,
    NumberInputField,
    SimpleGrid,
    Divider,
    InputLeftElement,
    InputGroup,
    Spinner,
    useDisclosure,
    Collapse,
    AlertDialogFooter,
    AlertDialog,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    AlertDialogBody,
    AlertDialogHeader,
    Menu,
    MenuList,
    MenuButton, MenuItem, Spacer
} from "@chakra-ui/react";
import {FetchState, useGetGroupInfo, useGetUser} from "../../hooks/index.js";
import api from "../../api/api.jsx";
import {Server} from "../../utils/config.jsx";
import {render} from "react-dom";
import {AddIcon, ChevronDownIcon, DeleteIcon, EditIcon, SettingsIcon} from "@chakra-ui/icons";
import {MdAdd, MdMinimize, MdSave} from "react-icons/md";

/*
    Process:
    1. Get the groups of current user
    2. Get the records of the group that recently accessed
    3. Mapping records to username
    4. Display the records
 */
const Group = ({user, group, isGroupsLoading}) => {
    const groupId = group ? group.$id : null;
    const [stale, setStale] = useState({stale: false});
    const [{records, members, isLoading, isError}, recordDispatch] = useGetGroupInfo(stale, groupId);
    const [description, setDescription] = useState("");

    const [newData, setNewData] = useState([{userId: "", value: 0}, {userId: "", value: 0}]);
    const toast = useToast();

    const handleUserChange = (e, index) => {
        setNewData(newData.map((innerItem, i) =>
            (i === index) ? {...innerItem, userId: e.target.value} : innerItem
        ))
    }
    const handleValueChange = (e, index) => {

        setNewData(newData.map((innerItem, i) => {
                if (i === index) {
                    return {
                        ...innerItem,
                        value: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                    }
                } else {
                    return innerItem
                }
            }
        ))
    }

    const handleAdd = async () => {
        if (description === "") {
            toast({
                description: 'Please enter a description',
                status: 'warning',
            })
            return
        }
        if (newData.length < 2) {
            toast({
                description: 'Please add at least 2 records',
                status: 'warning',
            })
            return
        }
        if (newData.some((item) => item.userId === "")) {
            toast({
                description: 'Please select a user',
                status: 'warning',
            })
            return
        }
        if (newData.some((item) => item.value === 0)) {
            toast({
                description: 'Please enter a value',
                status: 'warning',
            })
            return
        }
        if (new Set(newData.map((item) => item.userId)).size !== newData.length) {
            toast({
                description: 'Please select different users',
                status: 'warning',
            })
            return
        }
        if (newData.map((item) => item.value).reduce((a, b) => a + b, 0) !== 0) {
            toast({
                description: 'The sum of values must be 0',
                status: 'warning',
            })
            return
        }

        try {
            const res = await api.createRecord(groupId, description, newData);
            setStale({stale: true});
            toast({
                description: 'Record added',
                status: 'success',
            })
            setNewData([{userId: "", value: 0}, {userId: "", value: 0}])
            setDescription("")

        } catch (e) {
            console.log(e)
            toast({
                description: 'Failed to add record',
                status: 'error',
            })
        }
    }

    const handleDelete = async (recordId) => {
        try {
            await api.deleteRecord(groupId, recordId);
            setStale({stale: true});
            toast({
                description: 'Record deleted',
                status: 'info',
            })
        } catch (e) {
            console.log(e)
            toast({
                description: 'Failed to delete record',
                status: 'error',
            })
        }

    }


    const handleUpdate = (e) => {
        //TODO: implement update
        notImplemented()
    }

    const handleInvite = (e) => {
        notImplemented()
    }

    const notImplemented = () => {
        toast({
            description: 'Not implemented yet.🥵🥵🥺🥺',
            status: 'warning',
        })
    }

    const NewDataCard = () => {
        return <Card width={"100%"} direction={{base: 'column'}} overflow='hidden'>
            <HStack>
                <CardBody>
                    <Stack spacing={5}>
                        <Input placeholder={"Description"} size={"lg"} maxW={600} onChange={(e) => {
                            console.log("change")
                            setDescription(e.target.value)
                        }}></Input>
                        <SimpleGrid columns={{base: 1, md: 2}} spacingX={8} spacingY={5}>
                            {newData.map((item, index) => (
                                <Stack key={index} direction={"row"}>
                                    <Select placeholder={"Select user"}
                                            key={index} value={item.userId}
                                            minW={"max-content"}
                                            onChange={(e) => handleUserChange(e, index)}>
                                        {members.map((member) => (
                                            <option key={member.$id}
                                                    value={member.$id}>{member.userName}</option>
                                        ))}
                                    </Select>
                                    <InputGroup maxWidth={200}>
                                        <InputLeftElement
                                            pointerEvents='none'
                                            color='gray.300'
                                            fontSize='1.2em'
                                            /* eslint-disable-next-line react/no-children-prop */
                                            children='$'
                                        />
                                        <Input type={"number"}
                                               onChange={(e) => handleValueChange(e, index)}


                                        />
                                    </InputGroup>
                                    <IconButton aria-label={"delete"} icon={<DeleteIcon/>} onClick={() => {
                                        setNewData(newData.filter((_, i) => i !== index))
                                    }}/>
                                </Stack>)
                            )}

                        </SimpleGrid>
                        <Button alignSelf={"center"} maxW={"max-content"}
                                isDisabled={(newData.length >= members.length)} leftIcon={<AddIcon/>}
                                onClick={() => {
                                    setNewData([...newData, {userId: "", value: 0}])
                                }} aria-label={""}>Add user</Button>
                        <Button alignSelf={"end"} leftIcon={<MdSave/>} colorScheme='pink' variant='solid'
                                onClick={handleAdd}>
                            Save Record
                        </Button>
                    </Stack>
                </CardBody>
            </HStack>
        </Card>
    }

    const RecordCard = ({record}) => {

        const {isOpen: isDataOpen, onToggle} = useDisclosure()
        const {isOpen, onOpen, onClose} = useDisclosure()
        const [isSent, setIsSent] = useState(false)

        return (
            <>
                <Card key={record.$id} direction={{base: 'column'}} width={"100%"} overflow='hidden'>
                    <HStack>
                        <CardBody onClick={onToggle}>
                            <Heading size='md'> {record.name}</Heading>
                            <Text fontSize={"md"}>{new Date(record.$createdAt).toLocaleString()}</Text>
                        </CardBody>
                        <CardFooter>
                            <ButtonGroup variant='ghost' spacing='2'>
                                <IconButton icon={<EditIcon/>} onClick={() => handleUpdate(record.$id)}/>
                                <IconButton icon={<DeleteIcon/>} onClick={onOpen}/>
                            </ButtonGroup>
                        </CardFooter>
                    </HStack>
                </Card>
                <Collapse in={isDataOpen} animateOpacity>
                    <Box p='40px' color='white' mt='4' bg='gray.600' rounded='md' shadow='md'>
                        <Text>{record.data}</Text>
                    </Box>
                </Collapse>
                <AlertDialog
                    motionPreset='slideInBottom'
                    onClose={onClose}
                    isOpen={isOpen}
                    isCentered
                >
                    <AlertDialogOverlay/>

                    <AlertDialogContent>
                        <AlertDialogHeader>Delete Record</AlertDialogHeader>
                        <AlertDialogCloseButton/>
                        <AlertDialogBody>
                            Are you sure you want to this record?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onClose}>
                                No
                            </Button>
                            <Button isLoading={isSent} onClick={(element) => {
                                setIsSent(true)
                                handleDelete(record.$id).then(() => {
                                    onClose()
                                }).catch(() => {
                                    onClose()
                                })
                            }} colorScheme='red' ml={3}>
                                Yes
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        )
    }


    return (
        <Box w={"100%"}>
            {isLoading || isGroupsLoading ?

                <Center w={"100%"} h={"100vh"}>
                    <Spinner p={4}/>
                    <Text p={4}>Loading...</Text>
                </Center>

                :
                isError ?
                    <Center w={"100%"} h={"100vh"}>

                        <Text p={4}>You have no group yet</Text>
                    </Center>
                    :
                    <VStack flex={"max-content"} h={"max"}>
                        <HStack spacing={4}>
                            <Heading>{group.name}</Heading>
                            {/*<Text>{JSON.stringify(newData)}</Text>*/}
                            <Menu>
                                <MenuButton as={IconButton} icon={<SettingsIcon/>} variant='solid'>

                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={handleInvite}>Invite Someone</MenuItem>


                                </MenuList>
                            </Menu>
                        </HStack>
                        {NewDataCard()}
                        {records.map((record) => (
                            <RecordCard key={record.$id} record={record}/>
                        ))}
                    </VStack>
            }
        </Box>
    )
};

export default Group;