// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Select, { components } from 'react-select';

/*
 * get options
 */
const optionGetter = (option) => {
    if (option) {
            return (
                <>
                    <Link to="#" className="dropdown-item notify-item p-0">
                        <div className="d-flex">
                            <div className="w-100">
                                <h5 className="drop-username m-0 font-14">
                                    {option.userDetails.firstname} {option.userDetails.lastname}
                                </h5>
                            </div>
                        </div>
                    </Link>
                </>
            );
    } else
        return;
    }

/* custon control */

const Control = ({ children, ...props }) => {
    const { handleClick } = props.selectProps;
    return (
        <components.Control {...props}>
            <span onMouseDown={handleClick} className="mdi mdi-magnify search-icon"></span>
            {children}
        </components.Control>
    );
};

/* custon indicator */
const IndicatorsContainer = (props) => {
    const { handleClick } = props.selectProps;
    return (
        <div style={{}}>
            <components.IndicatorsContainer {...props} className="input-group">
                <button className="btn btn-primary input-group-text" onMouseDown={handleClick}>
                    Search
                </button>
            </components.IndicatorsContainer>
        </div>
    );
};

/* custom menu list */
const MenuList = (props) => {
    return (
        <components.MenuList {...props}>
            {/* menu header */}

            {props.children}
        </components.MenuList>
    );
};

/* fomates the option label */
const handleFormatOptionLabel = (option) => {
    const formattedOption = optionGetter(option);
    return <div>{formattedOption}</div>;
};

// type TopbarSearchProps = {};

const SearchModified = (props: TopbarSearchProps): React$Element<any> => {
    const options = [
        {
            label: 'Erwin Brown',
            value: 'users1',
            userDetails: {
                firstname: 'Erwin',
                lastname: 'Brown',
                position: 'UI Designer',
            },
        },
        {
            label: 'Jacob Deo',
            value: 'users2',
            userDetails: {
                firstname: 'Jacob',
                lastname: 'Deo',
                position: 'Developer',
            },
        },
    ];

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <Select
                {...props}
                components={{ Control, IndicatorsContainer, MenuList }}
                placeholder={'Procurar...'}
                options={options}
                formatOptionLabel={handleFormatOptionLabel}
                // isOptionDisabled={(option) => option.type === 'title'}
                maxMenuHeight="350px"
                handleClick={onClick}
                isSearchable
                isClearable
                name="search-app"
                className="app-search dropdown"
                classNamePrefix="react-select"
                onChange={(item) => console.log(item)}
            />
        </>
    );
};

export default SearchModified;
