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
    Divider, InputLeftElement, InputGroup
} from "@chakra-ui/react";
import {FetchState, useGetGroupInfo, useGetUser} from "../../hooks/index.js";
import api from "../../api/api.jsx";
import {Server} from "../../utils/config.jsx";
import {render} from "react-dom";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {MdSave} from "react-icons/md";

/*
    Process:
    1. Get the groups of current user
    2. Get the records of the group that recently accessed
    3. Mapping records to username
    4. Display the records
 */
const Group = ({user, group}) => {
    const groupId = group ? group.$id : null;
    const [stale, setStale] = useState({stale: false});
    const [{records, members, isLoading, isError}, recordDispatch] = useGetGroupInfo(stale, groupId);


    const [newData, setNewData] = useState([{userId: "", value: 0}, {userId: "", value: 0}]);
    const toast = useToast();

    const handleUserChange = (e, index) => {

        setNewData(newData.map((innerItem, i) =>
            (i === index) ? {...innerItem, userId: e.target.value} : innerItem
        ))
    }
    const handleValueChange = (e, index) => {
        setNewData(newData.map((innerItem, i) =>
            (i === index) ?
                {
                    ...innerItem,
                    value: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                }
                : innerItem
        ))
    }

    const handleAdd = (e) => {
    }

    const handleDelete = (e) => {
    }

    const handleUpdate = (e) => {
    }

    const data = []


    return (
        <>
            <VStack flex={"max-content"}>
                <Text>Newdata={JSON.stringify(newData)}</Text>
                <Heading>Group: {group.name}</Heading>
                <Card width={"100%"} direction={{base: 'column'}} overflow='hidden'>
                    <HStack>
                        <CardBody>
                            <Stack spacing={5}>
                                <Input placeholder={"Description"} size={"lg"} maxW={600}></Input>
                                <SimpleGrid columns={{base: 1, md: 2}} spacingX={8} spacingY={5}>
                                    {newData.map((item, index) => (
                                        <Stack key={index} direction={"row"}>
                                            <Select placeholder={"Select user..."}

                                                    key={index} value={item.userId}
                                                    minW={"max-content"}
                                                    onChange={(e) => handleUserChange(e, index)}>
                                                {members.map((member) => (
                                                    <option key={member.$id}
                                                            value={member.$id}>{member.userName}</option>
                                                ))}
                                            </Select>
                                            <InputGroup>
                                                <InputLeftElement
                                                    pointerEvents='none'
                                                    color='gray.300'
                                                    fontSize='1.2em'
                                                    /* eslint-disable-next-line react/no-children-prop */
                                                    children='$'
                                                />
                                                <Input value={item.value.toString()}
                                                       type={"number"}
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
                                <Button alignSelf={"end"} leftIcon={<MdSave/>} colorScheme='pink' variant='solid'>
                                    Save Record
                                </Button>
                            </Stack>
                        </CardBody>


                    </HStack>
                </Card>
                {records.map((record) => (
                    <Card key={record.$id} direction={{base: 'column'}} width={"100%"} overflow='hidden'>
                        <HStack>
                            <CardBody>
                                <Heading size='md'> {record.name}</Heading>
                                <Text fontSize={"md"}>{new Date(record.$createdAt).toLocaleString()}</Text>
                            </CardBody>
                            <CardFooter>
                                <ButtonGroup variant='ghost' spacing='2'>
                                    <IconButton icon={<EditIcon/>} onClick={handleUpdate}/>
                                    <IconButton icon={<DeleteIcon/>} onClick={handleDelete}/>
                                </ButtonGroup>
                            </CardFooter>
                        </HStack>
                    </Card>

                ))}
                <Button onClick={handleAdd}>Add</Button>
            </VStack>
            <Card>

            </Card>
        </>
    )
};

export default Group;