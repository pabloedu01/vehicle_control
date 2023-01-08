import { Dropdown, ListGroup } from 'react-bootstrap';
import useToggle from './useToggle'



export function OrganizeDropdown ({ organizeValues, setOrganizeSelected }) {
    const [isOpen, toggleDropdown] = useToggle();

    function handleSelectOrganize(organizeSelected) {
        const organizeValueSelected = organizeValues.map(item => item.value === organizeSelected.value 
            ? {...item, selected: true}
            : {...item, selected: false}
        )
        setOrganizeSelected(organizeValueSelected)
        console.log(organizeValueSelected)
    }


    return (
        <Dropdown show={isOpen} onToggle={toggleDropdown}>
            <Dropdown.Toggle variant="light">Organizar</Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-animated">
                <ListGroup >
                    {organizeValues.map((v, index) => {
                        return (
                            <ListGroup.Item action
                                key={v.title + index} 
                                onClick={()=>handleSelectOrganize(v)}
                                variant={v.selected ? "primary" : 'none'}
                            >
                                {v.title}
                            </ListGroup.Item> 
                        )
                    })}
                </ListGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
};

