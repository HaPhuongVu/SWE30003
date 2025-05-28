import { Search } from "lucide-react"
import { Form, InputGroup } from "react-bootstrap"

function SearchBar({className=''}){
    return (
    <InputGroup className={`outline-0 ${className}`}>
        <InputGroup.Text>
        <Search/>
        </InputGroup.Text>
        <Form.Control placeholder="Search electronics" className="shadow-none border"></Form.Control>
    </InputGroup>
)
}

export default SearchBar