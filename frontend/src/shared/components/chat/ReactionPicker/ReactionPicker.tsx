import styles from './ReactionPicker.module.css';

interface ReactionPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

const ReactionPicker = ({ onSelect, onClose }: ReactionPickerProps) => {
    const emojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥'];

    const handleSelect = (emoji: string) => {
        onSelect(emoji);
        onClose();
    };

    return (
        <>
            <div className={styles.overlay} onClick={(e) => {
                e.stopPropagation();
                onClose();
            }} />
            <div className={styles.picker} onClick={(e) => e.stopPropagation()}>
                {emojis.map((emoji) => (
                    <button
                        key={emoji}
                        className={styles.emojiButton}
                        onClick={() => handleSelect(emoji)}
                        aria-label={`${emoji}でリアクション`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </>
    );
};

export default ReactionPicker;
