import { Dropdown, ListGroup } from 'react-bootstrap';
import useToggle from './useToggle';



export function FilterDropdown ({ filterValues, handleFilterSelected }) {
    const [isOpen, toggleDropdown] = useToggle();

    function handleSelectFilter(e) {
        const newFilterValues = filterValues.map(v => {
            if (v.value === e.target.value) {
                return {
                    ...v,
                    selected: e.target.checked
                }
            } 
            return v
        });
        
        console.log(newFilterValues)
        handleFilterSelected(newFilterValues)
    }

    return (
        <Dropdown show={isOpen} onToggle={toggleDropdown}>
            <Dropdown.Toggle variant="light">Filtros</Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-animated">
                <ListGroup >
                    {filterValues.map((v, index) => {
                        return (
                            <ListGroup.Item action key={v.title + index}>
                                <input className="form-check-input me-1" type="checkbox" onChange={handleSelectFilter}  value={v.value} />
                                {v.title}
                            </ListGroup.Item> 
                        )
                    })}
                </ListGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
};

