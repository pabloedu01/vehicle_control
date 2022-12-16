import { useState, useEffect } from 'react';
import { Col, Row, Button } from "react-bootstrap";
import { FormInput } from '../../components'
import { useForm } from 'react-hook-form';


const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
    added: false,
});

const defaultOptions = [
    createOption('One'),
    createOption('Two'),
    createOption('Three'),
    createOption('four'),
    createOption('Five'),
    createOption('Six'),
];

export function MultiSelectWithSearch({ dataPackage }) {
    const [data, setData] = useState(dataPackage)
    const [searchLeftResults, setSearchLeftResults] = useState([]);
    const [searchRightResults, setSearchRightResults] = useState([]);
    const [packageLeftValue, setPackageLeftValue] = useState(null);
    const [packageRightValue, setPackageRightValue] = useState(null);


    function handleFilterOptionLeft(e) {
        if (!e.target.value) return setSearchLeftResults(data.filter(opt => opt.added === false))
        const result = data.filter(opt => opt.value.includes(e.target.value.toLowerCase()) && opt.added === false)
        setSearchLeftResults(result)
    }
    function handleFilterOptionRight(e) {
        if (!e.target.value) return setSearchRightResults(data.filter(opt => opt.added === true))
        const result = data.filter(opt => opt.value.includes(e.target.value.toLowerCase()) && opt.added === true)
        setSearchRightResults(result)
    }

    function handleSelectedLeft(e) {
        setPackageLeftValue(prevState => {
            return e.target.value === prevState ? null : e.target.value
        })
    }
    function handleSelectedRight(e) {
        setPackageRightValue(prevState => {
            return e.target.value === prevState ? null : e.target.value
        })
    }

    function handleAdded(value) {
        if (!packageLeftValue) return
        if (packageLeftValue.added) return
        const packages = [...data]
        const findOne = packages.find(p => p.value === value)
        if (!findOne) return
        findOne.added = true
        setData(packages)
    }

    function handleRemove(value) {
        if (!packageLeftValue) return
        if (packageLeftValue.added) return
        const packages = [...data]
        const findOne = packages.find(p => p.value === value)
        if (!findOne) return
        findOne.added = false
        setData(packages)
    }

    useEffect(() => {
        const dataOpened = data.filter(d => d.added === false)
        const dataAdded = data.filter(d => d.added === true)
        setSearchLeftResults(dataOpened)
        setSearchRightResults(dataAdded)
        console.log('render')
    }, [data])





    return (
        <>
            <Row className='d-flex align-items-center justify-content-center'>
                <Col xl={5}>
                    <FormInput
                        type="text"
                        name="searchPackageLeft"
                        containerClass={'mb-3'}
                        key="text"
                        onChange={handleFilterOptionLeft}
                    />
                    <div className="overflow-auto w-100 border border-1 rounded mt-2 p-1 d-flex flex-column align-items-start" style={{
                        width: '100%',
                        height: '150px',
                        listStyle: 'none',
                    }}>
                        {searchLeftResults.map(item => {
                            return (
                                <label className='w-100 rounded p-1' key={item.value} style={{
                                    background: packageLeftValue === item.value ? '#727cf5' : '',
                                    color: packageLeftValue === item.value ? 'white' : '',

                                }}>
                                    <input
                                        type="radio"
                                        name="item-package-left"
                                        value={item.value}
                                        onClick={handleSelectedLeft}
                                        style={{
                                            display: 'none',
                                            background: packageLeftValue === item.value ? 'blue' : ''
                                        }} />
                                    {item.label}
                                </label>
                            )
                        })}
                    </div>
                </Col>
                {/* 
                        <i className='mid mdi-arrow-left-bold-circle'></i>
                        <i className='mid mdi-clipboard-arrow-right'></i>
                        <i className='mid mdi-chevron-right-box'></i>
                        <i className='mid mdi-format-horizontal-align-left'></i>
                        <i className='mid mdi-transfer-right'></i>
                */ }
                <Col xs='auto' className='d-flex flex-column gap-2 p-2'>
                    <Button onClick={() => handleAdded(packageLeftValue)} className="btn-icon" variant='secondary'>
                        <i className='mdi mdi-transfer-right'></i>
                    </Button>
                    <Button onClick={() => handleRemove(packageRightValue)} className="btn-icon" variant='secondary'>
                        <i className='mdi mdi-transfer-left'></i>
                    </Button>
                </Col>
                <Col xl={5}>
                    <FormInput
                        type="text"
                        name="searchPackageLeft"
                        containerClass={'mb-3'}
                        key="text"
                        onChange={handleFilterOptionRight}
                    />
                    <div className="overflow-auto w-100 border border-1 rounded mt-2 p-1 d-flex flex-column align-items-start" style={{
                        width: '100%',
                        height: '150px',
                        listStyle: 'none',
                    }}>
                        {searchRightResults.map(item => {
                            return (
                                <label className='w-100 rounded p-1' key={item.value} style={{
                                    background: packageRightValue === item.value ? '#727cf5' : '',
                                    color: packageRightValue === item.value ? 'white' : '',

                                }}>
                                    <input
                                        type="radio"
                                        name="item-package-left"
                                        value={item.value}
                                        onClick={handleSelectedRight}
                                        style={{
                                            display: 'none',
                                            background: packageRightValue === item.value ? 'blue' : ''
                                        }} />
                                    {item.label}
                                </label>
                            )
                        })}
                    </div>
                </Col>
            </Row>

        </>


    )
}