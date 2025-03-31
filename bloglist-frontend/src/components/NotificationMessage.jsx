const NotificationMessage = ({ notification }) => {
    if (!notification.message) {
        return null
    }

    return (
        <div className={notification.type === 'error' ? 'error' : 'success'}>
            {notification.message}
        </div>
    )
}

export default NotificationMessage