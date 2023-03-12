import {useEffect, useState} from 'react';
import { Button, Modal,Col,Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import {InputPrice} from "../../InputPrice";
import {InputQuantity} from "../../InputQuantity";


export function ModalEditItemsSelected ({ showModal, setShowModalEditRecommendationsItemsSelected, data , handleData}) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
} = useForm({ defaultValues: {
  quantity: '',	
  discount: '',
} });

  function onHideModal () {
    setShowModalEditRecommendationsItemsSelected(false)
  }


  useEffect(() => {
    console.log(data)
    setValue('quantity', data?.quantity ?? null);
    setValue('discount', data?.price_discount ? {
        'formattedValue':  `${data?.price_discount}`,
        'value': `${data?.price_discount}`,
    } :  null);
  }, [data]);


  return (
    <Modal show={showModal} onHide={onHideModal}>
    <form action="" onSubmit={handleSubmit(handleData)}>
    <Modal.Header closeButton>
        <h4 className="modal-title">{data.name}</h4>
    </Modal.Header>
    <Modal.Body className='py-3'>
    <InputQuantity
    label="Quantidade"
    name="quantity"
    placeholder="Digite a quantidade"
    control={control}
    errors={errors}
    containerClass={'mb-3'}
    />
    <InputPrice
      label="Valor do disconto"
      name="discount"
      placeholder="Digite o valor"
      control={control}
      errors={errors}
      containerClass={'mb-3'}
      MAX_LIMIT={8}
    />

    </Modal.Body>
    <Modal.Footer>
      <Button
        type="submit"
        variant="primary"
      >
          Salvar
      </Button>
    </Modal.Footer>
    </form>
</Modal>

  )
}