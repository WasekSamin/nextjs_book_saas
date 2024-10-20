const FormErrorElement = ({errorMsg}: {errorMsg: string}) => {
  return (
    <p className='font-medium text-danger'>{errorMsg}</p>
  )
}

export default FormErrorElement