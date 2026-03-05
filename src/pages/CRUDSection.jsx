export const CRUDSection = ({
  label,
  items,
  inputValue,
  editMode,
  editValue,
  listName,
  onInputChange,
  onEditValueChange,
  onAdd,
  onDelete,
  onStartEdit,
  onUpdateItem,
  onCancelEdit
}) => {
  return (
    <div className="settings-group">
      <label className="setting-label">{label}</label>
      <div className="crud-input-group">
        <input
          type="text"
          placeholder={`Add new ${listName.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
          value={inputValue}
          onChange={(e) => onInputChange(e, listName)}
          onKeyPress={(e) => e.key === 'Enter' && onAdd(listName)}
          className="crud-input"
        />
        <button
          type="button"
          className="crud-add-btn"
          onClick={() => onAdd(listName)}
        >
          +
        </button>
      </div>
      <div className="crud-items">
        {items.map((item, index) => (
          <div key={index} className="crud-badge">
            {editMode === index ? (
              <>
                <input
                  type="text"
                  className="crud-edit-input-inline"
                  value={editValue}
                  onChange={(e) => onEditValueChange(e, listName)}
                  onKeyPress={(e) => e.key === 'Enter' && onUpdateItem(listName, index)}
                  autoFocus
                />
                <button
                  type="button"
                  className="action-btn save"
                  onClick={() => onUpdateItem(listName, index)}
                >
                  ✓
                </button>
                <button
                  type="button"
                  className="action-btn delete"
                  onClick={() => onCancelEdit(listName)}
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <span>{item}</span>
                <button
                  type="button"
                  className="action-btn edit"
                  onClick={() => onStartEdit(listName, index, item)}
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="action-btn delete"
                  onClick={() => onDelete(listName, index)}
                >
                  🗑
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
