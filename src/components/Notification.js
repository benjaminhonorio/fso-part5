const Notification = ({ message, classNameType = '' }) => {
  if (message === null) {
    return null
  }

  return <div className={`notification ${classNameType}`}>{message}</div>
}

export default Notification
