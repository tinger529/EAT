import React, {useEffect, useState} from "react";
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
    Avatar,
    Menu,
    MenuList,
    MenuButton, MenuItem, Spacer, AlertIcon, AlertTitle, AlertDescription, Alert, CloseButton, Tag, TagLabel, TagCloseButton , Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup
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

    const {isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose} = useDisclosure();

    const [selectedRecord, setSelectedRecord] = useState(null);
    const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);

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


    const handleUpdate = async (recordId) => {
        //TODO: implement update
        notImplemented()
    };
      

    const notImplemented = () => {
        toast({
            description: 'Not implemented yet.🥵🥵🥺🥺',
            status: 'warning',
        })
    }

    const InviteModal = ({isOpen, onClose}) => {

        const [email, setEmail] = useState("")
        const [invitedUserId, setInvitedUserId] = useState("")
        const [isLoading, setIsLoading] = useState(false)
        const [isError, setIsError] = useState(false)
        const [errorMessage, setErrorMessage] = useState("")

        const handleInvite = async () => {
            setIsLoading(true)
            setIsError(false)
            try {
                const res = await api.inviteGroupMember(groupId, user.$id, invitedUserId)
                toast({
                    description: 'Invitation sent',
                    status: 'success',
                })
                onClose()
            } catch (e) {
                console.log(e)
                setIsError(true)
                setErrorMessage(JSON.stringify(e))
            }
            setIsLoading(false)
        }

        return <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Invite user
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input disabled={true} placeholder={"Email address"}
                                   onChange={(e) => setEmail(e.target.value)}></Input>
                        </FormControl>
                        <FormControl>
                            <FormLabel>User ID</FormLabel>
                            <Input placeholder={"User ID"} onChange={(e) => setInvitedUserId(e.target.value)}></Input>
                        </FormControl>
                        {isError && <Alert status="error">
                            <AlertIcon/>
                            <AlertTitle mr={2}>Failed to invite user</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setIsError(false)}/>
                        </Alert>}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <ButtonGroup>
                            <Button onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" onClick={handleInvite} ml={3} isLoading={isLoading}>
                                Invite
                            </Button>
                        </ButtonGroup>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    }

    const Show_each_amount = ({member}) => {
        const sum = sumMemberValues(member.$id)
        return (
            <Stat key={member.$id} mb="2" mr="50" flex="1">
                <Flex align="center">
                <Avatar name={member.name} size="sm" mr="4" />
                <Box>
                <StatLabel whiteSpace="nowrap">{member.name}</StatLabel>
                <StatNumber color={sum < 0 ? "red.500" : "teal.500"}>
                    {sum < 0 ? `-${Math.abs(sum)}` : sum}
                </StatNumber>
                </Box>
                </Flex>
            </Stat>
        )

    }
    

    const NewDataCard = () => {
        return <Card width={"100%"} direction={{base: 'column'}} overflow='hidden'>
            <HStack backgroundColor={"black"}>
                <CardBody>
                    <Stack spacing={5}>
                        <Input placeholder={"Description"} size={"lg"} maxW={600} onChange={(e) => {
                            
                            setDescription(e.target.value)
                        }}></Input>
                        <SimpleGrid columns={{base: 1, md: 2}} spacingX={8} spacingY={5}>
                            {newData.map((item, index) => (
                                <Stack key={index} direction={"row"}>
                                    <Select placeholder={"Select user"}
                                            key={index} value={item.userId}
                                            minW={"max-content"}
                                            onChange={(e) => handleUserChange(e, index)}
                                            color={"white"}>
                                        {members.map((member) => (
                                            <option key={member.$id}
                                                    value={member.$id}>{member.name}</option>
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
                                               color={"white"}
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
    //mapping records data's userid to username
    const mappedRecords = records.map((record) => {
        
        const mappedData = record.data.map((item) => {
            
            const user = members.find((member) => member.$id === item.userId)
            return {...item, userName: user.name}
        })
        return {...record, data: mappedData}
    })

    //summing up the amount of money each member owes
    const sumMemberValues = (memberId) => {
        
        const memberRecords = mappedRecords.filter((record) => record.data.some((item) => item.userId === memberId))
        const memberValues = memberRecords.map((record) => {
            const memberValue = record.data.find((item) => item.userId === memberId).value
            return memberValue
        })
        const sum = memberValues.reduce((a, b) => a + b, 0)
        return sum
    }


    const RecordCard = ({record}) => {

        const {isOpen: isDataOpen, onToggle} = useDisclosure()
        const {isOpen, onOpen, onClose} = useDisclosure()
        const [isSent, setIsSent] = useState(false)

        return (
            <>
                <Card key={record.$id} direction={{base: 'column'}} width={"100%"} overflow='hidden'>
                    <HStack backgroundColor={"black"}>
                        <CardBody onClick={onToggle}>
                            <Heading size='md' color={"white"}> {record.name}</Heading>
                            <Text fontSize={"md"} color={"white"}>{new Date(record.$createdAt).toLocaleString()}</Text>
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
                <Box p="30px" color="white" mt="2" rounded="md" shadow="md">
                    <StatGroup>
                    {mappedRecords.find((item) => item.$id === record.$id).data.map((item, index) => (
                    <Stat key={index} w="100" mr="150" flex="1">
                    <Flex direction="row">
                        <Avatar name={item.userName} size="sm" mr="2" />
                        <Box> 
                        <StatLabel w="10" whiteSpace="nowrap">{item.userName}</StatLabel>
                            {item.value > 0 ? (
                            <StatHelpText color="green.500" whiteSpace="noWrap">
                                <StatArrow type="increase" whiteSpace="nowrap"/>
                                {item.value}
                            </StatHelpText>
                            ) : (
                            <StatHelpText color="red.500" whiteSpace="noWrap">
                                <StatArrow type="decrease" />
                                {Math.abs(item.value)}
                            </StatHelpText>
                            )}
                        </Box>
                    </Flex>
                        
                    </Stat>
                    ))}
                    </StatGroup>
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

    useEffect(() => {
        setStale({stale: true})
    }, [group])

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
                            

                            <Menu>
                                <MenuButton as={IconButton} icon={<SettingsIcon/>} variant='solid'>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={onInviteOpen}>Invite Someone</MenuItem>
                                </MenuList>
                            </Menu>

                        </HStack>
                        <InviteModal isOpen={isInviteOpen} onClose={onInviteClose}/>
                        //show the amount of money each member owes
                        <Box p="30px" color="white" mt="2" rounded="md">
                        <Flex direction="row">
                            {members.map((member) => (
                                <Show_each_amount key={member.$id} member={member}/>
                            ))}
                        </Flex>
                        </Box>
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